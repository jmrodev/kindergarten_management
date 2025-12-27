const StaffRepository = require('../repositories/StaffRepository');
const bcrypt = require('bcryptjs');
const { AppError } = require('../middleware/errorHandler'); // Import AppError
const { sanitizeObject, sanitizeWhitespace } = require('../utils/sanitization'); // Import sanitization utilities

const StaffController = {
    async getAllStaff(req, res) {
        try {
            const { page = 1, limit = 10, ...filters } = req.query;
            const offset = (page - 1) * limit;

            const [staff, total] = await Promise.all([
                StaffRepository.getAll({
                    filters,
                    pagination: { limit: parseInt(limit), offset: parseInt(offset) }
                }),
                StaffRepository.count(filters)
            ]);

            res.json({
                status: 'success',
                data: staff,
                meta: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            console.error('Error in getAllStaff:', error);
            throw new AppError('Error al obtener personal', 500);
        }
    },

    async getStaffById(req, res) {
        try {
            const staff = await StaffRepository.getById(req.params.id);
            if (!staff) {
                throw new AppError('Personal no encontrado', 404);
            }
            res.json(staff);
        } catch (error) {
            console.error('Error in getStaffById:', error);
            throw new AppError('Error al obtener personal', 500);
        }
    },

    async createStaff(req, res) {
        try {
            const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);
            const staffData = { ...sanitizedBody };

            if (staffData.dni) {
                const passwordHash = await bcrypt.hash(staffData.dni, 10);
                staffData.password_hash = passwordHash;
            }

            const id = await StaffRepository.create(staffData);
            const newStaff = await StaffRepository.getById(id);
            res.status(201).json(newStaff);
        } catch (error) {
            console.error('Error in createStaff:', error);
            throw new AppError('Error al crear personal', 500);
        }
    },

    async updateStaff(req, res) {
        try {
            const staff = await StaffRepository.getById(req.params.id);

            if (!staff) {
                throw new AppError('Personal no encontrado', 404);
            }

            const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);

            // Proteger cambio de rol para posiciones de dirección (Administrator y Director)
            const isDirectionRole = staff.role_name === 'Administrator' || staff.role_name === 'Director';
            if (isDirectionRole && sanitizedBody.role_id && sanitizedBody.role_id !== staff.role_id) {
                throw new AppError('No se puede cambiar el rol de usuarios con posiciones de dirección', 403);
            }

            // Actualizar el staff con los datos proporcionados
            await StaffRepository.update(req.params.id, sanitizedBody);

            // Verificar si el rol actualizado es 'Teacher' para manejar la asignación de sala
            const updatedStaffAfterSave = await StaffRepository.getById(req.params.id);
            const isTeacherRole = updatedStaffAfterSave.role_name === 'Teacher';

            // Si se proporciona un classroom_id y el rol es 'Teacher', actualizar también la asignación en la sala
            if (isTeacherRole) {
                if (sanitizedBody.classroom_id) {
                    // Si se está asignando a una sala, actualizar la sala para que apunte a este maestro
                    const ClassroomRepository = require('../repositories/ClassroomRepository');
                    await ClassroomRepository.assignTeacher(sanitizedBody.classroom_id, req.params.id);
                } else if ((sanitizedBody.classroom_id === null || sanitizedBody.classroom_id === '' || sanitizedBody.classroom_id === 0) && staff.classroom_id) {
                    // Si se está desasignando del maestro, también desasignar de la sala si estaba en una
                    const ClassroomRepository = require('../repositories/ClassroomRepository');
                    await ClassroomRepository.assignTeacher(staff.classroom_id, null);
                }
            }

            res.json(updatedStaffAfterSave);
        } catch (error) {
            console.error('Error in updateStaff:', error);
            throw new AppError('Error al actualizar personal', 500);
        }
    },

    async deleteStaff(req, res) {
        try {
            const staff = await StaffRepository.getById(req.params.id);

            if (!staff) {
                throw new AppError('Personal no encontrado', 404);
            }

            // Proteger roles de dirección (Administrator y Director)
            if (staff.role_name === 'Administrator' || staff.role_name === 'Director') {
                throw new AppError('No se puede eliminar usuarios con roles de dirección (Admin/Director)', 403);
            }

            await StaffRepository.delete(req.params.id);
            res.json({ message: 'Personal eliminado correctamente' });
        } catch (error) {
            console.error('Error in deleteStaff:', error);
            throw new AppError('Error al eliminar personal', 500);
        }
    },

    async getRoles(req, res) {
        try {
            const RoleRepository = require('../repositories/RoleRepository');
            const roles = await RoleRepository.getAll();
            res.json(roles);
        } catch (error) {
            console.error('Error in getRoles:', error);
            throw new AppError('Error al obtener roles', 500);
        }
    }
};

module.exports = StaffController;

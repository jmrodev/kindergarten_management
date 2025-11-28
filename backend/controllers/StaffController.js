const StaffRepository = require('../repositories/StaffRepository');
const bcrypt = require('bcryptjs');
const { AppError } = require('../middleware/errorHandler'); // Import AppError
const { sanitizeObject, sanitizeWhitespace } = require('../utils/sanitization'); // Import sanitization utilities

const StaffController = {
    async getAllStaff(req, res) {
        try {
            const staff = await StaffRepository.findAll();
            res.json(staff);
        } catch (error) {
            console.error('Error in getAllStaff:', error);
            throw new AppError('Error al obtener personal', 500);
        }
    },

    async getStaffById(req, res) {
        try {
            const staff = await StaffRepository.findById(req.params.id);
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
            const newStaff = await StaffRepository.findById(id);
            res.status(201).json(newStaff);
        } catch (error) {
            console.error('Error in createStaff:', error);
            throw new AppError('Error al crear personal', 500);
        }
    },

    async updateStaff(req, res) {
        try {
            const staff = await StaffRepository.findById(req.params.id);
            
            if (!staff) {
                throw new AppError('Personal no encontrado', 404);
            }
            
            const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);
            
            // Proteger cambio de rol para posiciones de dirección (admin y directivo)
            const isDirectionRole = staff.role_name === 'admin' || staff.role_name === 'directivo';
            if (isDirectionRole && sanitizedBody.role_id && sanitizedBody.role_id !== staff.role_id) {
                throw new AppError('No se puede cambiar el rol de usuarios con posiciones de dirección', 403);
            }
            
            await StaffRepository.update(req.params.id, sanitizedBody);
            const updatedStaff = await StaffRepository.findById(req.params.id);
            res.json(updatedStaff);
        } catch (error) {
            console.error('Error in updateStaff:', error);
            throw new AppError('Error al actualizar personal', 500);
        }
    },

    async deleteStaff(req, res) {
        try {
            const staff = await StaffRepository.findById(req.params.id);
            
            if (!staff) {
                throw new AppError('Personal no encontrado', 404);
            }
            
            // Proteger roles de dirección (admin y directivo)
            if (staff.role_name === 'admin' || staff.role_name === 'directivo') {
                throw new AppError('No se puede eliminar usuarios con roles de dirección (Admin/Directivo)', 403);
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
            const roles = await StaffRepository.getRoles();
            res.json(roles);
        } catch (error) {
            console.error('Error in getRoles:', error);
            throw new AppError('Error al obtener roles', 500);
        }
    }
};

module.exports = StaffController;

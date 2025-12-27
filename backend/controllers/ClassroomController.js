// backend/controllers/SalaController.js
const ClassroomRepository = require('../repositories/ClassroomRepository');
const { AppError } = require('../middleware/errorHandler'); // Import AppError
const { sanitizeObject, sanitizeWhitespace } = require('../utils/sanitization'); // Import sanitization utilities
const ClassroomValidator = require('../utils/ClassroomValidator');
const { getConnection } = require('../db');

class ClassroomController {
    async createClassroom(req, res) {
        try {
            const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);
            const { name, capacity, shift, academic_year, age_group, is_active, maestroId } = sanitizedBody;

            // Validar los datos usando el validador
            ClassroomValidator.validateForCreate({
                name: name,
                capacity: capacity,
                shift: shift,
                academic_year: academic_year,
                age_group: age_group
            });

            const conn = await getConnection();
            try {
                // Crear la sala
                const result = await conn.query(
                    `INSERT INTO classroom (name, capacity, shift, academic_year, age_group, is_active)
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        name,
                        parseInt(capacity),
                        shift || 'Mañana', // Valor por defecto
                        academic_year || new Date().getFullYear(),
                        age_group || null,
                        is_active !== undefined ? is_active : true
                    ]
                );

                const classroomId = result.insertId;

                // Si se proporciona un maestroId, asignarlo a la sala
                if (maestroId && maestroId !== '') {
                    await conn.query(
                        'UPDATE classroom SET teacher_id = ? WHERE id = ?',
                        [maestroId, classroomId]
                    );
                }

                // Devolver la sala recién creada
                const createdClassroom = await ClassroomRepository.getById(classroomId);
                res.status(201).json({
                    status: 'success',
                    data: createdClassroom
                });
            } finally {
                conn.release();
            }
        } catch (error) {
            console.error("Error in createClassroom:", error);
            // Si es un error de validación (400), mantenerlo tal cual
            if (error.statusCode === 400) {
                throw error;
            } else if (error.errno === 1062) { // ER_DUP_ENTRY - entrada duplicada
                throw new AppError('Ya existe una sala con ese nombre', 400);
            } else if (error.errno === 1452) { // ER_NO_REFERENCED_ROW_2 - constraint de clave foránea
                throw new AppError('Dato de referencia inválido (posible ID inexistente)', 400);
            } else {
                throw new AppError('Error creando sala: ' + error.message, 500);
            }
        }
    }

    async getAllClassrooms(req, res) {
        try {
            const { page = 1, limit = 10, ...filters } = req.query;
            const offset = (page - 1) * limit;

            const [classrooms, total] = await Promise.all([
                ClassroomRepository.getAll({
                    filters,
                    pagination: { limit: parseInt(limit), offset: parseInt(offset) }
                }),
                ClassroomRepository.count(filters)
            ]);

            res.status(200).json({
                status: 'success',
                data: classrooms,
                meta: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            console.error("Error in getAllClassrooms:", error);
            throw new AppError('Error fetching classrooms', 500);
        }
    }

    async getClassroomById(req, res) {
        try {
            const { id } = req.params;
            const classroom = await ClassroomRepository.getById(id);
            if (!classroom) {
                throw new AppError("Classroom not found", 404);
            }
            res.status(200).json({
                status: 'success',
                data: classroom
            });
        } catch (error) {
            console.error(`Error in getClassroomById for id ${req.params.id}:`, error);
            throw new AppError('Error fetching classroom', 500);
        }
    }

    async updateClassroom(req, res) {
        try {
            const { id } = req.params;
            const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);
            const { name, capacity, shift, academic_year, age_group, is_active, maestroId } = sanitizedBody;

            // Validar los datos para actualización
            ClassroomValidator.validateForUpdate({
                name: name,
                capacity: capacity,
                shift: shift,
                academic_year: academic_year,
                age_group: age_group
            }, id);

            const conn = await getConnection();
            try {
                // Actualizar la sala
                const result = await conn.query(
                    `UPDATE classroom SET name = ?, capacity = ?, shift = ?,
                     academic_year = ?, age_group = ?, is_active = ? WHERE id = ?`,
                    [
                        name || null,
                        capacity ? parseInt(capacity) : null,
                        shift || null,
                        academic_year || null,
                        age_group || null,
                        is_active,
                        id
                    ]
                );

                if (result.affectedRows === 0) {
                    throw new AppError("Classroom not found", 404);
                }

                // Si se proporciona un maestroId, actualizar la asignación
                if (maestroId !== undefined) {
                    await conn.query(
                        'UPDATE classroom SET teacher_id = ? WHERE id = ?',
                        [maestroId, id]
                    );
                }

                // Devolver la sala actualizada
                const updatedClassroom = await ClassroomRepository.getById(id);
                res.status(200).json({
                    status: 'success',
                    data: updatedClassroom
                });
            } finally {
                conn.release();
            }
        } catch (error) {
            console.error(`Error in updateClassroom for id ${req.params.id}:`, error);
            // Si es un error de validación (400), mantenerlo tal cual
            if (error.statusCode === 400) {
                throw error;
            } else if (error.errno === 1062) { // ER_DUP_ENTRY - entrada duplicada
                throw new AppError('Ya existe una sala con ese nombre', 400);
            } else if (error.errno === 1452) { // ER_NO_REFERENCED_ROW_2 - constraint de clave foránea
                throw new AppError('Dato de referencia inválido (posible ID inexistente)', 400);
            } else {
                throw new AppError('Error actualizando sala: ' + error.message, 500);
            }
        }
    }

    async deleteClassroom(req, res) {
        try {
            const { id } = req.params;
            const success = await ClassroomRepository.delete(id);
            if (!success) {
                throw new AppError("Classroom not found or could not be deleted", 404);
            }
            res.status(204).send(); // No content for successful deletion
        } catch (error) {
            console.error(`Error in deleteClassroom for id ${req.params.id}:`, error);

            // Check if it's a constraint error
            if (error.message && error.message.includes('student(s) are still assigned')) {
                throw new AppError(error.message, 409);
            }

            throw new AppError('Error deleting classroom', 500);
        }
    }
}

module.exports = new ClassroomController();

// backend/controllers/SalaController.js
const ClassroomRepository = require('../repositories/ClassroomRepository');
const Classroom = require('../models/Classroom');
const { AppError } = require('../middleware/errorHandler'); // Import AppError
const { sanitizeObject, sanitizeWhitespace } = require('../utils/sanitization'); // Import sanitization utilities

class ClassroomController {
    async createClassroom(req, res) {
        try {
            const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);
            const { name, capacity, shift, nombre, capacidad, turno, maestroId } = sanitizedBody;
            const classroomName = name || nombre;
            const classroomCapacity = capacity || capacidad;
            const classroomShift = shift || turno || 'Mañana';
            const newClassroom = new Classroom(null, classroomName, classroomCapacity, classroomShift);

            if (!newClassroom.isValid()) {
                throw new AppError("Invalid classroom data", 400);
            }

            const createdClassroom = await ClassroomRepository.create(newClassroom);
            
            // Si se proporciona un maestroId, asignarlo a la sala
            if (maestroId && maestroId !== '') {
                await ClassroomRepository.assignTeacher(createdClassroom.id, maestroId);
            }
            
            const finalClassroom = await ClassroomRepository.findById(createdClassroom.id);
            res.status(201).json(finalClassroom);
        } catch (error) {
            console.error("Error in createClassroom:", error);
            throw new AppError('Error creating classroom', 500);
        }
    }

    async getAllClassrooms(req, res) {
        try {
            const classrooms = await ClassroomRepository.findAll();
            res.status(200).json(classrooms);
        } catch (error) {
            console.error("Error in getAllClassrooms:", error);
            throw new AppError('Error fetching classrooms', 500);
        }
    }

    async getClassroomById(req, res) {
        try {
            const { id } = req.params;
            const classroom = await ClassroomRepository.findById(id);
            if (!classroom) {
                throw new AppError("Classroom not found", 404);
            }
            res.status(200).json(classroom);
        } catch (error) {
            console.error(`Error in getClassroomById for id ${req.params.id}:`, error);
            throw new AppError('Error fetching classroom', 500);
        }
    }

    async updateClassroom(req, res) {
        try {
            const { id } = req.params;
            const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);
            const { name, capacity, shift, nombre, capacidad, turno, maestroId } = sanitizedBody;
            const classroomName = name || nombre;
            const classroomCapacity = capacity || capacidad;
            const classroomShift = shift || turno;
            const updatedClassroom = new Classroom(id, classroomName, classroomCapacity, classroomShift);

            if (!updatedClassroom.isValid()) {
                throw new AppError("Invalid classroom data", 400);
            }

            const result = await ClassroomRepository.update(id, updatedClassroom);
            
            // Si se proporciona un maestroId, actualizar la asignación
            if (maestroId !== undefined) {
                await ClassroomRepository.assignTeacher(id, maestroId);
            }
            
            const finalClassroom = await ClassroomRepository.findById(id);
            res.status(200).json(finalClassroom);
        } catch (error) {
            console.error(`Error in updateClassroom for id ${req.params.id}:`, error);
            throw new AppError('Error updating classroom', 500);
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

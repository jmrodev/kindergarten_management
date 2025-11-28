// backend/controllers/SalaController.js
const ClassroomRepository = require('../repositories/ClassroomRepository');
const Classroom = require('../models/Classroom');
const { serializeBigInt } = require('../utils/serialization');

class ClassroomController {
    async createClassroom(req, res) {
        try {
            const { name, capacity, shift, nombre, capacidad, turno, maestroId } = req.body;
            const classroomName = name || nombre;
            const classroomCapacity = capacity || capacidad;
            const classroomShift = shift || turno || 'Mañana';
            const newClassroom = new Classroom(null, classroomName, classroomCapacity, classroomShift);

            if (!newClassroom.isValid()) {
                return res.status(400).json({ message: "Invalid classroom data" });
            }

            const createdClassroom = await ClassroomRepository.create(newClassroom);
            
            // Si se proporciona un maestroId, asignarlo a la sala
            if (maestroId && maestroId !== '') {
                await ClassroomRepository.assignTeacher(createdClassroom.id, maestroId);
            }
            
            const finalClassroom = await ClassroomRepository.findById(createdClassroom.id);
            res.status(201).json(serializeBigInt(finalClassroom));
        } catch (error) {
            console.error("Error in createClassroom:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async getAllClassrooms(req, res) {
        try {
            const classrooms = await ClassroomRepository.findAll();
            res.status(200).json(serializeBigInt(classrooms));
        } catch (error) {
            console.error("Error in getAllClassrooms:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async getClassroomById(req, res) {
        try {
            const { id } = req.params;
            const classroom = await ClassroomRepository.findById(id);
            if (!classroom) {
                return res.status(404).json({ message: "Classroom not found" });
            }
            res.status(200).json(serializeBigInt(classroom));
        } catch (error) {
            console.error(`Error in getClassroomById for id ${req.params.id}:`, error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async updateClassroom(req, res) {
        try {
            const { id } = req.params;
            const { name, capacity, shift, nombre, capacidad, turno, maestroId } = req.body;
            const classroomName = name || nombre;
            const classroomCapacity = capacity || capacidad;
            const classroomShift = shift || turno;
            const updatedClassroom = new Classroom(id, classroomName, classroomCapacity, classroomShift);

            if (!updatedClassroom.isValid()) {
                return res.status(400).json({ message: "Invalid classroom data" });
            }

            const result = await ClassroomRepository.update(id, updatedClassroom);
            
            // Si se proporciona un maestroId, actualizar la asignación
            if (maestroId !== undefined) {
                await ClassroomRepository.assignTeacher(id, maestroId);
            }
            
            const finalClassroom = await ClassroomRepository.findById(id);
            res.status(200).json(serializeBigInt(finalClassroom));
        } catch (error) {
            console.error(`Error in updateClassroom for id ${req.params.id}:`, error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async deleteClassroom(req, res) {
        try {
            const { id } = req.params;
            const success = await ClassroomRepository.delete(id);
            if (!success) {
                return res.status(404).json({ message: "Classroom not found or could not be deleted" });
            }
            res.status(204).send(); // No content for successful deletion
        } catch (error) {
            console.error(`Error in deleteClassroom for id ${req.params.id}:`, error);
            
            // Check if it's a constraint error
            if (error.message && error.message.includes('student(s) are still assigned')) {
                return res.status(409).json({ message: error.message });
            }
            
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

module.exports = new ClassroomController();

// backend/controllers/SalaController.js
const ClassroomRepository = require('../repositories/ClassroomRepository');
const Classroom = require('../models/Classroom');
const { serializeBigInt } = require('../utils/serialization');

class ClassroomController {
    async createClassroom(req, res) {
        try {
            const { name, capacity } = req.body;
            const newClassroom = new Classroom(null, name, capacity);

            if (!newClassroom.isValid()) {
                return res.status(400).json({ message: "Invalid classroom data" });
            }

            const createdClassroom = await ClassroomRepository.create(newClassroom);
            res.status(201).json(serializeBigInt(createdClassroom));
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
            const { name, capacity } = req.body;
            const updatedClassroom = new Classroom(id, name, capacity);

            if (!updatedClassroom.isValid()) {
                return res.status(400).json({ message: "Invalid classroom data" });
            }

            const result = await ClassroomRepository.update(id, updatedClassroom);
            res.status(200).json(serializeBigInt(updatedClassroom));
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
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

module.exports = new ClassroomController();

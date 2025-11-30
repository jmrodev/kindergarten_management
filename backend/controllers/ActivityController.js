const ActivityRepository = require('../repositories/ActivityRepository');
const Activity = require('../models/Activity');
const { AppError } = require('../middleware/errorHandler');

class ActivityController {
    async create(req, res) {
        try {
            const { name, descriptionOptional, scheduleOptional, teacherId, classroomId } = req.body;

            const newActivity = new Activity(
                null, name, descriptionOptional, scheduleOptional, teacherId, classroomId
            );

            const createdActivity = await ActivityRepository.create(newActivity);
            res.status(201).json(createdActivity);
        } catch (error) {
            console.error("Error creating activity:", error);
            throw new AppError('Error creating activity', 500);
        }
    }

    async getAll(req, res) {
        try {
            const activities = await ActivityRepository.findAll();
            res.status(200).json(activities);
        } catch (error) {
            console.error("Error fetching activities:", error);
            throw new AppError('Error fetching activities', 500);
        }
    }

    async getByClassroom(req, res) {
        try {
            const { classroomId } = req.params;
            const activities = await ActivityRepository.findByClassroom(classroomId);
            res.status(200).json(activities);
        } catch (error) {
            console.error(`Error fetching activities for classroom ${req.params.classroomId}:`, error);
            throw new AppError('Error fetching activities', 500);
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const success = await ActivityRepository.delete(id);
            if (!success) {
                throw new AppError("Activity not found", 404);
            }
            res.status(204).send();
        } catch (error) {
            console.error(`Error deleting activity ${req.params.id}:`, error);
            throw new AppError('Error deleting activity', 500);
        }
    }
}

module.exports = new ActivityController();

const MeetingMinutesRepository = require('../repositories/MeetingMinutesRepository');
const MeetingMinutes = require('../models/MeetingMinutes');
const { AppError } = require('../middleware/errorHandler');

class MeetingMinutesController {
    async create(req, res) {
        try {
            const {
                meetingType, meetingDate, meetingTime, participants,
                purpose, conclusions, responsibleStaffId
            } = req.body;

            const userId = req.user ? req.user.id : null; // Assuming auth middleware sets req.user

            const newMinutes = new MeetingMinutes(
                null, meetingType, meetingDate, meetingTime, participants,
                purpose, conclusions, responsibleStaffId, userId, null, userId, null
            );

            const createdMinutes = await MeetingMinutesRepository.create(newMinutes);
            res.status(201).json(createdMinutes);
        } catch (error) {
            console.error("Error creating meeting minutes:", error);
            throw new AppError('Error creating meeting minutes', 500);
        }
    }

    async getAll(req, res) {
        try {
            const minutes = await MeetingMinutesRepository.findAll();
            res.status(200).json(minutes);
        } catch (error) {
            console.error("Error fetching meeting minutes:", error);
            throw new AppError('Error fetching meeting minutes', 500);
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const minutes = await MeetingMinutesRepository.findById(id);
            if (!minutes) {
                throw new AppError("Meeting minutes not found", 404);
            }
            res.status(200).json(minutes);
        } catch (error) {
            console.error(`Error fetching meeting minutes ${id}:`, error);
            throw new AppError('Error fetching meeting minutes', 500);
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const {
                meetingType, meetingDate, meetingTime, participants,
                purpose, conclusions, responsibleStaffId
            } = req.body;

            const userId = req.user ? req.user.id : null;

            const existingMinutes = await MeetingMinutesRepository.findById(id);
            if (!existingMinutes) {
                throw new AppError("Meeting minutes not found", 404);
            }

            const updatedMinutes = new MeetingMinutes(
                id, meetingType, meetingDate, meetingTime, participants,
                purpose, conclusions, responsibleStaffId, existingMinutes.createdBy,
                existingMinutes.createdAt, userId, null
            );

            const result = await MeetingMinutesRepository.update(updatedMinutes);
            res.status(200).json(result);
        } catch (error) {
            console.error(`Error updating meeting minutes ${req.params.id}:`, error);
            throw new AppError('Error updating meeting minutes', 500);
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const success = await MeetingMinutesRepository.delete(id);
            if (!success) {
                throw new AppError("Meeting minutes not found", 404);
            }
            res.status(204).send();
        } catch (error) {
            console.error(`Error deleting meeting minutes ${req.params.id}:`, error);
            throw new AppError('Error deleting meeting minutes', 500);
        }
    }
}

module.exports = new MeetingMinutesController();

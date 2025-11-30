const CalendarRepository = require('../repositories/CalendarRepository');
const Calendar = require('../models/Calendar');
const { AppError } = require('../middleware/errorHandler');

class CalendarController {
    async create(req, res) {
        try {
            const { date, description, eventType, classroomId, staffId } = req.body;

            const newEvent = new Calendar(
                null, date, description, eventType, classroomId, staffId
            );

            const createdEvent = await CalendarRepository.create(newEvent);
            res.status(201).json(createdEvent);
        } catch (error) {
            console.error("Error creating calendar event:", error);
            throw new AppError('Error creating calendar event', 500);
        }
    }

    async getByMonth(req, res) {
        try {
            const { month, year } = req.query;
            if (!month || !year) {
                throw new AppError("Month and year are required", 400);
            }
            const events = await CalendarRepository.findByMonth(month, year);
            res.status(200).json(events);
        } catch (error) {
            console.error("Error fetching calendar events:", error);
            throw new AppError('Error fetching calendar events', 500);
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const success = await CalendarRepository.delete(id);
            if (!success) {
                throw new AppError("Event not found", 404);
            }
            res.status(204).send();
        } catch (error) {
            console.error(`Error deleting event ${req.params.id}:`, error);
            throw new AppError('Error deleting event', 500);
        }
    }
}

module.exports = new CalendarController();

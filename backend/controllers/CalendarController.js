// controllers/CalendarController.js
const CalendarRepository = require('../repositories/CalendarRepository');
const ClassroomRepository = require('../repositories/ClassroomRepository');
const StaffRepository = require('../repositories/StaffRepository');
const { AppError } = require('../middleware/errorHandler');

class CalendarController {
  static async getAll(req, res, next) {
    try {
      const filters = {};

      if (req.query.classroomId) filters.classroomId = req.query.classroomId;
      if (req.query.eventType) filters.eventType = req.query.eventType;
      if (req.query.staffId) filters.staffId = req.query.staffId;
      if (req.query.startDate && req.query.endDate) {
        filters.startDate = req.query.startDate;
        filters.endDate = req.query.endDate;
      }

      const calendarEvents = await CalendarRepository.getAll(filters);
      res.status(200).json({
        status: 'success',
        data: calendarEvents
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const calendarEvent = await CalendarRepository.getById(id);

      if (!calendarEvent) {
        return next(new AppError(`No calendar event found with id: ${id}`, 404));
      }

      res.status(200).json({
        status: 'success',
        data: calendarEvent
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      // Validate classroom exists
      if (req.body.classroom_id) {
        const classroom = await ClassroomRepository.getById(req.body.classroom_id);
        if (!classroom) {
          return next(new AppError(`No classroom found with id: ${req.body.classroom_id}`, 404));
        }
      }

      // Validate staff exists
      if (req.body.staff_id) {
        const staff = await StaffRepository.getById(req.body.staff_id);
        if (!staff) {
          return next(new AppError(`No staff found with id: ${req.body.staff_id}`, 404));
        }
      }

      const eventId = await CalendarRepository.create(req.body);
      const createdEvent = await CalendarRepository.getById(eventId);

      res.status(201).json({
        status: 'success',
        message: 'Calendar event created successfully',
        data: createdEvent
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const calendarEvent = await CalendarRepository.getById(id);

      if (!calendarEvent) {
        return next(new AppError(`No calendar event found with id: ${id}`, 404));
      }

      // Validate classroom exists
      if (req.body.classroom_id) {
        const classroom = await ClassroomRepository.getById(req.body.classroom_id);
        if (!classroom) {
          return next(new AppError(`No classroom found with id: ${req.body.classroom_id}`, 404));
        }
      }

      // Validate staff exists
      if (req.body.staff_id) {
        const staff = await StaffRepository.getById(req.body.staff_id);
        if (!staff) {
          return next(new AppError(`No staff found with id: ${req.body.staff_id}`, 404));
        }
      }

      const updated = await CalendarRepository.update(id, req.body);

      if (!updated) {
        return next(new AppError(`No calendar event found with id: ${id}`, 404));
      }

      const updatedEvent = await CalendarRepository.getById(id);

      res.status(200).json({
        status: 'success',
        message: 'Calendar event updated successfully',
        data: updatedEvent
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await CalendarRepository.delete(id);

      if (!deleted) {
        return next(new AppError(`No calendar event found with id: ${id}`, 404));
      }

      res.status(200).json({
        status: 'success',
        message: 'Calendar event deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async getEventsByMonth(req, res, next) {
    try {
      const { year, month } = req.params;

      // Validate year and month
      if (year < 1900 || year > 2100) {
        return next(new AppError('Year must be between 1900 and 2100', 400));
      }

      if (month < 1 || month > 12) {
        return next(new AppError('Month must be between 1 and 12', 400));
      }

      const events = await CalendarRepository.getEventsByMonth(year, month);

      res.status(200).json({
        status: 'success',
        data: events
      });
    } catch (error) {
      next(error);
    }
  }

  static async getEventsByClassroom(req, res, next) {
    try {
      const { classroomId } = req.params;
      const { startDate, endDate } = req.query;

      // Validate classroom exists
      const classroom = await ClassroomRepository.getById(classroomId);
      if (!classroom) {
        return next(new AppError(`No classroom found with id: ${classroomId}`, 404));
      }

      const events = await CalendarRepository.getEventsByClassroom(classroomId, startDate, endDate);

      res.status(200).json({
        status: 'success',
        data: events
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSpecialEvents(req, res, next) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return next(new AppError('Both startDate and endDate are required', 400));
      }

      const events = await CalendarRepository.getSpecialEvents(startDate, endDate);

      res.status(200).json({
        status: 'success',
        data: events
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CalendarController;
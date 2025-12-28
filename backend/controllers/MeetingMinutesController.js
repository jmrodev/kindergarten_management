// controllers/MeetingMinutesController.js
const MeetingMinutesRepository = require('../repositories/MeetingMinutesRepository');
const { AppError } = require('../middleware/errorHandler');

class MeetingMinutesController {
  static async getAll(req, res, next) {
    try {
      const filters = {};

      if (req.query.meetingType) filters.meetingType = req.query.meetingType;
      if (req.query.startDate) filters.startDate = req.query.startDate;
      if (req.query.endDate) filters.endDate = req.query.endDate;

      const meetingMinutes = await MeetingMinutesRepository.getAll(filters);
      res.status(200).json({
        status: 'success',
        data: meetingMinutes
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const meetingMinute = await MeetingMinutesRepository.getById(id);

      if (!meetingMinute) {
        return next(new AppError(`No meeting minutes found with id: ${id}`, 404));
      }

      res.status(200).json({
        status: 'success',
        data: meetingMinute
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      // Add created_by from authenticated user
      req.body.created_by = req.user.id;

      const meetingMinuteId = await MeetingMinutesRepository.create(req.body);
      const createdMeetingMinute = await MeetingMinutesRepository.getById(meetingMinuteId);

      res.status(201).json({
        status: 'success',
        message: 'Meeting minutes created successfully',
        data: createdMeetingMinute
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;

      // Add updated_by from authenticated user
      req.body.updated_by = req.user.id;

      const updated = await MeetingMinutesRepository.update(id, req.body);

      if (!updated) {
        return next(new AppError(`No meeting minutes found with id: ${id}`, 404));
      }

      const updatedMeetingMinute = await MeetingMinutesRepository.getById(id);

      res.status(200).json({
        status: 'success',
        message: 'Meeting minutes updated successfully',
        data: updatedMeetingMinute
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await MeetingMinutesRepository.delete(id);

      if (!deleted) {
        return next(new AppError(`No meeting minutes found with id: ${id}`, 404));
      }

      res.status(200).json({
        status: 'success',
        message: 'Meeting minutes deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MeetingMinutesController;
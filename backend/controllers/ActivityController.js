// controllers/ActivityController.js
const ActivityRepository = require('../repositories/ActivityRepository');
const StaffRepository = require('../repositories/StaffRepository');
const ClassroomRepository = require('../repositories/ClassroomRepository');
const { AppError } = require('../middleware/errorHandler');

class ActivityController {
  static async getAll(req, res, next) {
    try {
      const filters = {};

      if (req.query.teacherId) filters.teacherId = req.query.teacherId;
      if (req.query.classroomId) filters.classroomId = req.query.classroomId;

      const activities = await ActivityRepository.getAll(filters);
      res.status(200).json({
        status: 'success',
        data: activities
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const activity = await ActivityRepository.getById(id);

      if (!activity) {
        return next(new AppError(`No activity found with id: ${id}`, 404));
      }

      res.status(200).json({
        status: 'success',
        data: activity
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      // Validate teacher exists
      if (req.body.teacher_id) {
        const teacher = await StaffRepository.getById(req.body.teacher_id);
        if (!teacher) {
          return next(new AppError(`No teacher found with id: ${req.body.teacher_id}`, 404));
        }
      }

      // Validate classroom exists
      if (req.body.classroom_id) {
        const classroom = await ClassroomRepository.getById(req.body.classroom_id);
        if (!classroom) {
          return next(new AppError(`No classroom found with id: ${req.body.classroom_id}`, 404));
        }
      }

      const activityId = await ActivityRepository.create(req.body);
      const createdActivity = await ActivityRepository.getById(activityId);

      res.status(201).json({
        status: 'success',
        message: 'Activity created successfully',
        data: createdActivity
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const activity = await ActivityRepository.getById(id);

      if (!activity) {
        return next(new AppError(`No activity found with id: ${id}`, 404));
      }

      // Validate teacher exists
      if (req.body.teacher_id) {
        const teacher = await StaffRepository.getById(req.body.teacher_id);
        if (!teacher) {
          return next(new AppError(`No teacher found with id: ${req.body.teacher_id}`, 404));
        }
      }

      // Validate classroom exists
      if (req.body.classroom_id) {
        const classroom = await ClassroomRepository.getById(req.body.classroom_id);
        if (!classroom) {
          return next(new AppError(`No classroom found with id: ${req.body.classroom_id}`, 404));
        }
      }

      const updated = await ActivityRepository.update(id, req.body);

      if (!updated) {
        return next(new AppError(`No activity found with id: ${id}`, 404));
      }

      const updatedActivity = await ActivityRepository.getById(id);

      res.status(200).json({
        status: 'success',
        message: 'Activity updated successfully',
        data: updatedActivity
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await ActivityRepository.delete(id);

      if (!deleted) {
        return next(new AppError(`No activity found with id: ${id}`, 404));
      }

      res.status(200).json({
        status: 'success',
        message: 'Activity deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async getByClassroom(req, res, next) {
    try {
      const { classroomId } = req.params;

      // Validate classroom exists
      const classroom = await ClassroomRepository.getById(classroomId);
      if (!classroom) {
        return next(new AppError(`No classroom found with id: ${classroomId}`, 404));
      }

      const activities = await ActivityRepository.getByClassroom(classroomId);

      res.status(200).json({
        status: 'success',
        data: activities
      });
    } catch (error) {
      next(error);
    }
  }

  static async getByTeacher(req, res, next) {
    try {
      const { teacherId } = req.params;

      // Validate teacher exists
      const teacher = await StaffRepository.getById(teacherId);
      if (!teacher) {
        return next(new AppError(`No teacher found with id: ${teacherId}`, 404));
      }

      const activities = await ActivityRepository.getByTeacher(teacherId);

      res.status(200).json({
        status: 'success',
        data: activities
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSpecialActivities(req, res, next) {
    try {
      const activities = await ActivityRepository.getSpecialActivities();

      res.status(200).json({
        status: 'success',
        data: activities
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ActivityController;
// controllers/AttendanceController.js
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Staff = require('../models/Staff');
const Classroom = require('../models/Classroom');
const { AppError } = require('../middleware/errorHandler');

class AttendanceController {
  static async getAll(req, res, next) {
    try {
      const filters = {};
      
      if (req.query.studentId) filters.studentId = req.query.studentId;
      if (req.query.staffId) filters.staffId = req.query.staffId;
      if (req.query.classroomId) filters.classroomId = req.query.classroomId;
      if (req.query.date) filters.date = req.query.date;
      if (req.query.startDate && req.query.endDate) {
        filters.startDate = req.query.startDate;
        filters.endDate = req.query.endDate;
      }

      const attendances = await Attendance.getAll(filters);
      res.status(200).json({
        status: 'success',
        data: attendances
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const attendance = await Attendance.getById(id);

      if (!attendance) {
        return next(new AppError(`No attendance record found with id: ${id}`, 404));
      }

      res.status(200).json({
        status: 'success',
        data: attendance
      });
    } catch (error) {
      next(error);
    }
  }

  static async getByStudentAndDate(req, res, next) {
    try {
      const { studentId, date } = req.params;
      const attendance = await Attendance.getByStudentAndDate(studentId, date);

      if (!attendance) {
        return next(new AppError(`No attendance record found for student ${studentId} on date ${date}`, 404));
      }

      res.status(200).json({
        status: 'success',
        data: attendance
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      // Validate student exists if it's a student attendance
      if (req.body.student_id) {
        const student = await Student.getById(req.body.student_id);
        if (!student) {
          return next(new AppError(`No student found with id: ${req.body.student_id}`, 404));
        }
      }

      // Validate staff exists if it's a staff attendance
      if (req.body.staff_id) {
        const staff = await Staff.getById(req.body.staff_id);
        if (!staff) {
          return next(new AppError(`No staff found with id: ${req.body.staff_id}`, 404));
        }
      }

      // Validate classroom exists
      if (req.body.classroom_id) {
        const classroom = await Classroom.getById(req.body.classroom_id);
        if (!classroom) {
          return next(new AppError(`No classroom found with id: ${req.body.classroom_id}`, 404));
        }
      }

      const attendanceId = await Attendance.create(req.body);
      const createdAttendance = await Attendance.getById(attendanceId);

      res.status(201).json({
        status: 'success',
        message: 'Attendance record created successfully',
        data: createdAttendance
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const attendance = await Attendance.getById(id);

      if (!attendance) {
        return next(new AppError(`No attendance record found with id: ${id}`, 404));
      }

      // Validate student exists if it's a student attendance
      if (req.body.student_id) {
        const student = await Student.getById(req.body.student_id);
        if (!student) {
          return next(new AppError(`No student found with id: ${req.body.student_id}`, 404));
        }
      }

      // Validate staff exists if it's a staff attendance
      if (req.body.staff_id) {
        const staff = await Staff.getById(req.body.staff_id);
        if (!staff) {
          return next(new AppError(`No staff found with id: ${req.body.staff_id}`, 404));
        }
      }

      // Validate classroom exists
      if (req.body.classroom_id) {
        const classroom = await Classroom.getById(req.body.classroom_id);
        if (!classroom) {
          return next(new AppError(`No classroom found with id: ${req.body.classroom_id}`, 404));
        }
      }

      const updated = await Attendance.update(id, req.body);

      if (!updated) {
        return next(new AppError(`No attendance record found with id: ${id}`, 404));
      }

      const updatedAttendance = await Attendance.getById(id);

      res.status(200).json({
        status: 'success',
        message: 'Attendance record updated successfully',
        data: updatedAttendance
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await Attendance.delete(id);

      if (!deleted) {
        return next(new AppError(`No attendance record found with id: ${id}`, 404));
      }

      res.status(200).json({
        status: 'success',
        message: 'Attendance record deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async getDailyAttendance(req, res, next) {
    try {
      const { date } = req.params;
      const dailyAttendance = await Attendance.getDailyAttendance(date);

      res.status(200).json({
        status: 'success',
        data: dailyAttendance
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStaffAttendance(req, res, next) {
    try {
      const filters = {};
      
      if (req.query.staffId) filters.staffId = req.query.staffId;
      if (req.query.date) filters.date = req.query.date;
      if (req.query.startDate && req.query.endDate) {
        filters.startDate = req.query.startDate;
        filters.endDate = req.query.endDate;
      }

      const staffAttendance = await Attendance.getStaffAttendance(filters);

      res.status(200).json({
        status: 'success',
        data: staffAttendance
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AttendanceController;
// routes/attendanceRoutes.js
const express = require('express');
const router = express.Router();
const AttendanceController = require('../controllers/AttendanceController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require appropriate permissions
router.use(protect);

// GET /api/attendance/staff - Specific routes before generic :id route
router.route('/staff')
  .get(authorize('admin', 'director', 'secretary'), AttendanceController.getStaffAttendance);

// GET /api/attendance/student/:studentId/date/:date
router.route('/student/:studentId/date/:date')
  .get(authorize('admin', 'director', 'secretary', 'teacher'), AttendanceController.getByStudentAndDate);

// GET /api/attendance/daily/:date
router.route('/daily/:date')
  .get(authorize('admin', 'director', 'secretary', 'teacher'), AttendanceController.getDailyAttendance);

// GET /api/attendance
router.route('/')
  .get(authorize('admin', 'director', 'secretary', 'teacher'), AttendanceController.getAll)
  .post(authorize('admin', 'director', 'teacher'), AttendanceController.create);

// GET /api/attendance/:id - Generic route last to catch all other IDs
router.route('/:id')
  .get(authorize('admin', 'director', 'secretary', 'teacher'), AttendanceController.getById)
  .put(authorize('admin', 'director', 'teacher'), AttendanceController.update)
  .delete(authorize('admin', 'director'), AttendanceController.delete);

module.exports = router;
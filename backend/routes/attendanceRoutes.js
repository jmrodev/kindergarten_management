// routes/attendanceRoutes.js
const express = require('express')
const router = express.Router()
const AttendanceController = require('../controllers/AttendanceController')
const { protect, checkPermission } = require('../middleware/auth')

// All routes are protected and check permissions from role_permission table
router.use(protect)

// GET /api/attendance/staff - Specific routes before generic :id route
router
  .route('/staff')
  .get(
    checkPermission('asistencia', 'ver'),
    AttendanceController.getStaffAttendance
  )

// GET /api/attendance/student/:studentId/date/:date
router
  .route('/student/:studentId/date/:date')
  .get(
    checkPermission('asistencia', 'ver'),
    AttendanceController.getByStudentAndDate
  )

// GET /api/attendance/daily/:date
router
  .route('/daily/:date')
  .get(
    checkPermission('asistencia', 'ver'),
    AttendanceController.getDailyAttendance
  )

// GET /api/attendance
router
  .route('/')
  .get(checkPermission('asistencia', 'ver'), AttendanceController.getAll)
  .post(checkPermission('asistencia', 'crear'), AttendanceController.create)

// GET /api/attendance/:id - Generic route last to catch all other IDs
router
  .route('/:id')
  .get(checkPermission('asistencia', 'ver'), AttendanceController.getById)
  .put(checkPermission('asistencia', 'editar'), AttendanceController.update)
  .delete(
    checkPermission('asistencia', 'eliminar'),
    AttendanceController.delete
  )

module.exports = router

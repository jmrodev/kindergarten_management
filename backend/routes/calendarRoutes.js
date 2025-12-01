// routes/calendarRoutes.js
const express = require('express');
const router = express.Router();
const CalendarController = require('../controllers/CalendarController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require appropriate permissions
router.use(protect);

// GET /api/calendar/special - Specific routes before generic :id route
router.route('/special')
  .get(authorize('admin', 'director', 'secretary', 'teacher'), CalendarController.getSpecialEvents);

// GET /api/calendar/month/:year/:month
router.route('/month/:year/:month')
  .get(authorize('admin', 'director', 'secretary', 'teacher'), CalendarController.getEventsByMonth);

// GET /api/calendar/classroom/:classroomId
router.route('/classroom/:classroomId')
  .get(authorize('admin', 'director', 'secretary', 'teacher'), CalendarController.getEventsByClassroom);

// GET /api/calendar
router.route('/')
  .get(authorize('admin', 'director', 'secretary', 'teacher'), CalendarController.getAll)
  .post(authorize('admin', 'director', 'secretary'), CalendarController.create);

// GET /api/calendar/:id - Generic route last to catch all other IDs
router.route('/:id')
  .get(authorize('admin', 'director', 'secretary', 'teacher'), CalendarController.getById)
  .put(authorize('admin', 'director', 'secretary'), CalendarController.update)
  .delete(authorize('admin', 'director'), CalendarController.delete);

module.exports = router;
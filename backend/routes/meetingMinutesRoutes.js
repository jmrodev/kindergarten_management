// routes/meetingMinutesRoutes.js
const express = require('express');
const router = express.Router();
const MeetingMinutesController = require('../controllers/MeetingMinutesController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require appropriate permissions
router.use(protect);

// GET /api/meeting-minutes
router.route('/')
  .get(authorize('admin', 'director', 'secretary'), MeetingMinutesController.getAll)
  .post(authorize('admin', 'director'), MeetingMinutesController.create);

// GET /api/meeting-minutes/:id
router.route('/:id')
  .get(authorize('admin', 'director', 'secretary', 'teacher'), MeetingMinutesController.getById)
  .put(authorize('admin', 'director'), MeetingMinutesController.update)
  .delete(authorize('admin', 'director'), MeetingMinutesController.delete);

module.exports = router;
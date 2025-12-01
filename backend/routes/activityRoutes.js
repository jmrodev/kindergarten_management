// routes/activityRoutes.js
const express = require('express');
const router = express.Router();
const ActivityController = require('../controllers/ActivityController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require appropriate permissions
router.use(protect);

// GET /api/activities/special - Specific routes before generic :id route
router.route('/special')
  .get(authorize('admin', 'director', 'secretary', 'teacher'), ActivityController.getSpecialActivities);

// GET /api/activities/classroom/:classroomId
router.route('/classroom/:classroomId')
  .get(authorize('admin', 'director', 'secretary', 'teacher'), ActivityController.getByClassroom);

// GET /api/activities/teacher/:teacherId
router.route('/teacher/:teacherId')
  .get(authorize('admin', 'director', 'secretary', 'teacher'), ActivityController.getByTeacher);

// GET /api/activities
router.route('/')
  .get(authorize('admin', 'director', 'secretary', 'teacher'), ActivityController.getAll)
  .post(authorize('admin', 'director', 'teacher'), ActivityController.create);

// GET /api/activities/:id - Generic route last to catch all other IDs
router.route('/:id')
  .get(authorize('admin', 'director', 'secretary', 'teacher'), ActivityController.getById)
  .put(authorize('admin', 'director', 'teacher'), ActivityController.update)
  .delete(authorize('admin', 'director'), ActivityController.delete);

module.exports = router;
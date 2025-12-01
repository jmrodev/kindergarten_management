// routes/vaccinationRecordRoutes.js
const express = require('express');
const router = express.Router();
const VaccinationRecordController = require('../controllers/VaccinationRecordController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require appropriate permissions
router.use(protect);

// GET /api/vaccination-records/summary - This needs to come before the generic :id route
router.route('/summary')
  .get(authorize('admin', 'director', 'secretary'), VaccinationRecordController.getVaccinationStatusSummary);

// GET /api/vaccination-records
router.route('/')
  .get(authorize('admin', 'director', 'secretary', 'teacher'), VaccinationRecordController.getAll)
  .post(authorize('admin', 'director', 'secretary'), VaccinationRecordController.create);

// GET /api/vaccination-records/student/:studentId
router.route('/student/:studentId')
  .get(authorize('admin', 'director', 'secretary', 'teacher'), VaccinationRecordController.getByStudentId);

// GET /api/vaccination-records/:id - This should come last to catch all other IDs
router.route('/:id')
  .get(authorize('admin', 'director', 'secretary', 'teacher'), VaccinationRecordController.getById)
  .put(authorize('admin', 'director', 'secretary'), VaccinationRecordController.update)
  .delete(authorize('admin', 'director'), VaccinationRecordController.delete);

module.exports = router;
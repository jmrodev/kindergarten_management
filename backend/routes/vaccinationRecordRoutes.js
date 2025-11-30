const express = require('express');
const router = express.Router();
const VaccinationRecordController = require('../controllers/VaccinationRecordController');
const { isAuthenticated, hasPermission } = require('../middleware/auth');

// Apply authentication
router.use(isAuthenticated);

router.post('/', VaccinationRecordController.create);
router.get('/student/:studentId', VaccinationRecordController.getByStudentId);
router.get('/:id', VaccinationRecordController.getById);
router.put('/:id', VaccinationRecordController.update);
router.delete('/:id', VaccinationRecordController.delete);

module.exports = router;

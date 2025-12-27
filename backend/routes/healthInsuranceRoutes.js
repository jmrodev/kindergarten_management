const express = require('express');
const router = express.Router();
const HealthInsuranceController = require('../controllers/HealthInsuranceController');

router.get('/', HealthInsuranceController.getAll);
router.post('/', HealthInsuranceController.create);

module.exports = router;

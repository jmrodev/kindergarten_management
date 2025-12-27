const express = require('express');
const router = express.Router();
const PediatricianController = require('../controllers/PediatricianController');

router.get('/', PediatricianController.getAll);
router.post('/', PediatricianController.create);

module.exports = router;

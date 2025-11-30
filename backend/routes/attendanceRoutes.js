const express = require('express');
const router = express.Router();
const AttendanceController = require('../controllers/AttendanceController');
const { isAuthenticated } = require('../middleware/auth');

router.use(isAuthenticated);

router.post('/', AttendanceController.create);
router.get('/', AttendanceController.getByDateAndClassroom);
router.get('/staff', AttendanceController.getStaffAttendance);
router.put('/:id', AttendanceController.update);

module.exports = router;

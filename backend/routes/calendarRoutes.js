const express = require('express');
const router = express.Router();
const CalendarController = require('../controllers/CalendarController');
const { isAuthenticated } = require('../middleware/auth');

router.use(isAuthenticated);

router.post('/', CalendarController.create);
router.get('/', CalendarController.getByMonth);
router.delete('/:id', CalendarController.delete);

module.exports = router;

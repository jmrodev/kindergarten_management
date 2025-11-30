const express = require('express');
const router = express.Router();
const MeetingMinutesController = require('../controllers/MeetingMinutesController');
const { isAuthenticated, hasPermission } = require('../middleware/auth'); // Assuming these exist

// Apply authentication to all routes
router.use(isAuthenticated);

router.post('/', MeetingMinutesController.create);
router.get('/', MeetingMinutesController.getAll);
router.get('/:id', MeetingMinutesController.getById);
router.put('/:id', MeetingMinutesController.update);
router.delete('/:id', MeetingMinutesController.delete);

module.exports = router;

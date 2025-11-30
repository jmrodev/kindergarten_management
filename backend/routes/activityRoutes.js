const express = require('express');
const router = express.Router();
const ActivityController = require('../controllers/ActivityController');
const { isAuthenticated } = require('../middleware/auth');

router.use(isAuthenticated);

router.post('/', ActivityController.create);
router.get('/', ActivityController.getAll);
router.get('/classroom/:classroomId', ActivityController.getByClassroom);
router.delete('/:id', ActivityController.delete);

module.exports = router;

// backend/routes/salaRoutes.js
const express = require('express');
const router = express.Router();
const ClassroomController = require('../controllers/ClassroomController');

// GET all salas
router.get('/', ClassroomController.getAllClassrooms);

// GET a single sala by ID
router.get('/:id', ClassroomController.getClassroomById);

// POST a new sala
router.post('/', ClassroomController.createClassroom);

// PUT (update) an existing sala by ID
router.put('/:id', ClassroomController.updateClassroom);

// DELETE a sala by ID
router.delete('/:id', ClassroomController.deleteClassroom);

module.exports = router;

// backend/routes/alumnoRoutes.js
const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/StudentController');

// GET search students with filters (debe ir antes de /:id para evitar conflictos)
router.get('/search', StudentController.searchStudents);

// GET all alumnos
router.get('/', StudentController.getAllStudents);

// GET a single alumno by ID
router.get('/:id', StudentController.getStudentById);

// POST a new alumno
router.post('/', StudentController.createStudent);

// PUT (update) an existing alumno by ID
router.put('/:id', StudentController.updateStudent);

// PATCH assign classroom to student
router.patch('/:studentId/assign-classroom', StudentController.assignClassroom);

// DELETE an alumno by ID
router.delete('/:id', StudentController.deleteStudent);

module.exports = router;

// backend/routes/alumnoRoutes.js
const express = require('express')
const router = express.Router()
const StudentController = require('../controllers/StudentController')
const { protect, checkPermission } = require('../middleware/auth')

// All routes protected and check permissions from role_permission table
router.use(protect)

// GET search students with filters (debe ir antes de /:id para evitar conflictos)
router.get(
  '/search',
  checkPermission('alumnos', 'ver'),
  StudentController.searchStudents
)

// GET all alumnos
router.get(
  '/',
  checkPermission('alumnos', 'ver'),
  StudentController.getAllStudents
)

// GET a single alumno by ID
router.get(
  '/:id',
  checkPermission('alumnos', 'ver'),
  StudentController.getStudentById
)

// POST a new alumno
router.post(
  '/',
  checkPermission('alumnos', 'crear'),
  StudentController.createStudent
)

// PUT (update) an existing alumno by ID
router.put(
  '/:id',
  checkPermission('alumnos', 'editar'),
  StudentController.updateStudent
)

// PATCH assign classroom to student
router.patch(
  '/:studentId/assign-classroom',
  checkPermission('alumnos', 'gestionar'),
  StudentController.assignClassroom
)

// DELETE an alumno by ID
router.delete(
  '/:id',
  checkPermission('alumnos', 'eliminar'),
  StudentController.deleteStudent
)

module.exports = router

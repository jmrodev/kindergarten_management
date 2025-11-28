// backend/routes/enrollmentRoutes.js
const express = require('express');
const router = express.Router();
const EnrollmentController = require('../controllers/EnrollmentController');

// GET - Obtener estadísticas de inscripciones (debe ir primero)
router.get('/stats/summary', EnrollmentController.getEnrollmentStats);

// GET - Obtener inscripciones incompletas (debe ir antes de /:studentId)
router.get('/incomplete/list', EnrollmentController.getIncompleteEnrollments);

// GET - Obtener todas las inscripciones con estado
router.get('/', EnrollmentController.getAllEnrollments);

// POST - Crear inscripción completa (alumno + responsables + contactos emergencia)
router.post('/', EnrollmentController.createEnrollment);

// GET - Obtener inscripción completa por ID de alumno
router.get('/:studentId', EnrollmentController.getEnrollmentByStudent);

// PUT - Actualizar inscripción completa
router.put('/:studentId', EnrollmentController.updateEnrollment);

// PATCH - Cambiar estado de inscripción
router.patch('/:studentId/status', EnrollmentController.updateEnrollmentStatus);

module.exports = router;

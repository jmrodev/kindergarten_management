// backend/routes/guardianRoutes.js
const express = require('express');
const router = express.Router();
const GuardianController = require('../controllers/GuardianController');
const { protect } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(protect);

// CRUD de Guardians
router.get('/', GuardianController.getAllGuardians);
router.post('/', GuardianController.createGuardian);

// Gestión de relaciones con estudiantes (ANTES de /:id para evitar conflictos)
router.get('/relationships', GuardianController.getAllRelationships);
router.get('/student/:studentId', GuardianController.getGuardiansByStudent);
router.post('/student/:studentId/guardian/:guardianId', GuardianController.assignGuardianToStudent);
router.put('/student/:studentId/guardian/:guardianId', GuardianController.updateGuardianRelation);
router.delete('/student/:studentId/guardian/:guardianId', GuardianController.removeGuardianFromStudent);

// CRUD con ID (debe ir después de las rutas específicas)
router.get('/:id', GuardianController.getGuardianById);
router.put('/:id', GuardianController.updateGuardian);
router.delete('/:id', GuardianController.deleteGuardian);

module.exports = router;

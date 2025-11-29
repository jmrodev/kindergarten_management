const express = require('express');
const router = express.Router();
const RoleController = require('../controllers/RoleController');
const { authenticateToken: protect, authorizeRole } = require('../middleware/auth');

// Role management routes
router.get('/', protect, authorizeRole(['Administrator']), RoleController.getAllRoles);
router.get('/:id', protect, authorizeRole(['Administrator']), RoleController.getRoleById);
router.post('/', protect, authorizeRole(['Administrator']), RoleController.createRole);
router.put('/:id', protect, authorizeRole(['Administrator']), RoleController.updateRole);
router.delete('/:id', protect, authorizeRole(['Administrator']), RoleController.deleteRole);

// Access Level routes (can be managed by admin as well)
router.get('/access-levels', protect, authorizeRole(['Administrator']), RoleController.getAllAccessLevels);
router.post('/access-levels', protect, authorizeRole(['Administrator']), RoleController.createAccessLevel);

module.exports = router;

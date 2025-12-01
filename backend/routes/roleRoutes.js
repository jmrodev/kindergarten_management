const express = require('express');
const router = express.Router();
const RoleController = require('../controllers/RoleController');
const { protect, authorize } = require('../middleware/auth');

// Role management routes
router.get('/', protect, authorize('administrator'), RoleController.getAllRoles);
router.get('/:id', protect, authorize('administrator'), RoleController.getRoleById);
router.post('/', protect, authorize('administrator'), RoleController.createRole);
router.put('/:id', protect, authorize('administrator'), RoleController.updateRole);
router.delete('/:id', protect, authorize('administrator'), RoleController.deleteRole);

// Access Level routes (can be managed by admin as well)
router.get('/access-levels', protect, authorize('administrator'), RoleController.getAllAccessLevels);
router.post('/access-levels', protect, authorize('administrator'), RoleController.createAccessLevel);

module.exports = router;

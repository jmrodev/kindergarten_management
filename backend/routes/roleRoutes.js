const express = require('express')
const router = express.Router()
const RoleController = require('../controllers/RoleController')
const { protect, checkPermission } = require('../middleware/auth')

// Role management routes - check permissions from role_permission table
router.use(protect)

router.get('/', checkPermission('roles', 'ver'), RoleController.getAllRoles)
router.get('/:id', checkPermission('roles', 'ver'), RoleController.getRoleById)
router.post('/', checkPermission('roles', 'crear'), RoleController.createRole)
router.put(
  '/:id',
  checkPermission('roles', 'editar'),
  RoleController.updateRole
)
router.delete(
  '/:id',
  checkPermission('roles', 'eliminar'),
  RoleController.deleteRole
)

// Access Level routes
router.get(
  '/access-levels',
  checkPermission('configuracion', 'ver'),
  RoleController.getAllAccessLevels
)
router.post(
  '/access-levels',
  checkPermission('configuracion', 'crear'),
  RoleController.createAccessLevel
)

module.exports = router

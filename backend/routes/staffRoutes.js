const express = require('express')
const router = express.Router()
const StaffController = require('../controllers/StaffController')
const { protect, checkPermission } = require('../middleware/auth')

// All routes protected and check permissions from role_permission table
router.use(protect)

// Directory route - accessible to all authenticated staff
router.get('/directory', StaffController.getAllStaff)

router.get('/', checkPermission('personal', 'ver'), StaffController.getAllStaff)
router.get(
  '/roles',
  checkPermission('configuracion', 'ver'),
  StaffController.getRoles
)
router.get(
  '/:id',
  checkPermission('personal', 'ver'),
  StaffController.getStaffById
)
router.post(
  '/',
  checkPermission('personal', 'crear'),
  StaffController.createStaff
)
router.put(
  '/:id',
  checkPermission('personal', 'editar'),
  StaffController.updateStaff
)
router.delete(
  '/:id',
  checkPermission('personal', 'eliminar'),
  StaffController.deleteStaff
)

module.exports = router

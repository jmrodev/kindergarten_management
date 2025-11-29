const express = require('express');
const router = express.Router();
const StaffController = require('../controllers/StaffController');
const { authenticateToken, authorizeRole } = require('../middleware/auth'); // Import auth middleware

router.get('/', StaffController.getAllStaff);
router.get('/roles', authenticateToken, authorizeRole(['Administrator', 'Directivo']), StaffController.getRoles); // Using authorizeRole
router.get('/:id', StaffController.getStaffById);
router.post('/', StaffController.createStaff);
router.put('/:id', StaffController.updateStaff);
router.delete('/:id', StaffController.deleteStaff);

module.exports = router;

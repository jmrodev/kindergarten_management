const express = require('express');
const router = express.Router();
const StaffController = require('../controllers/StaffController');
const { protect, authorize } = require('../middleware/auth'); // Import auth middleware

router.get('/', StaffController.getAllStaff);
router.get('/roles', protect, authorize('administrator', 'director'), StaffController.getRoles); // Using authorize with lowercase role names
router.get('/:id', StaffController.getStaffById);
router.post('/', StaffController.createStaff);
router.put('/:id', StaffController.updateStaff);
router.delete('/:id', StaffController.deleteStaff);

module.exports = router;

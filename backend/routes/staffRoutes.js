const express = require('express');
const router = express.Router();
const StaffController = require('../controllers/StaffController');

router.get('/', StaffController.getAllStaff);
router.get('/roles', StaffController.getRoles);
router.get('/:id', StaffController.getStaffById);
router.post('/', StaffController.createStaff);
router.put('/:id', StaffController.updateStaff);
router.delete('/:id', StaffController.deleteStaff);

module.exports = router;

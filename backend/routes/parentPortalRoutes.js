const express = require('express');
const router = express.Router();
const ParentPortalController = require('../controllers/ParentPortalController');
const { authorizeParent } = require('../middleware/parentAuth');
const { generateToken, protect } = require('../middleware/auth');
const { optionalAuth } = require('../middleware/optionalAuth');

// Standard Authentication Routes
router.post('/login', ParentPortalController.login);
router.post('/register', ParentPortalController.register);

// Check authentication status
router.get('/check-auth', optionalAuth, ParentPortalController.checkAuth);

// Draft management - protegido con JWT
router.get('/draft/:userId', protect, ParentPortalController.getDraftByUserId);
router.post('/draft', protect, ParentPortalController.saveDraft);
router.delete('/draft/:userId', protect, ParentPortalController.deleteDraftByUserId);

// Submit registration - protegido con JWT
router.post('/submission', protect, ParentPortalController.submitRegistration);

// Get parent user info - protegido con JWT
router.get('/portal-user/:id', protect, ParentPortalController.getParentUser);

// Get students by parent - protegido con JWT
router.get('/students/:parentId', protect, ParentPortalController.getStudentsByParent);

// Get children by parent (for dashboard) - protected with JWT
router.get('/children/parent/:parentId', protect, ParentPortalController.getChildrenByParent);
router.get('/my-children', protect, (req, res) => ParentPortalController.getMyChildren(req, res));

// Get attendance by child ID (for dashboard) - protected with JWT
router.get('/attendance/child/:childId', protect, ParentPortalController.getAttendanceByChildId);

// Get enrollment status (unprotected, for frontend display)
router.get('/enrollment-status', ParentPortalController.getEnrollmentStatus);

// Logout - no necesario para JWT
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ error: 'Error logging out' });
        res.json({ success: true });
    });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const passport = require('passport');
const ParentPortalController = require('../controllers/ParentPortalController');
const { authorizeParent } = require('../middleware/parentAuth');
const { generateToken, protect } = require('../middleware/auth'); // Importar la función de generación de token y protección
const { optionalAuth } = require('../middleware/optionalAuth'); // Importar la autenticación opcional

// Google OAuth routes
router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login?error=auth' }),
    (req, res) => {
        // Generar token JWT para la autenticación con el frontend
        const token = generateToken({
            id: req.user.id,
            email: req.user.email,
            name: req.user.name,
            google_user: true  // Indicar que es un usuario de Google
        });

        // Redirigir al frontend con el token como parámetro
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}/auth/google?token=${token}`);
    }
);

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

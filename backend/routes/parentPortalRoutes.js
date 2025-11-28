const express = require('express');
const router = express.Router();
const passport = require('passport');
const ParentPortalController = require('../controllers/ParentPortalController');

// Google OAuth routes
router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/parent-portal?error=auth' }),
    (req, res) => {
        res.redirect(process.env.PARENT_PORTAL_REDIRECT_URL || 'http://localhost:5173/parent-portal');
    }
);

// Check authentication status
router.get('/check-auth', ParentPortalController.checkAuth);

// Draft management
router.get('/draft', ParentPortalController.ensureAuthenticated, ParentPortalController.getDraft);
router.post('/draft', ParentPortalController.ensureAuthenticated, ParentPortalController.saveDraft);
router.delete('/draft', ParentPortalController.ensureAuthenticated, ParentPortalController.deleteDraft);

// Submit complete registration
router.post('/submit', ParentPortalController.ensureAuthenticated, ParentPortalController.submitRegistration);

// Logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ error: 'Error logging out' });
        res.json({ success: true });
    });
});

module.exports = router;

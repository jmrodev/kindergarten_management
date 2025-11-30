const express = require('express');
const router = express.Router();
const DocumentReviewController = require('../controllers/DocumentReviewController');
const { isAuthenticated, hasPermission } = require('../middleware/auth');

// Apply authentication
router.use(isAuthenticated);

router.post('/', DocumentReviewController.create);
router.get('/:documentType/:documentId', DocumentReviewController.getByDocument);
router.put('/:id', DocumentReviewController.update);
router.put('/:id/verify-delivery', DocumentReviewController.verifyDelivery);

module.exports = router;

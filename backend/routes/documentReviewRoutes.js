// routes/documentReviewRoutes.js
const express = require('express');
const router = express.Router();
const DocumentReviewController = require('../controllers/DocumentReviewController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require appropriate permissions
router.use(protect);

// GET /api/document-reviews/pending - This needs to come before the generic :id route
router.route('/pending')
  .get(authorize('admin', 'director', 'secretary'), DocumentReviewController.getPendingReviews);

// GET /api/document-reviews
router.route('/')
  .get(authorize('admin', 'director', 'secretary'), DocumentReviewController.getAll)
  .post(authorize('admin', 'director', 'secretary'), DocumentReviewController.create);

// GET /api/document-reviews/:id - This should come last to catch all other IDs
router.route('/:id')
  .get(authorize('admin', 'director', 'secretary', 'teacher'), DocumentReviewController.getById)
  .put(authorize('admin', 'director', 'secretary'), DocumentReviewController.update)
  .delete(authorize('admin', 'director'), DocumentReviewController.delete);

module.exports = router;
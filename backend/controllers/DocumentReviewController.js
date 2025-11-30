const DocumentReviewRepository = require('../repositories/DocumentReviewRepository');
const DocumentReview = require('../models/DocumentReview');
const { AppError } = require('../middleware/errorHandler');

class DocumentReviewController {
    async create(req, res) {
        try {
            const {
                documentType, documentId, status, notes
            } = req.body;

            const reviewerId = req.user ? req.user.id : null;
            const reviewDate = new Date();

            const newReview = new DocumentReview(
                null, documentType, documentId, reviewerId, reviewDate, status, notes,
                false, null, null
            );

            const createdReview = await DocumentReviewRepository.create(newReview);
            res.status(201).json(createdReview);
        } catch (error) {
            console.error("Error creating document review:", error);
            throw new AppError('Error creating document review', 500);
        }
    }

    async getByDocument(req, res) {
        try {
            const { documentType, documentId } = req.params;
            const reviews = await DocumentReviewRepository.findByDocument(documentType, documentId);
            res.status(200).json(reviews);
        } catch (error) {
            console.error("Error fetching document reviews:", error);
            throw new AppError('Error fetching document reviews', 500);
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { status, notes } = req.body;

            const existingReview = await DocumentReviewRepository.findById(id);
            if (!existingReview) {
                throw new AppError("Review not found", 404);
            }

            // Only update status and notes
            existingReview.status = status;
            existingReview.notes = notes;

            const result = await DocumentReviewRepository.update(existingReview);
            res.status(200).json(result);
        } catch (error) {
            console.error(`Error updating review ${req.params.id}:`, error);
            throw new AppError('Error updating review', 500);
        }
    }

    async verifyDelivery(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user ? req.user.id : null;

            const existingReview = await DocumentReviewRepository.findById(id);
            if (!existingReview) {
                throw new AppError("Review not found", 404);
            }

            existingReview.verifiedDelivery = true;
            existingReview.deliveryVerifiedBy = userId;
            existingReview.deliveryVerifiedAt = new Date();

            const result = await DocumentReviewRepository.update(existingReview);
            res.status(200).json(result);
        } catch (error) {
            console.error(`Error verifying delivery for review ${req.params.id}:`, error);
            throw new AppError('Error verifying delivery', 500);
        }
    }
}

module.exports = new DocumentReviewController();

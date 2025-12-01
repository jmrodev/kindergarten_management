// controllers/DocumentReviewController.js
const DocumentReview = require('../models/DocumentReview');
const Student = require('../models/Student');
const Guardian = require('../models/Guardian');
const Staff = require('../models/Staff');
const { AppError } = require('../middleware/errorHandler');

class DocumentReviewController {
  static async getAll(req, res, next) {
    try {
      const filters = {};
      
      if (req.query.documentType) filters.documentType = req.query.documentType;
      if (req.query.status) filters.status = req.query.status;
      if (req.query.reviewerId) filters.reviewerId = req.query.reviewerId;

      const documentReviews = await DocumentReview.getAll(filters);
      res.status(200).json({
        status: 'success',
        data: documentReviews
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const documentReview = await DocumentReview.getById(id);

      if (!documentReview) {
        return next(new AppError(`No document review found with id: ${id}`, 404));
      }

      res.status(200).json({
        status: 'success',
        data: documentReview
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      // Validate document type and existence of referenced document
      let documentExists = false;
      
      switch(req.body.document_type) {
        case 'alumno':
          const student = await Student.getById(req.body.document_id);
          documentExists = !!student;
          break;
        case 'padre':
          const guardian = await Guardian.getById(req.body.document_id);
          documentExists = !!guardian;
          break;
        case 'personal':
          const staff = await Staff.getById(req.body.document_id);
          documentExists = !!staff;
          break;
        default:
          documentExists = true; // For other types, assume valid for now
      }

      if (!documentExists) {
        return next(new AppError(`Referenced document not found for type: ${req.body.document_type} with id: ${req.body.document_id}`, 404));
      }

      // Validate reviewer exists
      if (req.body.reviewer_id) {
        const reviewer = await Staff.getById(req.body.reviewer_id);
        if (!reviewer) {
          return next(new AppError(`No reviewer found with id: ${req.body.reviewer_id}`, 404));
        }
      }

      // Add reviewer from authenticated user if not specified
      if (!req.body.reviewer_id) {
        req.body.reviewer_id = req.user.id;
      }

      const reviewId = await DocumentReview.create(req.body);
      const createdReview = await DocumentReview.getById(reviewId);

      res.status(201).json({
        status: 'success',
        message: 'Document review created successfully',
        data: createdReview
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const documentReview = await DocumentReview.getById(id);

      if (!documentReview) {
        return next(new AppError(`No document review found with id: ${id}`, 404));
      }

      // Validate document type and existence of referenced document if being updated
      if (req.body.document_type && req.body.document_id) {
        let documentExists = false;
        
        switch(req.body.document_type) {
          case 'alumno':
            const student = await Student.getById(req.body.document_id);
            documentExists = !!student;
            break;
          case 'padre':
            const guardian = await Guardian.getById(req.body.document_id);
            documentExists = !!guardian;
            break;
          case 'personal':
            const staff = await Staff.getById(req.body.document_id);
            documentExists = !!staff;
            break;
          default:
            documentExists = true; // For other types, assume valid for now
        }

        if (!documentExists) {
          return next(new AppError(`Referenced document not found for type: ${req.body.document_type} with id: ${req.body.document_id}`, 404));
        }
      }

      // Validate reviewer exists if being updated
      if (req.body.reviewer_id) {
        const reviewer = await Staff.getById(req.body.reviewer_id);
        if (!reviewer) {
          return next(new AppError(`No reviewer found with id: ${req.body.reviewer_id}`, 404));
        }
      }

      const updated = await DocumentReview.update(id, req.body);

      if (!updated) {
        return next(new AppError(`No document review found with id: ${id}`, 404));
      }

      const updatedReview = await DocumentReview.getById(id);

      res.status(200).json({
        status: 'success',
        message: 'Document review updated successfully',
        data: updatedReview
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await DocumentReview.delete(id);

      if (!deleted) {
        return next(new AppError(`No document review found with id: ${id}`, 404));
      }

      res.status(200).json({
        status: 'success',
        message: 'Document review deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPendingReviews(req, res, next) {
    try {
      const pendingReviews = await DocumentReview.getPendingReviews();

      res.status(200).json({
        status: 'success',
        data: pendingReviews
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DocumentReviewController;
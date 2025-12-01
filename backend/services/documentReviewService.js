// services/documentReviewService.js
const DocumentReview = require('../models/DocumentReview');
const Student = require('../models/Student');
const Guardian = require('../models/Guardian');
const Staff = require('../models/Staff');
const { AppError } = require('../middleware/errorHandler');

class DocumentReviewService {
  // Create a document review with validation
  static async createDocumentReview(reviewData) {
    try {
      // Validate document type and existence of referenced document
      let documentExists = false;
      
      switch(reviewData.document_type) {
        case 'alumno':
          const student = await Student.getById(reviewData.document_id);
          documentExists = !!student;
          break;
        case 'padre':
          const guardian = await Guardian.getById(reviewData.document_id);
          documentExists = !!guardian;
          break;
        case 'personal':
          const staff = await Staff.getById(reviewData.document_id);
          documentExists = !!staff;
          break;
        default:
          documentExists = true; // For other types, assume valid for now
      }

      if (!documentExists) {
        throw new AppError(`Referenced document not found for type: ${reviewData.document_type} with id: ${reviewData.document_id}`, 404);
      }

      // Validate reviewer exists
      if (reviewData.reviewer_id) {
        const reviewer = await Staff.getById(reviewData.reviewer_id);
        if (!reviewer) {
          throw new AppError(`No reviewer found with id: ${reviewData.reviewer_id}`, 404);
        }
      }

      // Create the document review
      const reviewId = await DocumentReview.create(reviewData);
      const createdReview = await DocumentReview.getById(reviewId);

      return createdReview;
    } catch (error) {
      throw error;
    }
  }

  // Update document review and handle status changes
  static async updateDocumentReview(reviewId, reviewData) {
    try {
      // Get existing review
      const existingReview = await DocumentReview.getById(reviewId);
      if (!existingReview) {
        throw new AppError(`No document review found with id: ${reviewId}`, 404);
      }

      // Validate document type and existence of referenced document if being updated
      if (reviewData.document_type && reviewData.document_id) {
        let documentExists = false;
        
        switch(reviewData.document_type) {
          case 'alumno':
            const student = await Student.getById(reviewData.document_id);
            documentExists = !!student;
            break;
          case 'padre':
            const guardian = await Guardian.getById(reviewData.document_id);
            documentExists = !!guardian;
            break;
          case 'personal':
            const staff = await Staff.getById(reviewData.document_id);
            documentExists = !!staff;
            break;
          default:
            documentExists = true; // For other types, assume valid for now
        }

        if (!documentExists) {
          throw new AppError(`Referenced document not found for type: ${reviewData.document_type} with id: ${reviewData.document_id}`, 404);
        }
      }

      // Validate reviewer exists if being updated
      if (reviewData.reviewer_id) {
        const reviewer = await Staff.getById(reviewData.reviewer_id);
        if (!reviewer) {
          throw new AppError(`No reviewer found with id: ${reviewData.reviewer_id}`, 404);
        }
      }

      // Update the document review
      const updated = await DocumentReview.update(reviewId, reviewData);
      if (!updated) {
        throw new AppError(`No document review found with id: ${reviewId}`, 404);
      }

      const updatedReview = await DocumentReview.getById(reviewId);
      return updatedReview;
    } catch (error) {
      throw error;
    }
  }

  // Get all pending document reviews
  static async getPendingReviews(options = {}) {
    try {
      const pendingReviews = await DocumentReview.getPendingReviews();
      
      // Calculate statistics if requested
      if (options.includeStats) {
        const stats = this.calculateReviewStats(pendingReviews);
        return {
          reviews: pendingReviews,
          stats
        };
      }

      return pendingReviews;
    } catch (error) {
      throw error;
    }
  }

  // Calculate review statistics
  static calculateReviewStats(reviews) {
    const stats = {
      totalPending: reviews.length,
      byType: {},
      byDate: {}
    };

    reviews.forEach(review => {
      // Count by type
      const type = review.document_type;
      if (!stats.byType[type]) {
        stats.byType[type] = 0;
      }
      stats.byType[type]++;

      // Group by date
      const date = review.review_date ? new Date(review.review_date).toDateString() : 'unknown';
      if (!stats.byDate[date]) {
        stats.byDate[date] = 0;
      }
      stats.byDate[date]++;
    });

    return stats;
  }

  // Get document reviews by type
  static async getReviewsByType(documentType, status = null) {
    try {
      const filters = { documentType };
      if (status) {
        filters.status = status;
      }

      const reviews = await DocumentReview.getAll(filters);
      return reviews;
    } catch (error) {
      throw error;
    }
  }

  // Get document reviews by student
  static async getReviewsByStudent(studentId) {
    try {
      // First get all student document reviews
      const reviews = await DocumentReview.getAll({
        documentType: 'alumno',
        documentId: studentId
      });

      // Also get any related documents (like student documents that might be reviewed under different types)
      return reviews;
    } catch (error) {
      throw error;
    }
  }

  // Generate document review report
  static async generateReviewReport(startDate, endDate, options = {}) {
    try {
      const filters = {};
      if (startDate && endDate) {
        filters.startDate = startDate;
        filters.endDate = endDate;
      }

      const allReviews = await DocumentReview.getAll({ filters });

      // Calculate comprehensive report
      const report = {
        period: {
          startDate,
          endDate
        },
        summary: {
          totalReviews: allReviews.length,
          completed: 0,
          pending: 0,
          verified: 0,
          rejected: 0,
          byType: {},
          byStatus: {}
        },
        details: {
          reviews: allReviews
        }
      };

      // Process the reviews to calculate statistics
      allReviews.forEach(review => {
        // Count by status
        if (!report.summary.byStatus[review.status]) {
          report.summary.byStatus[review.status] = 0;
        }
        report.summary.byStatus[review.status]++;

        // Count by type
        if (!report.summary.byType[review.document_type]) {
          report.summary.byType[review.document_type] = 0;
        }
        report.summary.byType[review.document_type]++;

        // Update summary counts
        switch(review.status) {
          case 'pendiente':
            report.summary.pending++;
            break;
          case 'verificado':
            report.summary.completed++;
            report.summary.verified++;
            break;
          case 'rechazado':
            report.summary.completed++;
            report.summary.rejected++;
            break;
        }
      });

      // Calculate percentages
      if (report.summary.totalReviews > 0) {
        Object.keys(report.summary.byStatus).forEach(status => {
          const count = report.summary.byStatus[status];
          report.summary.byStatus[status + '_percentage'] = parseFloat(((count / report.summary.totalReviews) * 100).toFixed(2));
        });

        Object.keys(report.summary.byType).forEach(type => {
          const count = report.summary.byType[type];
          report.summary.byType[type + '_percentage'] = parseFloat(((count / report.summary.totalReviews) * 100).toFixed(2));
        });
      }

      return report;
    } catch (error) {
      throw error;
    }
  }

  // Verify document delivery
  static async verifyDocumentDelivery(reviewId, verifierId) {
    try {
      const existingReview = await DocumentReview.getById(reviewId);
      if (!existingReview) {
        throw new AppError(`No document review found with id: ${reviewId}`, 404);
      }

      // Update the review with delivery verification
      const updatedData = {
        ...existingReview,
        verified_delivery: true,
        delivery_verified_by: verifierId,
        delivery_verified_at: new Date()
      };

      const updated = await DocumentReview.update(reviewId, updatedData);
      if (!updated) {
        throw new AppError(`Could not update document review with id: ${reviewId}`, 500);
      }

      const updatedReview = await DocumentReview.getById(reviewId);
      return updatedReview;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DocumentReviewService;
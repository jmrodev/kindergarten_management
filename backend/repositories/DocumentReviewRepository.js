const { getConnection } = require('../db');
const DocumentReview = require('../models/DocumentReview');

class DocumentReviewRepository {
    async create(review) {
        let conn;
        try {
            conn = await getConnection();
            const result = await conn.query(
                `INSERT INTO document_review
                (document_type, document_id, reviewer_id, review_date, status, notes, verified_delivery, delivery_verified_by, delivery_verified_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    review.documentType,
                    review.documentId,
                    review.reviewerId,
                    review.reviewDate,
                    review.status,
                    review.notes,
                    review.verifiedDelivery,
                    review.deliveryVerifiedBy,
                    review.deliveryVerifiedAt
                ]
            );
            review.id = result.insertId;
            return review;
        } catch (err) {
            console.error("Error creating document review:", err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async findByDocument(documentType, documentId) {
        let conn;
        try {
            conn = await getConnection();
            const rows = await conn.query(`
                SELECT dr.*,
                       CONCAT(r.first_name, ' ', r.paternal_surname) as reviewer_name,
                       CONCAT(dv.first_name, ' ', dv.paternal_surname) as delivery_verifier_name
                FROM document_review dr
                LEFT JOIN staff r ON dr.reviewer_id = r.id
                LEFT JOIN staff dv ON dr.delivery_verified_by = dv.id
                WHERE dr.document_type = ? AND dr.document_id = ?
                ORDER BY dr.review_date DESC
            `, [documentType, documentId]);
            return rows.map(row => DocumentReview.fromDbRow(row));
        } catch (err) {
            console.error(`Error finding document reviews:`, err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async findById(id) {
        let conn;
        try {
            conn = await getConnection();
            const rows = await conn.query(`
                SELECT dr.*,
                       CONCAT(r.first_name, ' ', r.paternal_surname) as reviewer_name,
                       CONCAT(dv.first_name, ' ', dv.paternal_surname) as delivery_verifier_name
                FROM document_review dr
                LEFT JOIN staff r ON dr.reviewer_id = r.id
                LEFT JOIN staff dv ON dr.delivery_verified_by = dv.id
                WHERE dr.id = ?
            `, [id]);
            return rows.length > 0 ? DocumentReview.fromDbRow(rows[0]) : null;
        } catch (err) {
            console.error(`Error finding document review with id ${id}:`, err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async update(review) {
        let conn;
        try {
            conn = await getConnection();
            await conn.query(
                `UPDATE document_review
                SET status = ?, notes = ?, verified_delivery = ?, delivery_verified_by = ?, delivery_verified_at = ?
                WHERE id = ?`,
                [
                    review.status,
                    review.notes,
                    review.verifiedDelivery,
                    review.deliveryVerifiedBy,
                    review.deliveryVerifiedAt,
                    review.id
                ]
            );
            return await this.findById(review.id);
        } catch (err) {
            console.error(`Error updating document review with id ${review.id}:`, err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }
}

module.exports = new DocumentReviewRepository();

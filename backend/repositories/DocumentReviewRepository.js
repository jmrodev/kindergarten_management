// repositories/DocumentReviewRepository.js
const { getConnection } = require('../db');

class DocumentReviewRepository {
    static async getAll(filters = {}) {
        const conn = await getConnection();
        try {
            let query = `SELECT dr.*, 
                   CONCAT(s.first_name, ' ', s.paternal_surname) AS student_name,
                   CONCAT(stf.first_name, ' ', stf.paternal_surname) AS reviewer_name,
                   CONCAT(stf2.first_name, ' ', stf2.paternal_surname) AS delivery_verifier_name
                   FROM document_review dr
                   LEFT JOIN student s ON (dr.document_type = 'alumno' AND dr.document_id = s.id)
                   LEFT JOIN guardian g ON (dr.document_type = 'padre' AND dr.document_id = g.id)
                   LEFT JOIN staff stf ON dr.reviewer_id = stf.id
                   LEFT JOIN staff stf2 ON dr.delivery_verified_by = stf2.id
                   WHERE 1=1`;
            const params = [];

            // Apply filters if provided
            if (filters.documentType) {
                query += ' AND dr.document_type = ?';
                params.push(filters.documentType);
            }

            if (filters.status) {
                query += ' AND dr.status = ?';
                params.push(filters.status);
            }

            if (filters.reviewerId) {
                query += ' AND dr.reviewer_id = ?';
                params.push(filters.reviewerId);
            }

            query += ' ORDER BY dr.review_date DESC';

            const result = await conn.query(query, params);
            return result;
        } finally {
            conn.release();
        }
    }

    static async getById(id) {
        const conn = await getConnection();
        try {
            const result = await conn.query(
                `SELECT dr.*, 
         CONCAT(s.first_name, ' ', s.paternal_surname) AS student_name,
         CONCAT(stf.first_name, ' ', stf.paternal_surname) AS reviewer_name,
         CONCAT(stf2.first_name, ' ', stf2.paternal_surname) AS delivery_verifier_name
         FROM document_review dr
         LEFT JOIN student s ON (dr.document_type = 'alumno' AND dr.document_id = s.id)
         LEFT JOIN guardian g ON (dr.document_type = 'padre' AND dr.document_id = g.id)
         LEFT JOIN staff stf ON dr.reviewer_id = stf.id
         LEFT JOIN staff stf2 ON dr.delivery_verified_by = stf2.id
         WHERE dr.id = ?`,
                [id]
            );
            return result[0];
        } finally {
            conn.release();
        }
    }

    static async create(reviewData) {
        const conn = await getConnection();
        try {
            const result = await conn.query(
                `INSERT INTO document_review (document_type, document_id, reviewer_id, 
         review_date, status, notes, verified_delivery, delivery_verified_by, 
         delivery_verified_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    reviewData.document_type,
                    reviewData.document_id,
                    reviewData.reviewer_id,
                    reviewData.review_date || new Date(),
                    reviewData.status,
                    reviewData.notes,
                    reviewData.verified_delivery || false,
                    reviewData.delivery_verified_by,
                    reviewData.delivery_verified_at
                ]
            );
            return result.insertId;
        } finally {
            conn.release();
        }
    }

    static async update(id, reviewData) {
        const conn = await getConnection();
        try {
            const result = await conn.query(
                `UPDATE document_review SET document_type = ?, document_id = ?, 
         reviewer_id = ?, review_date = ?, status = ?, notes = ?, 
         verified_delivery = ?, delivery_verified_by = ?, delivery_verified_at = ? 
         WHERE id = ?`,
                [
                    reviewData.document_type,
                    reviewData.document_id,
                    reviewData.reviewer_id,
                    reviewData.review_date,
                    reviewData.status,
                    reviewData.notes,
                    reviewData.verified_delivery,
                    reviewData.delivery_verified_by,
                    reviewData.delivery_verified_at,
                    id
                ]
            );
            return result.affectedRows > 0;
        } finally {
            conn.release();
        }
    }

    static async delete(id) {
        const conn = await getConnection();
        try {
            const result = await conn.query('DELETE FROM document_review WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } finally {
            conn.release();
        }
    }

    static async getPendingReviews() {
        const conn = await getConnection();
        try {
            const result = await conn.query(
                `SELECT dr.*, 
         CONCAT(s.first_name, ' ', s.paternal_surname) AS student_name,
         CONCAT(g.first_name, ' ', g.paternal_surname) AS guardian_name,
         CONCAT(stf.first_name, ' ', stf.paternal_surname) AS reviewer_name
         FROM document_review dr
         LEFT JOIN student s ON (dr.document_type = 'alumno' AND dr.document_id = s.id)
         LEFT JOIN guardian g ON (dr.document_type = 'padre' AND dr.document_id = g.id)
         LEFT JOIN staff stf ON dr.reviewer_id = stf.id
         WHERE dr.status = 'pendiente'
         ORDER BY dr.review_date DESC`
            );
            return result;
        } finally {
            conn.release();
        }
    }
}

module.exports = DocumentReviewRepository;

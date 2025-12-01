// backend/routes/enrollmentManagementRoutes.js
const express = require('express');
const router = express.Router();
const { protect, requireRoles } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');
const { sanitizeObject, sanitizeWhitespace } = require('../utils/sanitization');

// GET /api/enrollment-management/pending - Obtener inscripciones pendientes
router.get('/pending', protect, requireRoles(['Administrator', 'Directivo', 'Secretary']), async (req, res, next) => {
    const pool = req.app.get('pool');

    try {
        const pendingEnrollments = await pool.query(`
            SELECT 
                ps.id,
                ps.user_id,
                ps.student_id,
                ps.submitted_at,
                ps.status,
                s.first_name,
                s.paternal_surname,
                s.maternal_surname,
                s.dni as student_dni,
                s.birth_date,
                s.shift,
                a.street,
                a.number,
                a.city,
                a.provincia,
                a.postal_code_optional,
                ec.full_name as emergency_contact_name,
                ec.relationship as emergency_contact_relationship,
                ec.phone as emergency_contact_phone,
                ec.alternative_phone as emergency_contact_alt_phone,
                ec.is_authorized_pickup as emergency_contact_authorized_pickup,
                s.health_insurance,
                s.affiliate_number,
                s.allergies,
                s.medications,
                s.medical_observations,
                s.blood_type,
                s.pediatrician_name,
                s.pediatrician_phone,
                s.has_siblings_in_school,
                s.special_needs,
                s.vaccination_status,
                g.first_name as guardian_first_name,
                g.middle_name_optional as guardian_middle_name,
                g.paternal_surname as guardian_paternal_surname,
                g.maternal_surname as guardian_maternal_surname,
                g.preferred_surname as guardian_preferred_surname,
                g.dni as guardian_dni,
                g.phone as guardian_phone,
                g.email_optional as guardian_email,
                g.workplace as guardian_workplace,
                g.work_phone as guardian_work_phone,
                g.authorized_pickup as guardian_authorized_pickup,
                g.authorized_change as guardian_authorized_change,
                sg.relationship_type as guardian_relationship,
                sg.is_primary as guardian_is_primary,
                sg.custody_rights as guardian_custody_rights,
                sg.financial_responsible as guardian_financial_responsible
            FROM parent_portal_submissions ps
            LEFT JOIN student s ON ps.student_id = s.id
            LEFT JOIN address a ON s.address_id = a.id
            LEFT JOIN emergency_contact ec ON s.emergency_contact_id = ec.id
            LEFT JOIN student_guardian sg ON s.id = sg.student_id AND sg.is_primary = true
            LEFT JOIN guardian g ON sg.guardian_id = g.id
            WHERE ps.status = 'pending_review'
            ORDER BY ps.submitted_at DESC
        `);

        res.json({
            success: true,
            data: pendingEnrollments
        });
    } catch (error) {
        console.error('Error fetching pending enrollments:', error);
        next(new AppError('Error al obtener inscripciones pendientes', 500));
    }
});

// GET /api/enrollment-management/completed - Obtener inscripciones completadas
router.get('/completed', protect, requireRoles(['Administrator', 'Directivo', 'Secretary']), async (req, res, next) => {
    const pool = req.app.get('pool');

    try {
        const completedEnrollments = await pool.query(`
            SELECT 
                ps.id,
                ps.user_id,
                ps.student_id,
                ps.submitted_at,
                ps.status,
                ps.approved_at,
                ps.approved_by,
                ps.rejected_at,
                ps.rejected_reason,
                ps.rejected_by,
                s.first_name,
                s.paternal_surname,
                s.maternal_surname,
                s.dni as student_dni,
                s.birth_date,
                s.shift,
                s.status as student_status
            FROM parent_portal_submissions ps
            LEFT JOIN student s ON ps.student_id = s.id
            WHERE ps.status IN ('approved', 'rejected')
            ORDER BY ps.submitted_at DESC
        `);

        res.json({
            success: true,
            data: completedEnrollments
        });
    } catch (error) {
        console.error('Error fetching completed enrollments:', error);
        next(new AppError('Error al obtener inscripciones completadas', 500));
    }
});

// PATCH /api/enrollment-management/:submissionId/approve - Aprobar inscripción
router.patch('/:submissionId/approve', protect, requireRoles(['Administrator', 'Directivo', 'Secretary']), async (req, res, next) => {
    const pool = req.app.get('pool');
    const submissionId = req.params.submissionId;
    const userId = req.user.id;

    try {
        const conn = await pool.getConnection();
        
        try {
            await conn.beginTransaction();

            // Update submission status to approved
            const updateResult = await conn.query(`
                UPDATE parent_portal_submissions 
                SET status = 'approved', approved_at = NOW(), approved_by = ?
                WHERE id = ?
            `, [userId, submissionId]);

            if (updateResult.affectedRows === 0) {
                throw new Error('Submission not found');
            }

            // Update student status to 'sorteo' (lottery list) - requires further acceptance
            await conn.query(`
                UPDATE student
                SET status = 'sorteo'
                WHERE id = (SELECT student_id FROM parent_portal_submissions WHERE id = ?)
            `, [submissionId]);

            await conn.commit();

            res.json({
                success: true,
                message: 'Inscripción aprobada exitosamente'
            });
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    } catch (error) {
        console.error('Error approving enrollment:', error);
        next(new AppError('Error al aprobar inscripción', 500));
    }
});

// PATCH /api/enrollment-management/:submissionId/reject - Rechazar inscripción
router.patch('/:submissionId/reject', protect, requireRoles(['Administrator', 'Directivo', 'Secretary']), async (req, res, next) => {
    const pool = req.app.get('pool');
    const submissionId = req.params.submissionId;
    const userId = req.user.id;
    const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);
    const { reason } = sanitizedBody;

    if (!reason) {
        return next(new AppError('Motivo de rechazo es requerido', 400));
    }

    try {
        const conn = await pool.getConnection();
        
        try {
            await conn.beginTransaction();

            // Update submission status to rejected with reason
            const updateResult = await conn.query(`
                UPDATE parent_portal_submissions 
                SET status = 'rejected', rejected_at = NOW(), rejected_by = ?, rejected_reason = ?
                WHERE id = ?
            `, [userId, reason, submissionId]);

            if (updateResult.affectedRows === 0) {
                throw new Error('Submission not found');
            }

            // Update student status to 'rechazado'
            await conn.query(`
                UPDATE student 
                SET status = 'rechazado'
                WHERE id = (SELECT student_id FROM parent_portal_submissions WHERE id = ?)
            `, [submissionId]);

            await conn.commit();

            res.json({
                success: true,
                message: 'Inscripción rechazada exitosamente'
            });
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    } catch (error) {
        console.error('Error rejecting enrollment:', error);
        next(new AppError('Error al rechazar inscripción', 500));
    }
});

// GET /api/enrollment-management/:submissionId - Obtener detalles de una inscripción específica
router.get('/:submissionId', protect, requireRoles(['Administrator', 'Directivo', 'Secretary']), async (req, res, next) => {
    const pool = req.app.get('pool');
    const submissionId = req.params.submissionId;

    try {
        const enrollment = await pool.query(`
            SELECT 
                ps.id,
                ps.user_id,
                ps.student_id,
                ps.submitted_at,
                ps.status,
                ps.approved_at,
                ps.approved_by,
                ps.rejected_at,
                ps.rejected_reason,
                ps.rejected_by,
                s.first_name,
                s.middle_name_optional,
                s.third_name_optional,
                s.nickname_optional,
                s.paternal_surname,
                s.maternal_surname,
                s.dni as student_dni,
                s.birth_date,
                s.address_id,
                s.emergency_contact_id,
                s.shift,
                s.status as student_status,
                s.enrollment_date,
                s.health_insurance,
                s.affiliate_number,
                s.blood_type,
                s.allergies,
                s.medications,
                s.medical_observations,
                s.pediatrician_name,
                s.pediatrician_phone,
                s.photo_authorization,
                s.trip_authorization,
                s.medical_attention_authorization,
                s.has_siblings_in_school,
                s.special_needs,
                s.vaccination_status,
                s.observations,
                s.classroom_id,
                a.street,
                a.number,
                a.city,
                a.provincia,
                a.postal_code_optional,
                ec.full_name as emergency_contact_name,
                ec.relationship as emergency_contact_relationship,
                ec.phone as emergency_contact_phone,
                ec.alternative_phone as emergency_contact_alt_phone,
                ec.is_authorized_pickup as emergency_contact_authorized_pickup,
                g.first_name as guardian_first_name,
                g.middle_name_optional as guardian_middle_name,
                g.paternal_surname as guardian_paternal_surname,
                g.maternal_surname as guardian_maternal_surname,
                g.preferred_surname as guardian_preferred_surname,
                g.dni as guardian_dni,
                g.phone as guardian_phone,
                g.email_optional as guardian_email,
                g.workplace as guardian_workplace,
                g.work_phone as guardian_work_phone,
                g.authorized_pickup as guardian_authorized_pickup,
                g.authorized_change as guardian_authorized_change,
                g.parent_portal_user_id as guardian_parent_portal_user_id,
                g.role_id as guardian_role_id,
                sg.relationship_type as guardian_relationship,
                sg.is_primary as guardian_is_primary,
                sg.custody_rights as guardian_custody_rights,
                sg.financial_responsible as guardian_financial_responsible
            FROM parent_portal_submissions ps
            LEFT JOIN student s ON ps.student_id = s.id
            LEFT JOIN address a ON s.address_id = a.id
            LEFT JOIN emergency_contact ec ON s.emergency_contact_id = ec.id
            LEFT JOIN student_guardian sg ON s.id = sg.student_id AND sg.is_primary = true
            LEFT JOIN guardian g ON sg.guardian_id = g.id
            WHERE ps.id = ?
        `, [submissionId]);

        if (enrollment.length === 0) {
            return res.status(404).json({ error: 'Inscripción no encontrada' });
        }

        // Get associated documents
        const documents = await pool.query(`
            SELECT id, document_type, file_name, file_path, upload_date
            FROM student_documents
            WHERE student_id = ?
        `, [enrollment[0].student_id]);

        // Add documents to the response
        enrollment[0].documents = documents;

        res.json({
            success: true,
            data: enrollment[0]
        });
    } catch (error) {
        console.error('Error fetching enrollment details:', error);
        next(new AppError('Error al obtener detalles de inscripción', 500));
    }
});

// GET /api/enrollment-management/:submissionId/documents - Obtener documentos de una inscripción específica con estado de verificación
router.get('/:submissionId/documents', protect, requireRoles(['Administrator', 'Directivo', 'Secretary']), async (req, res, next) => {
    const pool = req.app.get('pool');
    const submissionId = req.params.submissionId;

    try {
        // Get the student ID from the submission
        const submission = await pool.query(
            'SELECT student_id FROM parent_portal_submissions WHERE id = ?',
            [submissionId]
        );

        if (submission.length === 0) {
            return res.status(404).json({ error: 'Inscripción no encontrada' });
        }

        const studentId = submission[0].student_id;

        // Get all documents for this student with verification status
        const documents = await pool.query(`
            SELECT
                sd.id,
                sd.document_type,
                sd.file_name,
                sd.file_path,
                sd.upload_date,
                sd.delivery_verified,
                sd.delivery_verified_by,
                sd.delivery_verified_at,
                CONCAT(st.first_name, ' ', st.paternal_surname) as verified_by_name
            FROM student_documents sd
            LEFT JOIN staff st ON sd.delivery_verified_by = st.id
            WHERE sd.student_id = ?
            ORDER BY sd.upload_date DESC
        `, [studentId]);

        res.json({
            success: true,
            data: documents
        });
    } catch (error) {
        console.error('Error fetching enrollment documents:', error);
        next(new AppError('Error al obtener documentos de inscripción', 500));
    }
});

// PATCH /api/enrollment-management/:submissionId/documents/:documentId/verify - Verificar entrega de documento (marcar con checkbox)
router.patch('/:submissionId/documents/:documentId/verify', protect, requireRoles(['Administrator', 'Directivo', 'Secretary']), async (req, res, next) => {
    const pool = req.app.get('pool');
    const submissionId = req.params.submissionId;
    const documentId = req.params.documentId;
    const userId = req.user.id;

    try {
        // Get the student ID from the submission to ensure document belongs to the right student
        const submission = await pool.query(
            'SELECT student_id FROM parent_portal_submissions WHERE id = ?',
            [submissionId]
        );

        if (submission.length === 0) {
            return res.status(404).json({ error: 'Inscripción no encontrada' });
        }

        const studentId = submission[0].student_id;

        // Update document verification status
        const result = await pool.query(`
            UPDATE student_documents
            SET delivery_verified = TRUE, delivery_verified_by = ?, delivery_verified_at = NOW()
            WHERE id = ? AND student_id = ?
        `, [userId, documentId, studentId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Documento no encontrado o no pertenece al estudiante' });
        }

        res.json({
            success: true,
            message: 'Documento verificado exitosamente'
        });
    } catch (error) {
        console.error('Error verifying document:', error);
        next(new AppError('Error al verificar documento', 500));
    }
});

// PATCH /api/enrollment-management/:submissionId/documents/:documentId/unverify - Desverificar entrega de documento
router.patch('/:submissionId/documents/:documentId/unverify', protect, requireRoles(['Administrator', 'Directivo', 'Secretary']), async (req, res, next) => {
    const pool = req.app.get('pool');
    const submissionId = req.params.submissionId;
    const documentId = req.params.documentId;

    try {
        // Get the student ID from the submission to ensure document belongs to the right student
        const submission = await pool.query(
            'SELECT student_id FROM parent_portal_submissions WHERE id = ?',
            [submissionId]
        );

        if (submission.length === 0) {
            return res.status(404).json({ error: 'Inscripción no encontrada' });
        }

        const studentId = submission[0].student_id;

        // Update document verification status
        const result = await pool.query(`
            UPDATE student_documents
            SET delivery_verified = FALSE, delivery_verified_by = NULL, delivery_verified_at = NULL
            WHERE id = ? AND student_id = ?
        `, [documentId, studentId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Documento no encontrado o no pertenece al estudiante' });
        }

        res.json({
            success: true,
            message: 'Verificación de documento removida'
        });
    } catch (error) {
        console.error('Error unverifying document:', error);
        next(new AppError('Error al desverificar documento', 500));
    }
});

// PATCH /api/enrollment-management/:submissionId/approve-with-verification - Aprobar inscripción después de revisar documentos
router.patch('/:submissionId/approve-with-verification', protect, requireRoles(['Administrator', 'Directivo', 'Secretary']), async (req, res, next) => {
    const pool = req.app.get('pool');
    const submissionId = req.params.submissionId;
    const userId = req.user.id;

    try {
        const conn = await pool.getConnection();

        try {
            await conn.beginTransaction();

            // Get the student ID and check that all required documents have been delivered/reviewed
            const submission = await conn.query(
                'SELECT student_id FROM parent_portal_submissions WHERE id = ?',
                [submissionId]
            );

            if (submission.length === 0) {
                throw new Error('Submission not found');
            }

            const studentId = submission[0].student_id;

            // Update submission status to approved
            const updateResult = await conn.query(`
                UPDATE parent_portal_submissions
                SET status = 'approved', approved_at = NOW(), approved_by = ?
                WHERE id = ?
            `, [userId, submissionId]);

            if (updateResult.affectedRows === 0) {
                throw new Error('Submission not found');
            }

            // Update student status to 'sorteo' (lottery list) - they can be approved even with pending delivery
            // According to the new workflow: "si no entrego pasa a sorteo igual"
            await conn.query(`
                UPDATE student
                SET status = 'sorteo'
                WHERE id = ?
            `, [studentId]);

            await conn.commit();

            res.json({
                success: true,
                message: 'Inscripción aprobada y estudiante movido a lista de sorteo exitosamente'
            });
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    } catch (error) {
        console.error('Error approving enrollment with verification:', error);
        next(new AppError('Error al aprobar inscripción', 500));
    }
});

// GET /api/enrollment-management/pre-enrolled - Obtener estudiantes en preinscripto para revisión de documentos
router.get('/pre-enrolled', protect, requireRoles(['Administrator', 'Directivo', 'Secretary']), async (req, res, next) => {
    const pool = req.app.get('pool');

    try {
        // Get students in preinscripto status with their document information
        const preEnrolledStudents = await pool.query(`
            SELECT
                s.id as student_id,
                s.first_name,
                s.paternal_surname,
                s.maternal_surname,
                s.dni,
                s.birth_date,
                s.shift,
                s.status,
                s.enrollment_date,
                s.health_insurance,
                pps.id as submission_id,
                pps.submitted_at,
                pps.status as submission_status,
                g.first_name as guardian_first_name,
                g.paternal_surname as guardian_paternal_surname,
                g.phone as guardian_phone,
                COUNT(sd.id) as total_documents,
                SUM(CASE WHEN sd.delivery_verified = TRUE THEN 1 ELSE 0 END) as verified_documents
            FROM student s
            LEFT JOIN parent_portal_submissions pps ON s.id = pps.student_id
            LEFT JOIN student_guardian sg ON s.id = sg.student_id AND sg.is_primary = true
            LEFT JOIN guardian g ON sg.guardian_id = g.id
            LEFT JOIN student_documents sd ON s.id = sd.student_id
            WHERE s.status = 'preinscripto'
            GROUP BY s.id
            ORDER BY s.enrollment_date ASC
        `);

        res.json({
            success: true,
            data: preEnrolledStudents
        });
    } catch (error) {
        console.error('Error fetching pre-enrolled students:', error);
        next(new AppError('Error al obtener estudiantes preinscriptos', 500));
    }
});

module.exports = router;
// backend/routes/lotteryRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');
const { sanitizeObject, sanitizeWhitespace } = require('../utils/sanitization');

// Middleware para verificar que solo admin/directivo/secretary accedan
const requireAuthorizedRole = (req, res, next) => {
    // Only Administrator, Directivo, or Secretary can access these endpoints
    if (!['Administrator', 'Directivo', 'Secretary'].includes(req.user.role)) {
        return next(new AppError('Acceso denegado. Solo Administradores, Directivos o Secretarios pueden acceder.', 403));
    }
    next();
};

// GET /api/lottery/pending - Obtener alumnos pendientes en la lista de sorteo
router.get('/pending', authenticateToken, requireAuthorizedRole, async (req, res, next) => {
    const pool = req.app.get('pool');

    try {
        const lotteryStudents = await pool.query(`
            SELECT 
                s.id,
                s.first_name,
                s.paternal_surname,
                s.maternal_surname,
                s.dni,
                s.birth_date,
                s.shift,
                s.status,
                s.enrollment_date,
                s.has_siblings_in_school,
                s.health_insurance,
                pps.submitted_at as application_date,
                pps.approved_at,
                pps.approved_by,
                g.first_name as guardian_first_name,
                g.paternal_surname as guardian_paternal_surname,
                g.phone as guardian_phone,
                g.email_optional as guardian_email
            FROM student s
            LEFT JOIN parent_portal_submissions pps ON s.id = pps.student_id
            LEFT JOIN student_guardian sg ON s.id = sg.student_id AND sg.is_primary = true
            LEFT JOIN guardian g ON sg.guardian_id = g.id
            WHERE s.status = 'sorteo'  -- Nuevo estado: en lista de sorteo
            ORDER BY pps.approved_at ASC
        `);

        res.json({
            success: true,
            data: lotteryStudents
        });
    } catch (error) {
        console.error('Error fetching lottery students:', error);
        next(new AppError('Error al obtener alumnos en lista de sorteo', 500));
    }
});

// GET /api/lottery/completed - Obtener alumnos que ya han sido aceptados de la lista de sorteo
router.get('/completed', authenticateToken, requireAuthorizedRole, async (req, res, next) => {
    const pool = req.app.get('pool');

    try {
        const completedStudents = await pool.query(`
            SELECT 
                s.id,
                s.first_name,
                s.paternal_surname,
                s.maternal_surname,
                s.dni,
                s.shift,
                s.status,
                s.classroom_id,
                c.name as classroom_name,
                s.enrollment_date,
                s.has_siblings_in_school,
                s.health_insurance,
                pps.submitted_at as application_date,
                pps.approved_at
            FROM student s
            LEFT JOIN parent_portal_submissions pps ON s.id = pps.student_id
            LEFT JOIN classroom c ON s.classroom_id = c.id
            WHERE s.status IN ('inscripto', 'activo') AND pps.approved_at IS NOT NULL
            ORDER BY s.enrollment_date DESC
        `);

        res.json({
            success: true,
            data: completedStudents
        });
    } catch (error) {
        console.error('Error fetching completed lottery students:', error);
        next(new AppError('Error al obtener alumnos completados del sorteo', 500));
    }
});

// POST /api/lottery/move-to-lottery - Mover alumno de 'approved' a 'sorteo' (después de revisión)
router.post('/move-to-lottery', authenticateToken, requireAuthorizedRole, async (req, res, next) => {
    const pool = req.app.get('pool');
    const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);
    const { studentId } = sanitizedBody;

    if (!studentId) {
        return next(new AppError('ID de estudiante es requerido', 400));
    }

    try {
        const conn = await pool.getConnection();
        
        try {
            await conn.beginTransaction();

            // Update student status to 'sorteo'
            const updateResult = await conn.query(`
                UPDATE student 
                SET status = 'sorteo'
                WHERE id = ? AND status = 'approved'
            `, [studentId]);

            if (updateResult.affectedRows === 0) {
                throw new Error('Student not found or not in approved status');
            }

            await conn.commit();

            res.json({
                success: true,
                message: 'Alumno movido a lista de sorteo exitosamente'
            });
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    } catch (error) {
        console.error('Error moving student to lottery:', error);
        next(new AppError('Error al mover alumno a lista de sorteo', 500));
    }
});

// PATCH /api/lottery/:studentId/accept - Aceptar alumno del sorteo a una sala específica
router.patch('/:studentId/accept', authenticateToken, requireAuthorizedRole, async (req, res, next) => {
    const pool = req.app.get('pool');
    const studentId = req.params.studentId;
    const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);
    const { classroomId, pendingDocumentation = [] } = sanitizedBody;

    try {
        const conn = await pool.getConnection();
        
        try {
            await conn.beginTransaction();

            // Update student status to 'inscripto' (still needs pending docs)
            const updateStudent = await conn.query(`
                UPDATE student 
                SET status = 'inscripto', classroom_id = ?
                WHERE id = ? AND status IN ('sorteo', 'activo')
            `, [classroomId, studentId]);

            if (updateStudent.affectedRows === 0) {
                throw new Error('Student not found or not in correct status');
            }

            // Create a record of pending documentation if needed
            if (pendingDocumentation && pendingDocumentation.length > 0) {
                for (const doc of pendingDocumentation) {
                    await conn.query(`
                        INSERT INTO pending_documentation (
                            student_id, 
                            document_type, 
                            required_by, 
                            notes, 
                            created_at
                        ) VALUES (?, ?, ?, ?, NOW())
                    `, [studentId, doc.type, req.user.id, doc.notes || '']);
                }
            }

            await conn.commit();

            res.json({
                success: true,
                message: 'Alumno aceptado en sala con control de documentación pendiente'
            });
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    } catch (error) {
        console.error('Error accepting student from lottery:', error);
        next(new AppError('Error al aceptar alumno del sorteo', 500));
    }
});

// GET /api/lottery/pending-documentation/:studentId - Obtener documentación pendiente de un alumno
router.get('/pending-documentation/:studentId', authenticateToken, requireAuthorizedRole, async (req, res, next) => {
    const pool = req.app.get('pool');
    const studentId = req.params.studentId;

    try {
        const pendingDocs = await pool.query(`
            SELECT 
                pd.id,
                pd.document_type,
                pd.notes,
                pd.created_at,
                pd.completed_at,
                pd.completed_by,
                s.first_name,
                s.paternal_surname,
                st.first_name as completed_by_name,
                st.paternal_surname as completed_by_surname
            FROM pending_documentation pd
            LEFT JOIN student s ON pd.student_id = s.id
            LEFT JOIN staff st ON pd.completed_by = st.id
            WHERE pd.student_id = ? AND pd.completed_at IS NULL
            ORDER BY pd.created_at ASC
        `, [studentId]);

        res.json({
            success: true,
            data: pendingDocs
        });
    } catch (error) {
        console.error('Error fetching pending documentation:', error);
        next(new AppError('Error al obtener documentación pendiente', 500));
    }
});

// PATCH /api/lottery/pending-documentation/:docId/complete - Marcar documentación como completada
router.patch('/pending-documentation/:docId/complete', authenticateToken, requireAuthorizedRole, async (req, res, next) => {
    const pool = req.app.get('pool');
    const docId = req.params.docId;
    const userId = req.user.id;

    try {
        const result = await pool.query(`
            UPDATE pending_documentation
            SET completed_at = NOW(), completed_by = ?
            WHERE id = ? AND completed_at IS NULL
        `, [userId, docId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Documentación no encontrada o ya completada' });
        }

        res.json({
            success: true,
            message: 'Documentación marcada como completada'
        });
    } catch (error) {
        console.error('Error completing documentation:', error);
        next(new AppError('Error al completar documentación', 500));
    }
});

module.exports = router;
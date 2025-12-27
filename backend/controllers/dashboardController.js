const { AppError } = require('../middleware/errorHandler');

const getDashboardStats = async (req, res, next) => {
    const pool = req.app.get('pool');

    try {
        // 1. Total Active Students (status = 'activo' or 'inscripto')
        const activeStudentsQuery = `
            SELECT CAST(COUNT(*) AS SIGNED) as count 
            FROM student 
            WHERE status IN ('activo', 'inscripto')
        `;
        const activeStudentsResult = await pool.query(activeStudentsQuery);
        const activeStudents = Number(activeStudentsResult[0].count);

        // 2. Total Staff (is_active = TRUE)
        const staffQuery = `
            SELECT CAST(COUNT(*) AS SIGNED) as count 
            FROM staff 
            WHERE is_active = TRUE
        `;
        const staffResult = await pool.query(staffQuery);
        const totalStaff = Number(staffResult[0].count);

        // 3. Pending Enrollments (status = 'preinscripto' or 'pendiente')
        const pendingEnrollmentsQuery = `
            SELECT CAST(COUNT(*) AS SIGNED) as count 
            FROM student 
            WHERE status IN ('preinscripto', 'pendiente', 'sorteo')
        `;
        const pendingEnrollmentsResult = await pool.query(pendingEnrollmentsQuery);
        const pendingEnrollments = Number(pendingEnrollmentsResult[0].count);

        // 4. Pending Document Reviews (if applicable, using document_review table or pending_documentation table)
        // Using document_review table for general reviews
        let pendingReviews = 0;
        try {
            const pendingReviewsQuery = `
                SELECT CAST(COUNT(*) AS SIGNED) as count 
                FROM document_review 
                WHERE status = 'pendiente'
            `;
            const pendingReviewsResult = await pool.query(pendingReviewsQuery);
            pendingReviews = Number(pendingReviewsResult[0].count);
        } catch (err) {
            // Table might not exist or be empty, ignore for now
            console.warn('Could not fetch document_review stats:', err.message);
        }

        // Alternative: Students with pending docs from v_students_with_pending_docs
        let studentsWithPendingDocs = 0;
        try {
            const pendingDocsQuery = `
                SELECT CAST(COUNT(DISTINCT id) AS SIGNED) as count
                FROM v_students_with_pending_docs
            `;
            const pendingDocsResult = await pool.query(pendingDocsQuery);
            studentsWithPendingDocs = Number(pendingDocsResult[0].count);
        } catch (err) {
            console.warn('Could not fetch v_students_with_pending_docs stats:', err.message);
        }

        res.json({
            activeStudents,
            totalStaff,
            pendingEnrollments,
            pendingReviews: pendingReviews,
            studentsWithPendingDocs,
            lastUpdated: new Date()
        });

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        next(new AppError('Error al obtener estadísticas del dashboard', 500));
    }
};

module.exports = {
    getDashboardStats
};

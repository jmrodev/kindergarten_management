const { AppError } = require('../middleware/errorHandler');

const getDashboardStats = async (req, res, next) => {
    const pool = req.app.get('pool');

    try {
        // 1. Total Active Students (status = 'activo' or 'inscripto')
        // 1. Total Active Students & Classroom stats
        // We aggregate by classroom and gender.
        const classroomStatsQuery = `
            SELECT 
                c.id as classroom_id,
                c.name as classroom_name,
                s.gender,
                CAST(COUNT(s.id) AS SIGNED) as count
            FROM classroom c
            LEFT JOIN student s ON c.id = s.classroom_id AND s.status IN ('activo', 'inscripto')
            WHERE c.is_active = TRUE
            GROUP BY c.id, c.name, s.gender
            ORDER BY c.name
        `;
        const classroomStatsResult = await pool.query(classroomStatsQuery);

        // Process results into a structured format
        // { [classroom_name]: { total: 0, M: 0, F: 0 } } or array
        const classroomMap = {};

        let totalActiveStudents = 0;

        classroomStatsResult.forEach(row => {
            if (!classroomMap[row.classroom_id]) {
                classroomMap[row.classroom_id] = {
                    id: row.classroom_id,
                    name: row.classroom_name,
                    total: 0,
                    M: 0,
                    F: 0,
                    U: 0
                };
            }
            const count = Number(row.count);
            // Always add to total
            classroomMap[row.classroom_id].total += count;
            totalActiveStudents += count;

            if (row.gender) {
                classroomMap[row.classroom_id][row.gender] = count;
            } else {
                // Optional: track unknown gender
                classroomMap[row.classroom_id].U = (classroomMap[row.classroom_id].U || 0) + count;
            }
        });

        const activeStudents = totalActiveStudents;
        const classroomStats = Object.values(classroomMap);

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

        // 5. Birthday Logic
        let birthdays = { today: [], week: [], month: [] };
        try {
            // Fetch all students born in the current month
            // We return day of birth to easily sort/filter in JS
            const currentMonth = new Date().getMonth() + 1;
            const birthdayQuery = `
                 SELECT first_name, paternal_surname, birth_date, classroom_id
                 FROM student
                 WHERE MONTH(birth_date) = ? AND status IN ('activo', 'inscripto')
                 ORDER BY DAY(birth_date)
             `;
            const birthdayResult = await pool.query(birthdayQuery, [currentMonth]);

            const today = new Date();
            const currentDay = today.getDate();
            // Start of week (Sunday)
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            // End of week (Saturday)
            const endOfWeek = new Date(today);
            endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

            birthdays.month = birthdayResult;

            birthdays.today = birthdayResult.filter(s => {
                const d = new Date(s.birth_date);
                // birth_date is UTC or local, usually we just care about the Day part assuming consistent timezone or just using the number
                // However, simpler is check if DAY match. 
                // Note: new Date(s.birth_date).getUTCDate() might be safer if stored as DATE only
                const birthDay = new Date(s.birth_date).getDate();
                // Note: If timezone issues arise, use DAY() from SQL directly, but JS filter is fine for small sets
                // Correct approach for 'Day of Month' independent of year:
                // Let's rely on the fact that we filtered by Month in SQL.
                // We just need to match the day number.
                // Be careful with timezones. '2021-05-15' might parse as 14th if -03:00.
                // Safer to parse specific YYYY-MM-DD string or use separate day column.
                // Let's use simple string parsing for safety on 'YYYY-MM-DD'
                const dayStr = new Date(s.birth_date).toISOString().split('T')[0].split('-')[2];
                return parseInt(dayStr) === currentDay;
            });

            // Logic for "This Week":
            // Simply check if the day of month is within the range of "This Week"'s days in the current month.
            // Edge case: Week spanning two months.
            // Since we only fetched THIS month's birthdays, we only show this week's birthdays THAT FALL IN THIS MONTH.
            // This is acceptable simplification or we can enhance SQL to check date range of week.
            // Improving SQL for Week:
            // Actually, let's keep the JS simple: Calculate this week's start/end Date objects.
            // Then check if this year's birthday falls in that range.
            const currentYear = today.getFullYear();

            birthdays.week = birthdayResult.filter(s => {
                // Construct this year's birthday
                const bdate = new Date(s.birth_date);
                // Watch out for timezones again. 
                // Let's use string manipulation to be safe 'MM-DD'
                const bMonth = bdate.getMonth(); // 0-indexed
                const bDay = bdate.getDate();

                const thisYearBday = new Date(currentYear, bMonth, bDay);

                // Check if >= today (or startOfWeek?) AND <= endOfWeek
                // Usually "This week" implies Sunday to Saturday
                return thisYearBday >= startOfWeek && thisYearBday <= endOfWeek;
            }).map(s => {
                // Add "isWeekend" flag
                const bdate = new Date(s.birth_date);
                const thisYearBday = new Date(currentYear, bdate.getMonth(), bdate.getDate());
                const dayOfWeek = thisYearBday.getDay(); // 0 = Sun, 6 = Sat
                return {
                    ...s,
                    isWeekend: (dayOfWeek === 0 || dayOfWeek === 6),
                    dayOfWeek: dayOfWeek // 0-6
                };
            });

        } catch (err) {
            console.warn('Error calculating birthdays:', err);
        }

        res.json({
            activeStudents,
            classroomStats,
            totalStaff,
            pendingEnrollments,
            pendingReviews: pendingReviews,
            studentsWithPendingDocs,
            birthdays, // Added birthdays to response
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

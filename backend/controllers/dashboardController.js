// backend/controllers/dashboardController.js
const { AppError } = require('../middleware/errorHandler');

// Repositories
const ClassroomRepository = require('../repositories/ClassroomRepository');
const StudentRepository = require('../repositories/StudentRepository');
const StaffRepository = require('../repositories/StaffRepository');
const DocumentReviewRepository = require('../repositories/DocumentReviewRepository');

const getDashboardStats = async (req, res, next) => {
    try {
        // 1. Total Active Students & Classroom stats
        // We aggregate by classroom and gender using Repo.
        const classroomStatsResult = await ClassroomRepository.getStatsByGender();

        // Process results into a structured format
        const classroomMap = {};
        let totalActiveStudents = 0;

        classroomStatsResult.forEach(row => {
            const count = Number(row.count);
            // Handle raw row structure (row.classroom_id etc)
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

            classroomMap[row.classroom_id].total += count;
            totalActiveStudents += count;

            if (row.gender) {
                if (classroomMap[row.classroom_id][row.gender] !== undefined) {
                    classroomMap[row.classroom_id][row.gender] = count;
                    // Wait, logic in original was: aggregation by gender. So each row is unique (classroom, gender).
                    // So we assign count.
                    // But if there are multiple rows for one gender? (Duplicates?) Group by handles it.
                    // Actually, original code: classroomMap[row.classroom_id][row.gender] = count;
                    // BUT if multiple rows for same class/gender? SQL Group By prevents it.
                    // Correct logic:
                    /*
                    if (row.gender) {
                        classroomMap[row.classroom_id][row.gender] = count;
                    } 
                    */
                    // My Repo query groups by c.id, c.name, s.gender. So unique.
                    // The loop logic works.
                    classroomMap[row.classroom_id][row.gender] = count;
                } else {
                    classroomMap[row.classroom_id][row.gender] = count; // If gender is something else
                }
            } else {
                classroomMap[row.classroom_id].U = (classroomMap[row.classroom_id].U || 0) + count;
            }
        });

        const activeStudents = totalActiveStudents;
        const classroomStats = Object.values(classroomMap);

        // 2. Total Staff (is_active = TRUE)
        const totalStaff = await StaffRepository.count({ isActive: true });

        // 3. Pending Enrollments (status = 'preinscripto' or 'pendiente' or 'sorteo')
        // StudentRepository.count takes 'status'. Usually singular.
        // We need 'IN' clause support or check manually.
        // Or create specific method.
        // Let's call count multiple times or assume 0?
        // Or use SQL 'IN' if Repo supports array?
        // Checking StudentRepository.count: ' AND s.status = ?'. Only single value.
        // I will do sum of 3 calls for now, or assume 'preinscripto' covers most.
        // Original: status IN ('preinscripto', 'pendiente', 'sorteo')
        // Let's update StudentRepository for array status later? 
        // For now, let's just use 'preinscripto' as primary, or sum them.
        // Or better: Add helper method in StudentRepository `countPendingEnrollments`.
        // Since I'm editing controllers, I should have prepared Repo.
        // The original `dashboardController` had a complex query.
        // I can use `StudentRepository.count` 3 times.
        const p1 = await StudentRepository.count({ status: 'preinscripto' });
        const p2 = await StudentRepository.count({ status: 'pendiente' });
        const p3 = await StudentRepository.count({ status: 'sorteo' });
        const pendingEnrollments = Number(p1) + Number(p2) + Number(p3);


        // 4. Pending Document Reviews
        const pendingReviews = await DocumentReviewRepository.getPendingCount();

        // 5. Students with Pending Docs
        const studentsWithPendingDocs = await StudentRepository.getPendingDocsCount();

        // 6. Birthday Logic
        const currentMonth = new Date().getMonth() + 1;
        const birthdayResult = await StudentRepository.getBirthdaysByMonth(currentMonth);

        const birthdays = { today: [], week: [], month: [] };

        // Process logic (same as before)
        const today = new Date();
        const currentDay = today.getDate();
        const currentYear = today.getFullYear();

        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

        birthdays.month = birthdayResult;

        birthdays.today = birthdayResult.filter(s => {
            const dayStr = new Date(s.birth_date).toISOString().split('T')[0].split('-')[2];
            return parseInt(dayStr) === currentDay;
        });

        birthdays.week = birthdayResult.filter(s => {
            const bdate = new Date(s.birth_date);
            const bMonth = bdate.getMonth();
            const bDay = bdate.getDate();
            const thisYearBday = new Date(currentYear, bMonth, bDay);
            return thisYearBday >= startOfWeek && thisYearBday <= endOfWeek;
        }).map(s => {
            const bdate = new Date(s.birth_date);
            const thisYearBday = new Date(currentYear, bdate.getMonth(), bdate.getDate());
            const dayOfWeek = thisYearBday.getDay();
            return {
                ...s,
                isWeekend: (dayOfWeek === 0 || dayOfWeek === 6),
                dayOfWeek: dayOfWeek
            };
        });

        res.json({
            activeStudents,
            classroomStats,
            totalStaff,
            pendingEnrollments,
            pendingReviews,
            studentsWithPendingDocs,
            birthdays,
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

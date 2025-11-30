const { getConnection } = require('../db');
const Attendance = require('../models/Attendance');

class AttendanceRepository {
    async create(attendance) {
        let conn;
        try {
            conn = await getConnection();
            const result = await conn.query(
                `INSERT INTO attendance
                (student_id, date, status, leave_type_optional, classroom_id, staff_id)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    attendance.studentId,
                    attendance.date,
                    attendance.status,
                    attendance.leaveTypeOptional,
                    attendance.classroomId,
                    attendance.staffId
                ]
            );
            attendance.id = result.insertId;
            return attendance;
        } catch (err) {
            console.error("Error creating attendance:", err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async findByDateAndClassroom(date, classroomId) {
        let conn;
        try {
            conn = await getConnection();
            const rows = await conn.query(`
                SELECT a.*,
                       CONCAT(s.first_name, ' ', s.paternal_surname) as student_name
                FROM attendance a
                LEFT JOIN student s ON a.student_id = s.id
                WHERE a.date = ? AND a.classroom_id = ? AND a.student_id IS NOT NULL
            `, [date, classroomId]);
            return rows.map(row => Attendance.fromDbRow(row));
        } catch (err) {
            console.error(`Error finding attendance for date ${date} and classroom ${classroomId}:`, err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async findStaffAttendance(date) {
        let conn;
        try {
            conn = await getConnection();
            const rows = await conn.query(`
                SELECT a.*,
                       CONCAT(st.first_name, ' ', st.paternal_surname) as staff_name
                FROM attendance a
                JOIN staff st ON a.staff_id = st.id
                WHERE a.date = ? AND a.staff_id IS NOT NULL
            `, [date]);
            return rows.map(row => Attendance.fromDbRow(row));
        } catch (err) {
            console.error(`Error finding staff attendance for date ${date}:`, err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async update(attendance) {
        let conn;
        try {
            conn = await getConnection();
            await conn.query(
                `UPDATE attendance
                SET status = ?, leave_type_optional = ?
                WHERE id = ?`,
                [
                    attendance.status,
                    attendance.leaveTypeOptional,
                    attendance.id
                ]
            );
            return attendance;
        } catch (err) {
            console.error(`Error updating attendance with id ${attendance.id}:`, err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }
}

module.exports = new AttendanceRepository();

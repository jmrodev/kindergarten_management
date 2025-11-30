const { getConnection } = require('../db');
const Activity = require('../models/Activity');

class ActivityRepository {
    async create(activity) {
        let conn;
        try {
            conn = await getConnection();
            const result = await conn.query(
                `INSERT INTO activity
                (name, description_optional, schedule_optional, teacher_id, classroom_id)
                VALUES (?, ?, ?, ?, ?)`,
                [
                    activity.name,
                    activity.descriptionOptional,
                    activity.scheduleOptional,
                    activity.teacherId,
                    activity.classroomId
                ]
            );
            activity.id = result.insertId;
            return activity;
        } catch (err) {
            console.error("Error creating activity:", err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async findAll() {
        let conn;
        try {
            conn = await getConnection();
            const rows = await conn.query(`
                SELECT a.*,
                       cl.name as classroom_name,
                       CONCAT(st.first_name, ' ', st.paternal_surname) as teacher_name
                FROM activity a
                LEFT JOIN classroom cl ON a.classroom_id = cl.id
                LEFT JOIN staff st ON a.teacher_id = st.id
                ORDER BY a.name ASC
            `);
            return rows.map(row => Activity.fromDbRow(row));
        } catch (err) {
            console.error("Error finding all activities:", err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async findByClassroom(classroomId) {
        let conn;
        try {
            conn = await getConnection();
            const rows = await conn.query(`
                SELECT a.*,
                       cl.name as classroom_name,
                       CONCAT(st.first_name, ' ', st.paternal_surname) as teacher_name
                FROM activity a
                LEFT JOIN classroom cl ON a.classroom_id = cl.id
                LEFT JOIN staff st ON a.teacher_id = st.id
                WHERE a.classroom_id = ?
            `, [classroomId]);
            return rows.map(row => Activity.fromDbRow(row));
        } catch (err) {
            console.error(`Error finding activities for classroom ${classroomId}:`, err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async delete(id) {
        let conn;
        try {
            conn = await getConnection();
            const result = await conn.query("DELETE FROM activity WHERE id = ?", [id]);
            return result.affectedRows > 0;
        } catch (err) {
            console.error(`Error deleting activity ${id}:`, err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }
}

module.exports = new ActivityRepository();

const { getConnection } = require('../db');
const MeetingMinutes = require('../models/MeetingMinutes');

class MeetingMinutesRepository {
    async create(minutes) {
        let conn;
        try {
            conn = await getConnection();
            const result = await conn.query(
                `INSERT INTO meeting_minutes
                (meeting_type, meeting_date, meeting_time, participants, purpose, conclusions, responsible_staff_id, created_by, updated_by)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    minutes.meetingType,
                    minutes.meetingDate,
                    minutes.meetingTime,
                    minutes.participants,
                    minutes.purpose,
                    minutes.conclusions,
                    minutes.responsibleStaffId,
                    minutes.createdBy,
                    minutes.updatedBy
                ]
            );
            minutes.id = result.insertId;
            return minutes;
        } catch (err) {
            console.error("Error creating meeting minutes:", err);
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
                SELECT m.*, CONCAT(s.first_name, ' ', s.paternal_surname) as responsible_staff_name
                FROM meeting_minutes m
                LEFT JOIN staff s ON m.responsible_staff_id = s.id
                ORDER BY m.meeting_date DESC, m.meeting_time DESC
            `);
            return rows.map(row => MeetingMinutes.fromDbRow(row));
        } catch (err) {
            console.error("Error finding all meeting minutes:", err);
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
                SELECT m.*, CONCAT(s.first_name, ' ', s.paternal_surname) as responsible_staff_name
                FROM meeting_minutes m
                LEFT JOIN staff s ON m.responsible_staff_id = s.id
                WHERE m.id = ?
            `, [id]);
            return rows.length > 0 ? MeetingMinutes.fromDbRow(rows[0]) : null;
        } catch (err) {
            console.error(`Error finding meeting minutes with id ${id}:`, err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async update(minutes) {
        let conn;
        try {
            conn = await getConnection();
            await conn.query(
                `UPDATE meeting_minutes
                SET meeting_type = ?, meeting_date = ?, meeting_time = ?, participants = ?,
                    purpose = ?, conclusions = ?, responsible_staff_id = ?, updated_by = ?
                WHERE id = ?`,
                [
                    minutes.meetingType,
                    minutes.meetingDate,
                    minutes.meetingTime,
                    minutes.participants,
                    minutes.purpose,
                    minutes.conclusions,
                    minutes.responsibleStaffId,
                    minutes.updatedBy,
                    minutes.id
                ]
            );
            return await this.findById(minutes.id);
        } catch (err) {
            console.error(`Error updating meeting minutes with id ${minutes.id}:`, err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async delete(id) {
        let conn;
        try {
            conn = await getConnection();
            const result = await conn.query("DELETE FROM meeting_minutes WHERE id = ?", [id]);
            return result.affectedRows > 0;
        } catch (err) {
            console.error(`Error deleting meeting minutes with id ${id}:`, err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }
}

module.exports = new MeetingMinutesRepository();

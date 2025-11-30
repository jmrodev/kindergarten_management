const { getConnection } = require('../db');
const Calendar = require('../models/Calendar');

class CalendarRepository {
    async create(event) {
        let conn;
        try {
            conn = await getConnection();
            const result = await conn.query(
                `INSERT INTO calendar
                (date, description, event_type, classroom_id, staff_id)
                VALUES (?, ?, ?, ?, ?)`,
                [
                    event.date,
                    event.description,
                    event.eventType,
                    event.classroomId,
                    event.staffId
                ]
            );
            event.id = result.insertId;
            return event;
        } catch (err) {
            console.error("Error creating calendar event:", err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async findByMonth(month, year) {
        let conn;
        try {
            conn = await getConnection();
            const rows = await conn.query(`
                SELECT c.*,
                       cl.name as classroom_name,
                       CONCAT(st.first_name, ' ', st.paternal_surname) as staff_name
                FROM calendar c
                LEFT JOIN classroom cl ON c.classroom_id = cl.id
                LEFT JOIN staff st ON c.staff_id = st.id
                WHERE MONTH(c.date) = ? AND YEAR(c.date) = ?
                ORDER BY c.date ASC
            `, [month, year]);
            return rows.map(row => Calendar.fromDbRow(row));
        } catch (err) {
            console.error(`Error finding calendar events for ${month}/${year}:`, err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async delete(id) {
        let conn;
        try {
            conn = await getConnection();
            const result = await conn.query("DELETE FROM calendar WHERE id = ?", [id]);
            return result.affectedRows > 0;
        } catch (err) {
            console.error(`Error deleting calendar event ${id}:`, err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }
}

module.exports = new CalendarRepository();

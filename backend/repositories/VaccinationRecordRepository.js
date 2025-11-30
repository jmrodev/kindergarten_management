const { getConnection } = require('../db');
const VaccinationRecord = require('../models/VaccinationRecord');

class VaccinationRecordRepository {
    async create(record) {
        let conn;
        try {
            conn = await getConnection();
            const result = await conn.query(
                `INSERT INTO vaccination_records
                (student_id, vaccine_name, vaccine_date, batch_number, dose_number, next_due_date, status, administered_by, notes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    record.studentId,
                    record.vaccineName,
                    record.vaccineDate,
                    record.batchNumber,
                    record.doseNumber,
                    record.nextDueDate,
                    record.status,
                    record.administeredBy,
                    record.notes
                ]
            );
            record.id = result.insertId;
            return record;
        } catch (err) {
            console.error("Error creating vaccination record:", err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async findByStudentId(studentId) {
        let conn;
        try {
            conn = await getConnection();
            const rows = await conn.query(`
                SELECT vr.*, CONCAT(s.first_name, ' ', s.paternal_surname) as student_name
                FROM vaccination_records vr
                JOIN student s ON vr.student_id = s.id
                WHERE vr.student_id = ?
                ORDER BY vr.vaccine_date DESC
            `, [studentId]);
            return rows.map(row => VaccinationRecord.fromDbRow(row));
        } catch (err) {
            console.error(`Error finding vaccination records for student ${studentId}:`, err);
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
                SELECT vr.*, CONCAT(s.first_name, ' ', s.paternal_surname) as student_name
                FROM vaccination_records vr
                JOIN student s ON vr.student_id = s.id
                WHERE vr.id = ?
            `, [id]);
            return rows.length > 0 ? VaccinationRecord.fromDbRow(rows[0]) : null;
        } catch (err) {
            console.error(`Error finding vaccination record with id ${id}:`, err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async update(record) {
        let conn;
        try {
            conn = await getConnection();
            await conn.query(
                `UPDATE vaccination_records
                SET vaccine_name = ?, vaccine_date = ?, batch_number = ?, dose_number = ?,
                    next_due_date = ?, status = ?, administered_by = ?, notes = ?
                WHERE id = ?`,
                [
                    record.vaccineName,
                    record.vaccineDate,
                    record.batchNumber,
                    record.doseNumber,
                    record.nextDueDate,
                    record.status,
                    record.administeredBy,
                    record.notes,
                    record.id
                ]
            );
            return await this.findById(record.id);
        } catch (err) {
            console.error(`Error updating vaccination record with id ${record.id}:`, err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async delete(id) {
        let conn;
        try {
            conn = await getConnection();
            const result = await conn.query("DELETE FROM vaccination_records WHERE id = ?", [id]);
            return result.affectedRows > 0;
        } catch (err) {
            console.error(`Error deleting vaccination record with id ${id}:`, err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }
}

module.exports = new VaccinationRecordRepository();

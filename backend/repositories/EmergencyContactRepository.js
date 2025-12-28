// repositories/EmergencyContactRepository.js
const { getConnection } = require('../db');

class EmergencyContactRepository {
    static async getAll() {
        const conn = await getConnection();
        try {
            const result = await conn.query(`
        SELECT ec.*, 
               s.first_name as student_first_name, 
               s.paternal_surname as student_paternal_surname
        FROM emergency_contact ec
        LEFT JOIN student s ON ec.student_id = s.id
        ORDER BY ec.priority, ec.full_name
      `);
            return result;
        } finally {
            conn.release();
        }
    }

    static async getById(id) {
        const conn = await getConnection();
        try {
            const result = await conn.query(
                `SELECT ec.*, 
         s.first_name as student_first_name, 
         s.paternal_surname as student_paternal_surname
         FROM emergency_contact ec
         LEFT JOIN student s ON ec.student_id = s.id
         WHERE ec.id = ?`,
                [id]
            );
            return result[0];
        } finally {
            conn.release();
        }
    }

    static async create(emergencyContactData) {
        const conn = await getConnection();
        try {
            const result = await conn.query(
                `INSERT INTO emergency_contact (student_id, full_name, relationship, 
         priority, phone, alternative_phone, is_authorized_pickup) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    emergencyContactData.student_id,
                    emergencyContactData.full_name,
                    emergencyContactData.relationship,
                    emergencyContactData.priority || 1,
                    emergencyContactData.phone,
                    emergencyContactData.alternative_phone,
                    emergencyContactData.is_authorized_pickup || false
                ]
            );
            return result.insertId;
        } finally {
            conn.release();
        }
    }

    static async update(id, emergencyContactData) {
        const conn = await getConnection();
        try {
            const result = await conn.query(
                `UPDATE emergency_contact SET student_id = ?, full_name = ?, 
         relationship = ?, priority = ?, phone = ?, alternative_phone = ?, 
         is_authorized_pickup = ? WHERE id = ?`,
                [
                    emergencyContactData.student_id,
                    emergencyContactData.full_name,
                    emergencyContactData.relationship,
                    emergencyContactData.priority,
                    emergencyContactData.phone,
                    emergencyContactData.alternative_phone,
                    emergencyContactData.is_authorized_pickup,
                    id
                ]
            );
            return result.affectedRows > 0;
        } finally {
            conn.release();
        }
    }

    static async delete(id) {
        const conn = await getConnection();
        try {
            const result = await conn.query('DELETE FROM emergency_contact WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } finally {
            conn.release();
        }
    }
}

module.exports = EmergencyContactRepository;

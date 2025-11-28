// backend/repositories/EmergencyContactRepository.js
const { getConnection } = require('../db');
const EmergencyContact = require('../models/EmergencyContact');

class EmergencyContactRepository {
    async create(contactData) {
        let conn;
        try {
            conn = await getConnection();
            const result = await conn.query(
                'INSERT INTO emergency_contact (full_name, relationship, phone) VALUES (?, ?, ?)',
                [contactData.fullName, contactData.relationship, contactData.phone]
            );
            contactData.id = result.insertId;
            return EmergencyContact.fromDbRow(contactData);
        } catch (err) {
            console.error('Error creating emergency contact:', err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async findById(id) {
        let conn;
        try {
            conn = await getConnection();
            const rows = await conn.query(
                'SELECT * FROM emergency_contact WHERE id = ?',
                [id]
            );
            if (rows.length === 0) return null;
            return EmergencyContact.fromDbRow(rows[0]);
        } catch (err) {
            console.error(`Error finding emergency contact with id ${id}:`, err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async update(id, contactData) {
        let conn;
        try {
            conn = await getConnection();
            await conn.query(
                'UPDATE emergency_contact SET full_name = ?, relationship = ?, phone = ? WHERE id = ?',
                [contactData.fullName, contactData.relationship, contactData.phone, id]
            );
            return this.findById(id);
        } catch (err) {
            console.error(`Error updating emergency contact with id ${id}:`, err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async delete(id) {
        let conn;
        try {
            conn = await getConnection();
            
            // Verificar si está siendo usado por algún estudiante
            const check = await conn.query(
                'SELECT COUNT(*) as count FROM student WHERE emergency_contact_id = ?',
                [id]
            );
            
            if (check[0].count > 0) {
                throw new Error(`Cannot delete emergency contact: Still assigned to ${check[0].count} student(s)`);
            }
            
            const result = await conn.query('DELETE FROM emergency_contact WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (err) {
            console.error(`Error deleting emergency contact with id ${id}:`, err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }
}

module.exports = new EmergencyContactRepository();

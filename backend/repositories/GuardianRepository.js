// backend/repositories/GuardianRepository.js
const { getConnection } = require('../db');
const Guardian = require('../models/Guardian');

class GuardianRepository {
    async create(guardianData) {
        let conn;
        try {
            conn = await getConnection();
            const result = await conn.query(
                `INSERT INTO guardian (
                    first_name, 
                    middle_name_optional, 
                    paternal_surname, 
                    maternal_surname, 
                    preferred_surname,
                    address_id,
                    phone, 
                    email_optional,
                    authorized_pickup,
                    authorized_change
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    guardianData.firstName,
                    guardianData.middleName,
                    guardianData.paternalSurname,
                    guardianData.maternalSurname,
                    guardianData.preferredSurname,
                    guardianData.addressId,
                    guardianData.phone,
                    guardianData.email,
                    guardianData.authorizedPickup || false,
                    guardianData.authorizedChange || false
                ]
            );
            guardianData.id = result.insertId;
            return Guardian.fromDbRow(guardianData);
        } catch (err) {
            console.error('Error creating guardian:', err);
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
                SELECT g.*, a.street, a.number, a.city, a.provincia, a.postal_code_optional
                FROM guardian g
                LEFT JOIN address a ON g.address_id = a.id
                ORDER BY g.paternal_surname, g.first_name
            `);
            return rows.map(row => Guardian.fromDbRow(row));
        } catch (err) {
            console.error('Error finding all guardians:', err);
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
                SELECT g.*, a.street, a.number, a.city, a.provincia, a.postal_code_optional
                FROM guardian g
                LEFT JOIN address a ON g.address_id = a.id
                WHERE g.id = ?
            `, [id]);
            if (rows.length === 0) return null;
            return Guardian.fromDbRow(rows[0]);
        } catch (err) {
            console.error(`Error finding guardian with id ${id}:`, err);
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
                SELECT 
                    g.*,
                    sg.relationship,
                    sg.is_primary,
                    sg.authorized_pickup as sg_authorized_pickup,
                    sg.authorized_diaper_change,
                    sg.notes,
                    a.street,
                    a.number,
                    a.city, 
                    a.provincia, 
                    a.postal_code_optional
                FROM guardian g
                INNER JOIN student_guardian sg ON g.id = sg.guardian_id
                LEFT JOIN address a ON g.address_id = a.id
                WHERE sg.student_id = ?
                ORDER BY sg.is_primary DESC, g.paternal_surname, g.first_name
            `, [studentId]);
            
            return rows.map(row => {
                const guardian = Guardian.fromDbRow(row);
                guardian.relationship = row.relationship;
                guardian.isPrimary = row.is_primary;
                guardian.authorizedPickupRelation = row.sg_authorized_pickup;
                guardian.authorizedDiaperChange = row.authorized_diaper_change;
                guardian.notes = row.notes;
                return guardian;
            });
        } catch (err) {
            console.error(`Error finding guardians for student ${studentId}:`, err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async update(id, guardianData) {
        let conn;
        try {
            conn = await getConnection();
            await conn.query(
                `UPDATE guardian SET
                    first_name = ?,
                    middle_name_optional = ?,
                    paternal_surname = ?,
                    maternal_surname = ?,
                    preferred_surname = ?,
                    address_id = ?,
                    phone = ?,
                    email_optional = ?,
                    authorized_pickup = ?,
                    authorized_change = ?
                WHERE id = ?`,
                [
                    guardianData.firstName,
                    guardianData.middleName,
                    guardianData.paternalSurname,
                    guardianData.maternalSurname,
                    guardianData.preferredSurname,
                    guardianData.addressId,
                    guardianData.phone,
                    guardianData.email,
                    guardianData.authorizedPickup || false,
                    guardianData.authorizedChange || false,
                    id
                ]
            );
            return this.findById(id);
        } catch (err) {
            console.error(`Error updating guardian with id ${id}:`, err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async delete(id) {
        let conn;
        try {
            conn = await getConnection();
            
            // Verificar si tiene estudiantes asignados
            const check = await conn.query(
                'SELECT COUNT(*) as count FROM student_guardian WHERE guardian_id = ?',
                [id]
            );
            
            if (check[0].count > 0) {
                throw new Error(`Cannot delete guardian: Still assigned to ${check[0].count} student(s)`);
            }
            
            const result = await conn.query('DELETE FROM guardian WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (err) {
            console.error(`Error deleting guardian with id ${id}:`, err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    // Métodos para gestionar la relación student_guardian
    async assignToStudent(studentId, guardianId, relationData) {
        let conn;
        try {
            conn = await getConnection();
            
            // Si es principal, quitar el flag de otros
            if (relationData.isPrimary) {
                await conn.query(
                    'UPDATE student_guardian SET is_primary = FALSE WHERE student_id = ?',
                    [studentId]
                );
            }
            
            const result = await conn.query(
                `INSERT INTO student_guardian (
                    student_id, 
                    guardian_id, 
                    relationship, 
                    is_primary,
                    authorized_pickup,
                    authorized_diaper_change,
                    notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    studentId,
                    guardianId,
                    relationData.relationship,
                    relationData.isPrimary || false,
                    relationData.authorizedPickup || false,
                    relationData.authorizedDiaperChange || false,
                    relationData.notes || null
                ]
            );
            
            return result.insertId;
        } catch (err) {
            console.error('Error assigning guardian to student:', err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async updateRelation(studentId, guardianId, relationData) {
        let conn;
        try {
            conn = await getConnection();
            
            // Si es principal, quitar el flag de otros
            if (relationData.isPrimary) {
                await conn.query(
                    'UPDATE student_guardian SET is_primary = FALSE WHERE student_id = ? AND guardian_id != ?',
                    [studentId, guardianId]
                );
            }
            
            await conn.query(
                `UPDATE student_guardian SET
                    relationship = ?,
                    is_primary = ?,
                    authorized_pickup = ?,
                    authorized_diaper_change = ?,
                    notes = ?
                WHERE student_id = ? AND guardian_id = ?`,
                [
                    relationData.relationship,
                    relationData.isPrimary || false,
                    relationData.authorizedPickup || false,
                    relationData.authorizedDiaperChange || false,
                    relationData.notes || null,
                    studentId,
                    guardianId
                ]
            );
            
            return true;
        } catch (err) {
            console.error('Error updating guardian relation:', err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async removeFromStudent(studentId, guardianId) {
        let conn;
        try {
            conn = await getConnection();
            
            // Verificar que no sea el único responsable
            const check = await conn.query(
                'SELECT COUNT(*) as count FROM student_guardian WHERE student_id = ?',
                [studentId]
            );
            
            if (check[0].count <= 1) {
                throw new Error('Cannot remove last guardian from student');
            }
            
            const result = await conn.query(
                'DELETE FROM student_guardian WHERE student_id = ? AND guardian_id = ?',
                [studentId, guardianId]
            );
            
            return result.affectedRows > 0;
        } catch (err) {
            console.error('Error removing guardian from student:', err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async getAllRelationships(searchTerm = null) {
        let conn;
        try {
            conn = await getConnection();
            
            let query = `
                SELECT 
                    g.id as guardian_id,
                    g.first_name as g_first_name,
                    g.middle_name_optional as g_middle_name,
                    g.paternal_surname as g_paternal_surname,
                    g.maternal_surname as g_maternal_surname,
                    g.phone as g_phone,
                    g.email_optional as g_email,
                    s.id as student_id,
                    s.first_name as s_first_name,
                    s.paternal_surname as s_paternal_surname,
                    s.maternal_surname as s_maternal_surname,
                    s.nickname_optional as s_nickname,
                    s.birth_date,
                    s.shift,
                    c.id as classroom_id,
                    c.name as classroom_name,
                    sg.relationship,
                    sg.is_primary,
                    sg.authorized_pickup,
                    sg.authorized_diaper_change,
                    sg.notes
                FROM student_guardian sg
                INNER JOIN guardian g ON sg.guardian_id = g.id
                INNER JOIN student s ON sg.student_id = s.id
                LEFT JOIN classroom c ON s.classroom_id = c.id
                WHERE 1=1
            `;
            
            const params = [];
            
            if (searchTerm) {
                const searchTerms = searchTerm.trim().split(/\s+/);
                searchTerms.forEach(term => {
                    query += ` AND (
                        g.first_name LIKE ? 
                        OR g.middle_name_optional LIKE ?
                        OR g.paternal_surname LIKE ? 
                        OR g.maternal_surname LIKE ?
                        OR g.phone LIKE ?
                        OR g.email_optional LIKE ?
                        OR s.first_name LIKE ?
                        OR s.paternal_surname LIKE ?
                        OR s.maternal_surname LIKE ?
                        OR s.nickname_optional LIKE ?
                        OR c.name LIKE ?
                    )`;
                    const likeParam = `%${term}%`;
                    params.push(likeParam, likeParam, likeParam, likeParam, likeParam, 
                               likeParam, likeParam, likeParam, likeParam, likeParam, likeParam);
                });
            }
            
            query += ` ORDER BY g.paternal_surname, g.first_name, s.paternal_surname, s.first_name`;
            
            const rows = await conn.query(query, params);
            return rows;
        } catch (err) {
            console.error('Error getting all relationships:', err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }
}

module.exports = new GuardianRepository();

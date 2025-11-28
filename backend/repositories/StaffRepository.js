const pool = require('../db');

const StaffRepository = {
    async findAll() {
        const conn = await pool.getConnection();
        try {
            const rows = await conn.query(`
                SELECT 
                    s.id,
                    s.first_name,
                    s.middle_name_optional,
                    s.third_name_optional,
                    s.paternal_surname,
                    s.maternal_surname,
                    s.dni,
                    s.phone,
                    s.email,
                    s.is_active,
                    s.classroom_id,
                    s.role_id,
                    s.created_at,
                    s.last_login,
                    r.role_name,
                    c.name as classroom_name,
                    c.shift as classroom_shift
                FROM staff s
                LEFT JOIN role r ON s.role_id = r.id
                LEFT JOIN classroom c ON s.classroom_id = c.id
                ORDER BY s.paternal_surname, s.first_name
            `);
            return rows;
        } finally {
            conn.release();
        }
    },

    async findById(id) {
        const conn = await pool.getConnection();
        try {
            const rows = await conn.query(`
                SELECT 
                    s.id,
                    s.first_name,
                    s.middle_name_optional,
                    s.third_name_optional,
                    s.paternal_surname,
                    s.maternal_surname,
                    s.dni,
                    s.phone,
                    s.email,
                    s.email_optional,
                    s.is_active,
                    s.classroom_id,
                    s.role_id,
                    s.created_at,
                    s.last_login,
                    r.role_name,
                    c.name as classroom_name
                FROM staff s
                LEFT JOIN role r ON s.role_id = r.id
                LEFT JOIN classroom c ON s.classroom_id = c.id
                WHERE s.id = ?
            `, [id]);
            return rows[0] || null;
        } finally {
            conn.release();
        }
    },

    async create(staffData) {
        const conn = await pool.getConnection();
        try {
            const result = await conn.query(
                `INSERT INTO staff (
                    first_name, middle_name_optional, third_name_optional,
                    paternal_surname, maternal_surname, dni, phone, email, email_optional,
                    password_hash, role_id, classroom_id, is_active
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    staffData.first_name,
                    staffData.middle_name_optional || null,
                    staffData.third_name_optional || null,
                    staffData.paternal_surname,
                    staffData.maternal_surname || null,
                    staffData.dni || null,
                    staffData.phone || null,
                    staffData.email || null,
                    staffData.email_optional || null,
                    staffData.password_hash || null,
                    staffData.role_id,
                    staffData.classroom_id || null,
                    staffData.is_active !== undefined ? staffData.is_active : true
                ]
            );
            return result.insertId;
        } finally {
            conn.release();
        }
    },

    async update(id, staffData) {
        const conn = await pool.getConnection();
        try {
            await conn.query(
                `UPDATE staff SET
                    first_name = ?,
                    middle_name_optional = ?,
                    third_name_optional = ?,
                    paternal_surname = ?,
                    maternal_surname = ?,
                    dni = ?,
                    phone = ?,
                    email = ?,
                    email_optional = ?,
                    role_id = ?,
                    classroom_id = ?,
                    is_active = ?
                WHERE id = ?`,
                [
                    staffData.first_name,
                    staffData.middle_name_optional || null,
                    staffData.third_name_optional || null,
                    staffData.paternal_surname,
                    staffData.maternal_surname || null,
                    staffData.dni || null,
                    staffData.phone || null,
                    staffData.email || null,
                    staffData.email_optional || null,
                    staffData.role_id,
                    staffData.classroom_id || null,
                    staffData.is_active !== undefined ? staffData.is_active : true,
                    id
                ]
            );
            return true;
        } finally {
            conn.release();
        }
    },

    async delete(id) {
        const conn = await pool.getConnection();
        try {
            await conn.query('DELETE FROM staff WHERE id = ?', [id]);
            return true;
        } finally {
            conn.release();
        }
    },

    async getRoles() {
        const conn = await pool.getConnection();
        try {
            const rows = await conn.query('SELECT id, role_name FROM role ORDER BY role_name');
            return rows;
        } finally {
            conn.release();
        }
    }
};

module.exports = StaffRepository;

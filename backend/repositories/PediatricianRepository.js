const { pool } = require('../db');

class PediatricianRepository {
    async getAll() {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("SELECT * FROM pediatricians WHERE is_active = 1 ORDER BY full_name ASC");
            return rows;
        } catch (error) {
            throw error;
        } finally {
            if (conn) conn.end();
        }
    }

    async create(name, phone) {
        let conn;
        try {
            conn = await pool.getConnection();
            const result = await conn.query(
                "INSERT INTO pediatricians (full_name, phone) VALUES (?, ?)",
                [name, phone]
            );
            return { id: result.insertId, name, phone };
        } catch (error) {
            throw error;
        } finally {
            if (conn) conn.end();
        }
    }

    async updateByFieldName(name, phone) {
        let conn;
        try {
            conn = await pool.getConnection();
            await conn.query(
                "UPDATE pediatricians SET phone = ? WHERE full_name = ?",
                [phone, name]
            );
            return true;
        } catch (error) {
            throw error;
        } finally {
            if (conn) conn.end();
        }
    }

    async findByName(name) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("SELECT * FROM pediatricians WHERE full_name = ?", [name]);
            return rows[0];
        } catch (error) {
            throw error;
        } finally {
            if (conn) conn.end();
        }
    }
}

module.exports = new PediatricianRepository();

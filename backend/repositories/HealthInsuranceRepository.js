const { pool } = require('../db');

class HealthInsuranceRepository {
    async getAll() {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("SELECT * FROM health_insurance_providers WHERE is_active = 1 ORDER BY name ASC");
            return rows;
        } catch (error) {
            throw error;
        } finally {
            if (conn) conn.end();
        }
    }

    async create(name) {
        let conn;
        try {
            conn = await pool.getConnection();
            const result = await conn.query(
                "INSERT INTO health_insurance_providers (name) VALUES (?)",
                [name]
            );
            return { id: result.insertId, name };
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
            const rows = await conn.query("SELECT * FROM health_insurance_providers WHERE name = ?", [name]);
            return rows[0];
        } catch (error) {
            throw error;
        } finally {
            if (conn) conn.end();
        }
    }
}

module.exports = new HealthInsuranceRepository();

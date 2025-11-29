const pool = require('../db');

const RoleRepository = {
    async findAll() {
        const conn = await pool.getConnection();
        try {
            const rows = await conn.query(`
                SELECT 
                    r.id,
                    r.role_name,
                    r.access_level_id,
                    al.access_name
                FROM role r
                JOIN access_level al ON r.access_level_id = al.id
                ORDER BY r.role_name
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
                    r.id,
                    r.role_name,
                    r.access_level_id,
                    al.access_name
                FROM role r
                JOIN access_level al ON r.access_level_id = al.id
                WHERE r.id = ?
            `, [id]);
            return rows[0] || null;
        } finally {
            conn.release();
        }
    },

    async findByName(roleName) {
        const conn = await pool.getConnection();
        try {
            const rows = await conn.query(`
                SELECT 
                    r.id,
                    r.role_name,
                    r.access_level_id,
                    al.access_name
                FROM role r
                JOIN access_level al ON r.access_level_id = al.id
                WHERE r.role_name = ?
            `, [roleName]);
            return rows[0] || null;
        } finally {
            conn.release();
        }
    },

    async create(roleData) {
        const conn = await pool.getConnection();
        try {
            const result = await conn.query(
                'INSERT INTO role (role_name, access_level_id) VALUES (?, ?)',
                [roleData.role_name, roleData.access_level_id]
            );
            return result.insertId;
        } finally {
            conn.release();
        }
    },

    async update(id, roleData) {
        const conn = await pool.getConnection();
        try {
            await conn.query(
                'UPDATE role SET role_name = ?, access_level_id = ? WHERE id = ?',
                [roleData.role_name, roleData.access_level_id, id]
            );
            return true;
        } finally {
            conn.release();
        }
    },

    async delete(id) {
        const conn = await pool.getConnection();
        try {
            await conn.query('DELETE FROM role WHERE id = ?', [id]);
            return true;
        } finally {
            conn.release();
        }
    },

    async findAllAccessLevels() {
        const conn = await pool.getConnection();
        try {
            const rows = await conn.query('SELECT id, access_name FROM access_level ORDER BY access_name');
            return rows;
        } finally {
            conn.release();
        }
    },

    async createAccessLevel(accessLevelData) {
        const conn = await pool.getConnection();
        try {
            const result = await conn.query(
                'INSERT INTO access_level (access_name, description) VALUES (?, ?)',
                [accessLevelData.access_name, accessLevelData.description]
            );
            return result.insertId;
        } finally {
            conn.release();
        }
    }
};

module.exports = RoleRepository;

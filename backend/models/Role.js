// models/Role.js
const { getConnection } = require('../db');

class Role {
  static async getAll() {
    const conn = await getConnection();
    try {
      const result = await conn.query(`
        SELECT r.*, al.access_name
        FROM role r
        LEFT JOIN access_level al ON r.access_level_id = al.id
        ORDER BY r.role_name
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
        `SELECT r.*, al.access_name
         FROM role r
         LEFT JOIN access_level al ON r.access_level_id = al.id
         WHERE r.id = ?`,
        [id]
      );
      return result[0];
    } finally {
      conn.release();
    }
  }

  static async create(roleData) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `INSERT INTO role (role_name, access_level_id) 
         VALUES (?, ?)`,
        [
          roleData.role_name,
          roleData.access_level_id
        ]
      );
      return result.insertId;
    } finally {
      conn.release();
    }
  }

  static async update(id, roleData) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `UPDATE role SET role_name = ?, access_level_id = ? WHERE id = ?`,
        [
          roleData.role_name,
          roleData.access_level_id,
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
      const result = await conn.query('DELETE FROM role WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } finally {
      conn.release();
    }
  }
}

module.exports = Role;
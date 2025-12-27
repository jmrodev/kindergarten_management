// repositories/RoleRepository.js
const { getConnection } = require('../db');

class RoleRepository {
  static async getAll(options = {}) {
    const conn = await getConnection();
    try {
      const { filters = {}, pagination = {} } = options;
      let query = `
        SELECT r.*, al.access_name
        FROM role r
        LEFT JOIN access_level al ON r.access_level_id = al.id
        WHERE 1=1
      `;
      const params = [];

      // Apply filters
      if (filters.accessLevelId) {
        query += ' AND r.access_level_id = ?';
        params.push(filters.accessLevelId);
      }

      // Apply pagination
      if (pagination.limit && pagination.offset !== undefined) {
        query += ' LIMIT ? OFFSET ?';
        params.push(pagination.limit, pagination.offset);
      } else if (pagination.limit) {
        query += ' LIMIT ?';
        params.push(pagination.limit);
      }

      query += ' ORDER BY r.role_name';

      const results = await conn.query(query, params);
      return results;
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

  static async count(filters = {}) {
    const conn = await getConnection();
    try {
      let query = 'SELECT CAST(COUNT(*) AS SIGNED) as count FROM role WHERE 1=1';
      const params = [];

      if (filters.accessLevelId) {
        query += ' AND access_level_id = ?';
        params.push(filters.accessLevelId);
      }

      const result = await conn.query(query, params);
      return result[0].count;
    } finally {
      conn.release();
    }
  }
}

module.exports = RoleRepository;
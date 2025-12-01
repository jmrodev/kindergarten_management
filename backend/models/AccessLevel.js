// models/AccessLevel.js
const { getConnection } = require('../db');

class AccessLevel {
  static async getAll() {
    const conn = await getConnection();
    try {
      const result = await conn.query('SELECT * FROM access_level ORDER BY access_name');
      return result;
    } finally {
      conn.release();
    }
  }

  static async getById(id) {
    const conn = await getConnection();
    try {
      const result = await conn.query('SELECT * FROM access_level WHERE id = ?', [id]);
      return result[0];
    } finally {
      conn.release();
    }
  }

  static async create(accessLevelData) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `INSERT INTO access_level (access_name, description) 
         VALUES (?, ?)`,
        [
          accessLevelData.access_name,
          accessLevelData.description
        ]
      );
      return result.insertId;
    } finally {
      conn.release();
    }
  }

  static async update(id, accessLevelData) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `UPDATE access_level SET access_name = ?, description = ? WHERE id = ?`,
        [
          accessLevelData.access_name,
          accessLevelData.description,
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
      const result = await conn.query('DELETE FROM access_level WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } finally {
      conn.release();
    }
  }
}

module.exports = AccessLevel;
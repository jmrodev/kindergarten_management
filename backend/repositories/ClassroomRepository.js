// repositories/ClassroomRepository.js
const { getConnection } = require('../db');

class ClassroomRepository {
  static async getAll(options = {}) {
    const conn = await getConnection();
    try {
      const { filters = {}, pagination = {} } = options;
      let query = 'SELECT * FROM classroom WHERE 1=1';
      const params = [];

      // Apply filters
      if (filters.isActive !== undefined) {
        query += ' AND is_active = ?';
        params.push(filters.isActive);
      }

      // Apply pagination
      if (pagination.limit && pagination.offset !== undefined) {
        query += ' LIMIT ? OFFSET ?';
        params.push(pagination.limit, pagination.offset);
      } else if (pagination.limit) {
        query += ' LIMIT ?';
        params.push(pagination.limit);
      }

      query += ' ORDER BY name';

      const results = await conn.query(query, params);
      return results;
    } finally {
      conn.release();
    }
  }

  static async getById(id) {
    const conn = await getConnection();
    try {
      const result = await conn.query('SELECT * FROM classroom WHERE id = ?', [id]);
      return result[0];
    } finally {
      conn.release();
    }
  }

  static async create(classroomData) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `INSERT INTO classroom (name, capacity, shift, academic_year, 
         age_group, is_active) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          classroomData.name,
          classroomData.capacity,
          classroomData.shift,
          classroomData.academic_year,
          classroomData.age_group,
          classroomData.is_active !== undefined ? classroomData.is_active : true
        ]
      );
      return result.insertId;
    } finally {
      conn.release();
    }
  }

  static async update(id, classroomData) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `UPDATE classroom SET name = ?, capacity = ?, shift = ?, 
         academic_year = ?, age_group = ?, is_active = ? WHERE id = ?`,
        [
          classroomData.name,
          classroomData.capacity,
          classroomData.shift,
          classroomData.academic_year,
          classroomData.age_group,
          classroomData.is_active,
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
      const result = await conn.query('DELETE FROM classroom WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } finally {
      conn.release();
    }
  }

  static async assignTeacher(classroomId, teacherId) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        'UPDATE classroom SET teacher_id = ? WHERE id = ?',
        [teacherId, classroomId]
      );
      return result.affectedRows > 0;
    } finally {
      conn.release();
    }
  }


  static async count(filters = {}) {
    const conn = await getConnection();
    try {
      let query = 'SELECT COUNT(*) as count FROM classroom WHERE 1=1';
      const params = [];

      if (filters.isActive !== undefined) {
        query += ' AND is_active = ?';
        params.push(filters.isActive);
      }

      const result = await conn.query(query, params);
      return result[0].count;
    } finally {
      conn.release();
    }
  }
}

module.exports = ClassroomRepository;
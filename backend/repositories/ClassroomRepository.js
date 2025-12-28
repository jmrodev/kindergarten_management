// repositories/ClassroomRepository.js
const { getConnection } = require('../db');

class ClassroomRepository {
  static async getAll(options = {}) {
    const conn = await getConnection();
    try {
      const { filters = {}, pagination = {} } = options;
      let query = `
        SELECT c.*, 
               s.first_name as teacher_first_name, 
               s.paternal_surname as teacher_surname,
               CAST(COUNT(st.id) AS CHAR) as student_count, -- Cast to CHAR to avoid BigInt issues if any, though count is usually safe
               MIN(TIMESTAMPDIFF(MONTH, st.birth_date, CURDATE()))/12 as min_age_years,
               MAX(TIMESTAMPDIFF(MONTH, st.birth_date, CURDATE()))/12 as max_age_years
        FROM classroom c
        LEFT JOIN staff s ON c.teacher_id = s.id
        LEFT JOIN student st ON st.classroom_id = c.id AND st.status IN ('inscripto', 'activo')
        WHERE 1=1
        GROUP BY c.id, s.id -- Group by necessary fields
      `;
      const params = [];

      // Apply filters
      if (filters.isActive !== undefined) {
        query += ' AND c.is_active = ?';
        params.push(filters.isActive);
      }

      if (['true', '1', true, 1].includes(filters.unassignedOnly)) {
        query += ' AND c.teacher_id IS NULL';
      }

      // Apply pagination
      if (pagination.limit && pagination.offset !== undefined) {
        query += ' LIMIT ? OFFSET ?';
        params.push(pagination.limit, pagination.offset);
      } else if (pagination.limit) {
        query += ' LIMIT ?';
        params.push(pagination.limit);
      }

      // query += ' ORDER BY c.name'; // Implicit sort order if needed or add explicit

      const results = await conn.query(query, params);
      return results;
    } finally {
      conn.release();
    }
  }

  static async getById(id) {
    const conn = await getConnection();
    try {
      const result = await conn.query(`
        SELECT c.*, 
               s.first_name as teacher_first_name, 
               s.paternal_surname as teacher_surname
        FROM classroom c
        LEFT JOIN staff s ON c.teacher_id = s.id
        WHERE c.id = ?
      `, [id]);
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
      let query = 'SELECT CAST(COUNT(*) AS SIGNED) as count FROM classroom WHERE 1=1';
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
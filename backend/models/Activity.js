// models/Activity.js
const { getConnection } = require('../db');

class Activity {
  static async getAll(filters = {}) {
    const conn = await getConnection();
    try {
      let query = `SELECT a.*, 
                   CONCAT(stf.first_name, ' ', stf.paternal_surname) as teacher_name,
                   cl.name as classroom_name
                   FROM activity a
                   LEFT JOIN staff stf ON a.teacher_id = stf.id
                   LEFT JOIN classroom cl ON a.classroom_id = cl.id
                   WHERE 1=1`;
      const params = [];

      // Apply filters if provided
      if (filters.teacherId) {
        query += ' AND a.teacher_id = ?';
        params.push(filters.teacherId);
      }
      
      if (filters.classroomId) {
        query += ' AND a.classroom_id = ?';
        params.push(filters.classroomId);
      }

      query += ' ORDER BY a.name';

      const result = await conn.query(query, params);
      return result;
    } finally {
      conn.release();
    }
  }

  static async getById(id) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `SELECT a.*, 
         CONCAT(stf.first_name, ' ', stf.paternal_surname) as teacher_name,
         cl.name as classroom_name
         FROM activity a
         LEFT JOIN staff stf ON a.teacher_id = stf.id
         LEFT JOIN classroom cl ON a.classroom_id = cl.id
         WHERE a.id = ?`,
        [id]
      );
      return result[0];
    } finally {
      conn.release();
    }
  }

  static async create(activityData) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `INSERT INTO activity (name, description_optional, schedule_optional, 
         teacher_id, classroom_id) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          activityData.name,
          activityData.description_optional,
          activityData.schedule_optional,
          activityData.teacher_id,
          activityData.classroom_id
        ]
      );
      return result.insertId;
    } finally {
      conn.release();
    }
  }

  static async update(id, activityData) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `UPDATE activity SET name = ?, description_optional = ?, 
         schedule_optional = ?, teacher_id = ?, classroom_id = ? WHERE id = ?`,
        [
          activityData.name,
          activityData.description_optional,
          activityData.schedule_optional,
          activityData.teacher_id,
          activityData.classroom_id,
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
      const result = await conn.query('DELETE FROM activity WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } finally {
      conn.release();
    }
  }

  static async getByClassroom(classroomId) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `SELECT a.*, 
         CONCAT(stf.first_name, ' ', stf.paternal_surname) as teacher_name,
         cl.name as classroom_name
         FROM activity a
         LEFT JOIN staff stf ON a.teacher_id = stf.id
         LEFT JOIN classroom cl ON a.classroom_id = cl.id
         WHERE a.classroom_id = ?
         ORDER BY a.name`,
        [classroomId]
      );
      return result;
    } finally {
      conn.release();
    }
  }

  static async getByTeacher(teacherId) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `SELECT a.*, 
         CONCAT(stf.first_name, ' ', stf.paternal_surname) as teacher_name,
         cl.name as classroom_name
         FROM activity a
         LEFT JOIN staff stf ON a.teacher_id = stf.id
         LEFT JOIN classroom cl ON a.classroom_id = cl.id
         WHERE a.teacher_id = ?
         ORDER BY cl.name, a.name`,
        [teacherId]
      );
      return result;
    } finally {
      conn.release();
    }
  }

  static async getSpecialActivities() {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `SELECT a.*, 
         CONCAT(stf.first_name, ' ', stf.paternal_surname) as teacher_name,
         cl.name as classroom_name
         FROM activity a
         LEFT JOIN staff stf ON a.teacher_id = stf.id
         LEFT JOIN classroom cl ON a.classroom_id = cl.id
         WHERE a.teacher_id IS NOT NULL AND a.classroom_id IS NOT NULL
         ORDER BY cl.name, a.name`
      );
      return result;
    } finally {
      conn.release();
    }
  }
}

module.exports = Activity;
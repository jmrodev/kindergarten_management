// models/Calendar.js
const { getConnection } = require('../db');

class Calendar {
  static async getAll(filters = {}) {
    const conn = await getConnection();
    try {
      let query = `SELECT c.*, 
                   cl.name as classroom_name,
                   CONCAT(stf.first_name, ' ', stf.paternal_surname) as staff_name
                   FROM calendar c
                   LEFT JOIN classroom cl ON c.classroom_id = cl.id
                   LEFT JOIN staff stf ON c.staff_id = stf.id
                   WHERE 1=1`;
      const params = [];

      // Apply filters if provided
      if (filters.classroomId) {
        query += ' AND c.classroom_id = ?';
        params.push(filters.classroomId);
      }
      
      if (filters.eventType) {
        query += ' AND c.event_type = ?';
        params.push(filters.eventType);
      }
      
      if (filters.staffId) {
        query += ' AND c.staff_id = ?';
        params.push(filters.staffId);
      }
      
      if (filters.startDate && filters.endDate) {
        query += ' AND c.date BETWEEN ? AND ?';
        params.push(filters.startDate, filters.endDate);
      }

      query += ' ORDER BY c.date';

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
        `SELECT c.*, 
         cl.name as classroom_name,
         CONCAT(stf.first_name, ' ', stf.paternal_surname) as staff_name
         FROM calendar c
         LEFT JOIN classroom cl ON c.classroom_id = cl.id
         LEFT JOIN staff stf ON c.staff_id = stf.id
         WHERE c.id = ?`,
        [id]
      );
      return result[0];
    } finally {
      conn.release();
    }
  }

  static async create(calendarData) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `INSERT INTO calendar (date, description, event_type, classroom_id, staff_id) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          calendarData.date,
          calendarData.description,
          calendarData.event_type,
          calendarData.classroom_id,
          calendarData.staff_id
        ]
      );
      return result.insertId;
    } finally {
      conn.release();
    }
  }

  static async update(id, calendarData) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `UPDATE calendar SET date = ?, description = ?, event_type = ?, 
         classroom_id = ?, staff_id = ? WHERE id = ?`,
        [
          calendarData.date,
          calendarData.description,
          calendarData.event_type,
          calendarData.classroom_id,
          calendarData.staff_id,
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
      const result = await conn.query('DELETE FROM calendar WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } finally {
      conn.release();
    }
  }

  static async getEventsByMonth(year, month) {
    const conn = await getConnection();
    try {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDate = `${year}-${String(month).padStart(2, '0')}-31`;
      
      const result = await conn.query(
        `SELECT c.*, 
         cl.name as classroom_name,
         CONCAT(stf.first_name, ' ', stf.paternal_surname) as staff_name
         FROM calendar c
         LEFT JOIN classroom cl ON c.classroom_id = cl.id
         LEFT JOIN staff stf ON c.staff_id = stf.id
         WHERE c.date BETWEEN ? AND ?
         ORDER BY c.date`,
        [startDate, endDate]
      );
      return result;
    } finally {
      conn.release();
    }
  }

  static async getEventsByClassroom(classroomId, startDate, endDate) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `SELECT c.*, 
         cl.name as classroom_name,
         CONCAT(stf.first_name, ' ', stf.paternal_surname) as staff_name
         FROM calendar c
         LEFT JOIN classroom cl ON c.classroom_id = cl.id
         LEFT JOIN staff stf ON c.staff_id = stf.id
         WHERE c.classroom_id = ? AND c.date BETWEEN ? AND ?
         ORDER BY c.date`,
        [classroomId, startDate, endDate]
      );
      return result;
    } finally {
      conn.release();
    }
  }

  static async getSpecialEvents(startDate, endDate) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `SELECT c.*, 
         cl.name as classroom_name,
         CONCAT(stf.first_name, ' ', stf.paternal_surname) as staff_name
         FROM calendar c
         LEFT JOIN classroom cl ON c.classroom_id = cl.id
         LEFT JOIN staff stf ON c.staff_id = stf.id
         WHERE c.event_type IN ('arte', 'musica', 'gimnasia', 'ingles', 'expresion_corporal', 
                               'salida', 'reunion_directivos_familia', 'reunion_apoyo_familia', 
                               'reunion_personal', 'celebracion', 'evento_especial')
         AND c.date BETWEEN ? AND ?
         ORDER BY c.date`,
        [startDate, endDate]
      );
      return result;
    } finally {
      conn.release();
    }
  }
}

module.exports = Calendar;
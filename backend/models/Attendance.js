// models/Attendance.js
const { getConnection } = require('../db');

class Attendance {
  static async getAll(filters = {}) {
    const conn = await getConnection();
    try {
      let query = `SELECT a.*, 
                   s.first_name, s.paternal_surname, s.maternal_surname,
                   stf.first_name as staff_first_name, stf.paternal_surname as staff_paternal_surname,
                   c.name as classroom_name
                   FROM attendance a
                   LEFT JOIN student s ON a.student_id = s.id
                   LEFT JOIN staff stf ON a.staff_id = stf.id
                   LEFT JOIN classroom c ON a.classroom_id = c.id
                   WHERE 1=1`;
      const params = [];

      // Apply filters if provided
      if (filters.studentId) {
        query += ' AND a.student_id = ?';
        params.push(filters.studentId);
      }
      
      if (filters.staffId) {
        query += ' AND a.staff_id = ?';
        params.push(filters.staffId);
      }
      
      if (filters.classroomId) {
        query += ' AND a.classroom_id = ?';
        params.push(filters.classroomId);
      }
      
      if (filters.date) {
        query += ' AND a.date = ?';
        params.push(filters.date);
      }
      
      if (filters.startDate && filters.endDate) {
        query += ' AND a.date BETWEEN ? AND ?';
        params.push(filters.startDate, filters.endDate);
      }

      query += ' ORDER BY a.date DESC, a.student_id';

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
         s.first_name, s.paternal_surname, s.maternal_surname,
         stf.first_name as staff_first_name, stf.paternal_surname as staff_paternal_surname,
         c.name as classroom_name
         FROM attendance a
         LEFT JOIN student s ON a.student_id = s.id
         LEFT JOIN staff stf ON a.staff_id = stf.id
         LEFT JOIN classroom c ON a.classroom_id = c.id
         WHERE a.id = ?`,
        [id]
      );
      return result[0];
    } finally {
      conn.release();
    }
  }

  static async getByStudentAndDate(studentId, date) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `SELECT a.*, 
         s.first_name, s.paternal_surname, s.maternal_surname,
         stf.first_name as staff_first_name, stf.paternal_surname as staff_paternal_surname,
         c.name as classroom_name
         FROM attendance a
         LEFT JOIN student s ON a.student_id = s.id
         LEFT JOIN staff stf ON a.staff_id = stf.id
         LEFT JOIN classroom c ON a.classroom_id = c.id
         WHERE a.student_id = ? AND a.date = ?
         ORDER BY a.date DESC`,
        [studentId, date]
      );
      return result[0];
    } finally {
      conn.release();
    }
  }

  static async create(attendanceData) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `INSERT INTO attendance (student_id, date, status, leave_type_optional, 
         classroom_id, staff_id) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          attendanceData.student_id,
          attendanceData.date,
          attendanceData.status,
          attendanceData.leave_type_optional,
          attendanceData.classroom_id,
          attendanceData.staff_id
        ]
      );
      return result.insertId;
    } finally {
      conn.release();
    }
  }

  static async update(id, attendanceData) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `UPDATE attendance SET student_id = ?, date = ?, status = ?, 
         leave_type_optional = ?, classroom_id = ?, staff_id = ? WHERE id = ?`,
        [
          attendanceData.student_id,
          attendanceData.date,
          attendanceData.status,
          attendanceData.leave_type_optional,
          attendanceData.classroom_id,
          attendanceData.staff_id,
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
      const result = await conn.query('DELETE FROM attendance WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } finally {
      conn.release();
    }
  }

  static async getDailyAttendance(date) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `SELECT a.*, 
         CONCAT(CAST(s.first_name AS CHAR), ' ', CAST(s.paternal_surname AS CHAR), IFNULL(CONCAT(' ', CAST(s.maternal_surname AS CHAR)), '')) as student_name,
         c.name as classroom_name
         FROM attendance a
         LEFT JOIN student s ON a.student_id = s.id
         LEFT JOIN classroom c ON a.classroom_id = c.id
         WHERE a.date = ?
         ORDER BY c.name, s.paternal_surname, s.first_name`,
        [date]
      );
      return result;
    } finally {
      conn.release();
    }
  }

  static async getStaffAttendance(filters = {}) {
    const conn = await getConnection();
    try {
      let query = `SELECT a.*, 
                   stf.first_name, stf.paternal_surname, stf.maternal_surname,
                   c.name as classroom_name
                   FROM attendance a
                   LEFT JOIN staff stf ON a.staff_id = stf.id
                   LEFT JOIN classroom c ON a.classroom_id = c.id
                   WHERE a.staff_id IS NOT NULL`;
      const params = [];

      if (filters.staffId) {
        query += ' AND a.staff_id = ?';
        params.push(filters.staffId);
      }
      
      if (filters.date) {
        query += ' AND a.date = ?';
        params.push(filters.date);
      }
      
      if (filters.startDate && filters.endDate) {
        query += ' AND a.date BETWEEN ? AND ?';
        params.push(filters.startDate, filters.endDate);
      }

      query += ' ORDER BY a.date DESC, stf.paternal_surname';
      
      const result = await conn.query(query, params);
      return result;
    } finally {
      conn.release();
    }
  }
}

module.exports = Attendance;
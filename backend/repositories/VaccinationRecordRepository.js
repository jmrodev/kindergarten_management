// repositories/VaccinationRecordRepository.js
const { getConnection } = require('../db');

class VaccinationRecordRepository {
  static async getAll(options = {}) {
    const conn = await getConnection();
    try {
      const { filters = {}, pagination = {} } = options;
      let query = `SELECT vr.*, s.first_name, s.paternal_surname, s.maternal_surname 
                   FROM vaccination_records vr 
                   LEFT JOIN student s ON vr.student_id = s.id 
                   WHERE 1=1`;
      const params = [];

      // Apply filters
      if (filters.studentId) {
        query += ' AND vr.student_id = ?';
        params.push(filters.studentId);
      }
      
      if (filters.status) {
        query += ' AND vr.status = ?';
        params.push(filters.status);
      }

      // Apply pagination
      if (pagination.limit && pagination.offset !== undefined) {
        query += ' LIMIT ? OFFSET ?';
        params.push(pagination.limit, pagination.offset);
      } else if (pagination.limit) {
        query += ' LIMIT ?';
        params.push(pagination.limit);
      }

      query += ' ORDER BY vr.vaccine_date DESC';

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
        `SELECT vr.*, s.first_name, s.paternal_surname, s.maternal_surname 
         FROM vaccination_records vr 
         LEFT JOIN student s ON vr.student_id = s.id 
         WHERE vr.id = ?`,
        [id]
      );
      return result[0];
    } finally {
      conn.release();
    }
  }

  static async getByStudentId(studentId) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `SELECT vr.*, s.first_name, s.paternal_surname, s.maternal_surname 
         FROM vaccination_records vr 
         LEFT JOIN student s ON vr.student_id = s.id 
         WHERE vr.student_id = ? 
         ORDER BY vr.vaccine_date DESC`,
        [studentId]
      );
      return result;
    } finally {
      conn.release();
    }
  }

  static async create(vaccinationData) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `INSERT INTO vaccination_records (student_id, vaccine_name, vaccine_date, 
         batch_number, dose_number, next_due_date, status, administered_by, notes) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          vaccinationData.student_id,
          vaccinationData.vaccine_name,
          vaccinationData.vaccine_date,
          vaccinationData.batch_number,
          vaccinationData.dose_number,
          vaccinationData.next_due_date,
          vaccinationData.status,
          vaccinationData.administered_by,
          vaccinationData.notes
        ]
      );
      return result.insertId;
    } finally {
      conn.release();
    }
  }

  static async update(id, vaccinationData) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `UPDATE vaccination_records SET vaccine_name = ?, vaccine_date = ?, 
         batch_number = ?, dose_number = ?, next_due_date = ?, status = ?, 
         administered_by = ?, notes = ?, updated_at = NOW() 
         WHERE id = ?`,
        [
          vaccinationData.vaccine_name,
          vaccinationData.vaccine_date,
          vaccinationData.batch_number,
          vaccinationData.dose_number,
          vaccinationData.next_due_date,
          vaccinationData.status,
          vaccinationData.administered_by,
          vaccinationData.notes,
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
      const result = await conn.query('DELETE FROM vaccination_records WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } finally {
      conn.release();
    }
  }

  static async count(filters = {}) {
    const conn = await getConnection();
    try {
      let query = `SELECT COUNT(*) as count FROM vaccination_records vr
                   LEFT JOIN student s ON vr.student_id = s.id 
                   WHERE 1=1`;
      const params = [];

      if (filters.studentId) {
        query += ' AND vr.student_id = ?';
        params.push(filters.studentId);
      }
      
      if (filters.status) {
        query += ' AND vr.status = ?';
        params.push(filters.status);
      }

      const result = await conn.query(query, params);
      return result[0].count;
    } finally {
      conn.release();
    }
  }

  static async getVaccinationStatusSummary() {
    const conn = await getConnection();
    try {
      const result = await conn.query(`
        SELECT 
          s.id as student_id,
          s.first_name,
          s.paternal_surname,
          s.maternal_surname,
          s.vaccination_status as overall_status,
          COUNT(CASE WHEN vr.status = 'faltante' THEN 1 END) as missing_vaccines,
          COUNT(CASE WHEN vr.status = 'activo' THEN 1 END) as active_vaccines,
          COUNT(CASE WHEN vr.status = 'completo' THEN 1 END) as complete_vaccines,
          COUNT(vr.id) as total_vaccines
        FROM student s
        LEFT JOIN vaccination_records vr ON s.id = vr.student_id
        GROUP BY s.id
        ORDER BY s.paternal_surname, s.first_name
      `);
      return result;
    } finally {
      conn.release();
    }
  }
}

module.exports = VaccinationRecordRepository;
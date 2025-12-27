// models/Student.js
const { getConnection } = require('../db');

class Student {
  static async getAll(filters = {}) {
    const conn = await getConnection();
    try {
      let query = `SELECT s.*,
                   a.street, a.number, a.city, a.provincia,
                   c.name as classroom_name
                   FROM student s
                   LEFT JOIN address a ON s.address_id = a.id
                   LEFT JOIN classroom c ON s.classroom_id = c.id
                   WHERE 1=1`;
      const params = [];

      // Apply filters if provided
      if (filters.status) {
        query += ' AND s.status = ?';
        params.push(filters.status);
      }

      if (filters.classroomId) {
        query += ' AND s.classroom_id = ?';
        params.push(filters.classroomId);
      }

      if (filters.shift) {
        query += ' AND s.shift = ?';
        params.push(filters.shift);
      }

      query += ' ORDER BY s.paternal_surname, s.first_name';

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
        `SELECT s.*,
         a.street, a.number, a.city, a.provincia,
         c.name as classroom_name
         FROM student s
         LEFT JOIN address a ON s.address_id = a.id
         LEFT JOIN classroom c ON s.classroom_id = c.id
         WHERE s.id = ?`,
        [id]
      );
      return result[0];
    } finally {
      conn.release();
    }
  }

  static async create(studentData) {
    const conn = await getConnection();
    try {
      // Create the student
      const result = await conn.query(
        `INSERT INTO student (first_name, middle_name_optional, third_name_optional, 
         paternal_surname, maternal_surname, nickname_optional, dni, birth_date, 
         address_id, classroom_id, shift, status, 
         enrollment_date, withdrawal_date, health_insurance, affiliate_number, 
         allergies, medications, medical_observations, blood_type, 
         pediatrician_name, pediatrician_phone, photo_authorization, 
         trip_authorization, medical_attention_authorization, 
         has_siblings_in_school, special_needs, vaccination_status, observations, gender) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          studentData.first_name,
          studentData.middle_name_optional,
          studentData.third_name_optional,
          studentData.paternal_surname,
          studentData.maternal_surname,
          studentData.nickname_optional,
          studentData.dni,
          studentData.birth_date,
          studentData.address_id,
          studentData.classroom_id,
          studentData.shift,
          studentData.status,
          studentData.enrollment_date,
          studentData.withdrawal_date,
          studentData.health_insurance,
          studentData.affiliate_number,
          studentData.allergies,
          studentData.medications,
          studentData.medical_observations,
          studentData.blood_type,
          studentData.pediatrician_name,
          studentData.pediatrician_phone,
          studentData.photo_authorization || false,
          studentData.trip_authorization || false,
          studentData.medical_attention_authorization || false,
          studentData.has_siblings_in_school || false,
          studentData.special_needs,
          studentData.vaccination_status || 'no_informado',
          studentData.observations,
          studentData.gender || null
        ]
      );

      const studentId = result.insertId;
      return studentId;
    } finally {
      conn.release();
    }
  }

  static async update(id, studentData) {
    const conn = await getConnection();
    try {
      // Update the student record
      const result = await conn.query(
        `UPDATE student SET first_name = ?, middle_name_optional = ?, 
         third_name_optional = ?, paternal_surname = ?, maternal_surname = ?, 
         nickname_optional = ?, dni = ?, birth_date = ?, address_id = ?, 
         classroom_id = ?, shift = ?, status = ?, enrollment_date = ?, 
         withdrawal_date = ?, health_insurance = ?, affiliate_number = ?, 
         allergies = ?, medications = ?, medical_observations = ?, 
         blood_type = ?, pediatrician_name = ?, pediatrician_phone = ?, 
         photo_authorization = ?, trip_authorization = ?, 
         medical_attention_authorization = ?, has_siblings_in_school = ?, 
         special_needs = ?, vaccination_status = ?, observations = ?, gender = ? 
         WHERE id = ?`,
        [
          studentData.first_name,
          studentData.middle_name_optional,
          studentData.third_name_optional,
          studentData.paternal_surname,
          studentData.maternal_surname,
          studentData.nickname_optional,
          studentData.dni,
          studentData.birth_date,
          studentData.address_id,
          studentData.classroom_id,
          studentData.shift,
          studentData.status,
          studentData.enrollment_date,
          studentData.withdrawal_date,
          studentData.health_insurance,
          studentData.affiliate_number,
          studentData.allergies,
          studentData.medications,
          studentData.medical_observations,
          studentData.blood_type,
          studentData.pediatrician_name,
          studentData.pediatrician_phone,
          studentData.photo_authorization,
          studentData.trip_authorization,
          studentData.medical_attention_authorization,
          studentData.has_siblings_in_school,
          studentData.special_needs,
          studentData.vaccination_status,
          studentData.observations,
          studentData.gender,
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
      // First delete related records
      await conn.query('DELETE FROM student_guardian WHERE student_id = ?', [id]);
      await conn.query('DELETE FROM student_documents WHERE student_id = ?', [id]);
      await conn.query('DELETE FROM student_status_history WHERE student_id = ?', [id]);
      await conn.query('DELETE FROM pending_documentation WHERE student_id = ?', [id]);
      await conn.query('DELETE FROM attendance WHERE student_id = ?', [id]);
      await conn.query('DELETE FROM vaccination_records WHERE student_id = ?', [id]);
      await conn.query('DELETE FROM parent_portal_submissions WHERE student_id = ?', [id]);

      // Then delete the student
      const result = await conn.query('DELETE FROM student WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } finally {
      conn.release();
    }
  }

  static async getVaccinationStatus(studentId) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `SELECT s.vaccination_status as overall_status,
         COUNT(CASE WHEN vr.status = 'faltante' THEN 1 END) as missing_vaccines,
         COUNT(CASE WHEN vr.status = 'activo' THEN 1 END) as active_vaccines,
         COUNT(CASE WHEN vr.status = 'completo' THEN 1 END) as complete_vaccines,
         COUNT(vr.id) as total_vaccines
         FROM student s
         LEFT JOIN vaccination_records vr ON s.id = vr.student_id
         WHERE s.id = ?
         GROUP BY s.id, s.vaccination_status`,
        [studentId]
      );
      return result[0] || null;
    } finally {
      conn.release();
    }
  }

  static async getPendingDocuments(studentId) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `SELECT pd.*, 
         CONCAT(stf.first_name, ' ', stf.paternal_surname) as completed_by_name
         FROM pending_documentation pd
         LEFT JOIN staff stf ON pd.completed_by = stf.id
         WHERE pd.student_id = ? AND pd.completed_at IS NULL`,
        [studentId]
      );
      return result;
    } finally {
      conn.release();
    }
  }
}

module.exports = Student;
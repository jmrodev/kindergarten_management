// repositories/StudentRepository.js
const { getConnection } = require('../db');

class StudentRepository {
  static async getAll(options = {}) {
    const conn = await getConnection();
    try {
      const { filters = {}, pagination = {} } = options;
      let query = `
        SELECT s.*, 
               a.street, a.number, a.city, a.provincia,
               ec.full_name as emergency_contact_name, ec.phone as emergency_contact_phone,
               c.name as classroom_name
        FROM student s
        LEFT JOIN address a ON s.address_id = a.id
        LEFT JOIN emergency_contact ec ON s.emergency_contact_id = ec.id
        LEFT JOIN classroom c ON s.classroom_id = c.id
        WHERE 1=1
      `;
      const params = [];

      // Apply filters
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

      // Apply pagination
      if (pagination.limit && pagination.offset !== undefined) {
        query += ' LIMIT ? OFFSET ?';
        params.push(pagination.limit, pagination.offset);
      } else if (pagination.limit) {
        query += ' LIMIT ?';
        params.push(pagination.limit);
      }

      query += ' ORDER BY s.paternal_surname, s.first_name';

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
        `SELECT s.*, 
         a.street, a.number, a.city, a.provincia,
         ec.full_name as emergency_contact_name, ec.relationship as emergency_contact_relationship,
         ec.phone as emergency_contact_phone, ec.alternative_phone as emergency_contact_alt_phone,
         ec.is_authorized_pickup as emergency_contact_authorized_pickup,
         c.name as classroom_name
         FROM student s
         LEFT JOIN address a ON s.address_id = a.id
         LEFT JOIN emergency_contact ec ON s.emergency_contact_id = ec.id
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
      // First create the emergency contact if provided
      let emergencyContactId = null;
      if (studentData.emergency_contact) {
        const ecResult = await conn.query(
          `INSERT INTO emergency_contact (student_id, full_name, relationship, 
           priority, phone, alternative_phone, is_authorized_pickup) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            null, // student_id will be set after student creation
            studentData.emergency_contact.full_name,
            studentData.emergency_contact.relationship,
            studentData.emergency_contact.priority || 1,
            studentData.emergency_contact.phone,
            studentData.emergency_contact.alternative_phone,
            studentData.emergency_contact.is_authorized_pickup || false
          ]
        );
        
        emergencyContactId = ecResult.insertId;
      }

      // Then create the student
      const result = await conn.query(
        `INSERT INTO student (first_name, middle_name_optional, third_name_optional, 
         paternal_surname, maternal_surname, nickname_optional, dni, birth_date, 
         address_id, emergency_contact_id, classroom_id, shift, status, 
         enrollment_date, withdrawal_date, health_insurance, affiliate_number, 
         allergies, medications, medical_observations, blood_type, 
         pediatrician_name, pediatrician_phone, photo_authorization, 
         trip_authorization, medical_attention_authorization, 
         has_siblings_in_school, special_needs, vaccination_status, observations) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
          emergencyContactId,
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
          studentData.observations
        ]
      );
      
      const studentId = result.insertId;
      
      // Update emergency contact with the student ID if created
      if (emergencyContactId) {
        await conn.query(
          `UPDATE emergency_contact SET student_id = ? WHERE id = ?`,
          [studentId, emergencyContactId]
        );
      }
      
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
         special_needs = ?, vaccination_status = ?, observations = ? 
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
          id
        ]
      );

      // If emergency contact info was provided, update it too
      if (studentData.emergency_contact && studentData.emergency_contact_id) {
        await conn.query(
          `UPDATE emergency_contact SET full_name = ?, relationship = ?, 
           priority = ?, phone = ?, alternative_phone = ?, 
           is_authorized_pickup = ? WHERE id = ?`,
          [
            studentData.emergency_contact.full_name,
            studentData.emergency_contact.relationship,
            studentData.emergency_contact.priority || 1,
            studentData.emergency_contact.phone,
            studentData.emergency_contact.alternative_phone,
            studentData.emergency_contact.is_authorized_pickup || false,
            studentData.emergency_contact_id
          ]
        );
      }

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
      await conn.query('DELETE FROM emergency_contact WHERE student_id = ?', [id]);

      // Then delete the student
      const result = await conn.query('DELETE FROM student WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } finally {
      conn.release();
    }
  }

  static async count(filters = {}) {
    const conn = await getConnection();
    try {
      let query = `
        SELECT COUNT(*) as count
        FROM student s
        LEFT JOIN classroom c ON s.classroom_id = c.id
        WHERE 1=1
      `;
      const params = [];

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

      const result = await conn.query(query, params);
      return result[0].count;
    } finally {
      conn.release();
    }
  }
}

module.exports = StudentRepository;
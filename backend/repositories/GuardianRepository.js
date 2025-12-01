// repositories/GuardianRepository.js
const { getConnection } = require('../db');

class GuardianRepository {
  static async getAll(options = {}) {
    const conn = await getConnection();
    try {
      const { filters = {}, pagination = {} } = options;
      let query = `
        SELECT g.*, 
               a.street, a.number, a.city, a.provincia,
               pp.name as portal_user_name,
               r.role_name
        FROM guardian g
        LEFT JOIN address a ON g.address_id = a.id
        LEFT JOIN parent_portal_users pp ON g.parent_portal_user_id = pp.id
        LEFT JOIN role r ON g.role_id = r.id
        WHERE 1=1
      `;
      const params = [];

      // Apply filters
      if (filters.roleId) {
        query += ' AND g.role_id = ?';
        params.push(filters.roleId);
      }

      // Apply pagination
      if (pagination.limit && pagination.offset !== undefined) {
        query += ' LIMIT ? OFFSET ?';
        params.push(pagination.limit, pagination.offset);
      } else if (pagination.limit) {
        query += ' LIMIT ?';
        params.push(pagination.limit);
      }

      query += ' ORDER BY g.paternal_surname, g.first_name';

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
        `SELECT g.*, 
         a.street, a.number, a.city, a.provincia,
         pp.name as portal_user_name,
         r.role_name
         FROM guardian g
         LEFT JOIN address a ON g.address_id = a.id
         LEFT JOIN parent_portal_users pp ON g.parent_portal_user_id = pp.id
         LEFT JOIN role r ON g.role_id = r.id
         WHERE g.id = ?`,
        [id]
      );
      return result[0];
    } finally {
      conn.release();
    }
  }

  static async create(guardianData) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `INSERT INTO guardian (first_name, middle_name_optional, paternal_surname, 
         maternal_surname, preferred_surname, dni, address_id, phone, 
         email_optional, workplace, work_phone, authorized_pickup, 
         authorized_change, parent_portal_user_id, role_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          guardianData.first_name,
          guardianData.middle_name_optional,
          guardianData.paternal_surname,
          guardianData.maternal_surname,
          guardianData.preferred_surname,
          guardianData.dni,
          guardianData.address_id,
          guardianData.phone,
          guardianData.email_optional,
          guardianData.workplace,
          guardianData.work_phone,
          guardianData.authorized_pickup || false,
          guardianData.authorized_change || false,
          guardianData.parent_portal_user_id,
          guardianData.role_id
        ]
      );
      return result.insertId;
    } finally {
      conn.release();
    }
  }

  static async update(id, guardianData) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `UPDATE guardian SET first_name = ?, middle_name_optional = ?, 
         paternal_surname = ?, maternal_surname = ?, preferred_surname = ?, 
         dni = ?, address_id = ?, phone = ?, email_optional = ?, workplace = ?, 
         work_phone = ?, authorized_pickup = ?, authorized_change = ?, 
         parent_portal_user_id = ?, role_id = ? WHERE id = ?`,
        [
          guardianData.first_name,
          guardianData.middle_name_optional,
          guardianData.paternal_surname,
          guardianData.maternal_surname,
          guardianData.preferred_surname,
          guardianData.dni,
          guardianData.address_id,
          guardianData.phone,
          guardianData.email_optional,
          guardianData.workplace,
          guardianData.work_phone,
          guardianData.authorized_pickup,
          guardianData.authorized_change,
          guardianData.parent_portal_user_id,
          guardianData.role_id,
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
      // First remove from student_guardian relationships
      await conn.query('DELETE FROM student_guardian WHERE guardian_id = ?', [id]);
      
      // Then delete the guardian
      const result = await conn.query('DELETE FROM guardian WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } finally {
      conn.release();
    }
  }

  static async getByStudentId(studentId) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `SELECT g.*, 
         a.street, a.number, a.city, a.provincia,
         sg.relationship_type, sg.is_primary, sg.authorized_pickup, sg.authorized_diaper_change,
         sg.custody_rights, sg.financial_responsible,
         CONCAT(pp.first_name, ' ', pp.paternal_surname) as portal_user_name
         FROM guardian g
         LEFT JOIN address a ON g.address_id = a.id
         LEFT JOIN student_guardian sg ON g.id = sg.guardian_id
         LEFT JOIN parent_portal_users pp ON g.parent_portal_user_id = pp.id
         WHERE sg.student_id = ?
         ORDER BY sg.is_primary DESC, g.paternal_surname, g.first_name`,
        [studentId]
      );
      return result;
    } finally {
      conn.release();
    }
  }

  static async count(filters = {}) {
    const conn = await getConnection();
    try {
      let query = `
        SELECT COUNT(*) as count
        FROM guardian g
        LEFT JOIN role r ON g.role_id = r.id
        WHERE 1=1
      `;
      const params = [];

      if (filters.roleId) {
        query += ' AND g.role_id = ?';
        params.push(filters.roleId);
      }

      const result = await conn.query(query, params);
      return result[0].count;
    } finally {
      conn.release();
    }
  }
}

module.exports = GuardianRepository;
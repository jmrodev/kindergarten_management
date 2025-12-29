// repositories/StaffRepository.js
const { getConnection } = require('../db');

class StaffRepository {
  static async getAll(options = {}) {
    const conn = await getConnection();
    try {
      const { filters = {}, pagination = {} } = options;
      let query = `
        SELECT s.*, 
               a.street, a.number, a.city, a.provincia,
               GROUP_CONCAT(c.name SEPARATOR ', ') as classroom_name,
               r.role_name,
               al.access_name
        FROM staff s
        LEFT JOIN address a ON s.address_id = a.id
        LEFT JOIN classroom c ON c.teacher_id = s.id
        LEFT JOIN role r ON s.role_id = r.id
        LEFT JOIN access_level al ON r.access_level_id = al.id
        WHERE 1=1
      `;
      const params = [];

      // Apply filters
      if (filters.isActive !== undefined) {
        query += ' AND s.is_active = ?';
        params.push(filters.isActive);
      }

      if (filters.roleId) {
        query += ' AND s.role_id = ?';
        params.push(filters.roleId);
      }

      if (filters.classroomId) {
        // If sorting via c.teacher_id = s.id, then filtering by s.classroom_id column might be weird if that column is unused.
        // Assuming we filter by "Assigned Classroom", we should check c.id.
        query += ' AND c.id = ?'; // Updated to check joined table
        params.push(filters.classroomId);
      }

      // Apply sorting
      query += ' GROUP BY s.id ORDER BY s.paternal_surname, s.first_name';

      // Apply pagination
      if (pagination.limit && pagination.offset !== undefined) {
        query += ' LIMIT ? OFFSET ?';
        params.push(pagination.limit, pagination.offset);
      } else if (pagination.limit) {
        query += ' LIMIT ?';
        params.push(pagination.limit);
      }

      const results = await conn.query(query, params);
      return results.map(row => this._handleBigInt(row));
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
         c.name as classroom_name,
         r.role_name,
         al.access_name
         FROM staff s
         LEFT JOIN address a ON s.address_id = a.id
         LEFT JOIN classroom c ON c.teacher_id = s.id
         LEFT JOIN role r ON s.role_id = r.id
         LEFT JOIN access_level al ON r.access_level_id = al.id
         WHERE s.id = ?`,
        [id]
      );
      return this._handleBigInt(result[0]);
    } finally {
      conn.release();
    }
  }

  // ... create/update methods unchanged ...

  // skipping create/update/delete in replace block if possible to minimize diff context issues, but `getByEmail` is far down.

  static async getByEmail(email) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `SELECT s.*, 
         a.street, a.number, a.city, a.provincia,
         c.name as classroom_name,
         r.role_name,
         al.access_name
         FROM staff s
         LEFT JOIN address a ON s.address_id = a.id
         LEFT JOIN classroom c ON c.teacher_id = s.id
         LEFT JOIN role r ON s.role_id = r.id
         LEFT JOIN access_level al ON r.access_level_id = al.id
         WHERE s.email = ?`,
        [email]
      );
      return this._handleBigInt(result[0]);
    } finally {
      conn.release();
    }
  }

  static async create(staffData) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `INSERT INTO staff (first_name, middle_name_optional, third_name_optional, 
         paternal_surname, maternal_surname, dni, email, password_hash, is_active, 
         last_login, created_at, preferred_surname, address_id, phone, 
         email_optional, classroom_id, role_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          staffData.first_name,
          staffData.middle_name_optional || null,
          staffData.third_name_optional || null,
          staffData.paternal_surname,
          staffData.maternal_surname || null,
          staffData.dni,
          staffData.email,
          staffData.password_hash,
          staffData.is_active !== undefined ? staffData.is_active : true,
          staffData.last_login || null,
          staffData.created_at || new Date(),
          staffData.preferred_surname || null,
          staffData.address_id || null,
          staffData.phone || null,
          staffData.email_optional || null,
          staffData.classroom_id || null,
          staffData.role_id
        ]
      );
      return result.insertId;
    } finally {
      conn.release();
    }
  }

  static async update(id, staffData) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `UPDATE staff SET first_name = ?, middle_name_optional = ?, 
         third_name_optional = ?, paternal_surname = ?, maternal_surname = ?, 
         dni = ?, email = ?, password_hash = ?, is_active = ?, last_login = ?, 
         preferred_surname = ?, address_id = ?, phone = ?, email_optional = ?, 
         classroom_id = ?, role_id = ? WHERE id = ?`,
        [
          staffData.first_name,
          staffData.middle_name_optional || null,
          staffData.third_name_optional || null,
          staffData.paternal_surname,
          staffData.maternal_surname || null,
          staffData.dni,
          staffData.email,
          staffData.password_hash,
          staffData.is_active,
          staffData.last_login || null,
          staffData.preferred_surname || null,
          staffData.address_id || null,
          staffData.phone || null,
          staffData.email_optional || null,
          staffData.classroom_id || null,
          staffData.role_id,
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
      const result = await conn.query('DELETE FROM staff WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } finally {
      conn.release();
    }
  }

  static async updatePassword(id, newPasswordHash) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        'UPDATE staff SET password_hash = ? WHERE id = ?',
        [newPasswordHash, id]
      );
      return result.affectedRows > 0;
    } finally {
      conn.release();
    }
  }

  static async updateLastLogin(id) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        'UPDATE staff SET last_login = ? WHERE id = ?',
        [new Date(), id]
      );
      return result.affectedRows > 0;
    } finally {
      conn.release();
    }
  }

  static async getByEmail(email) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `SELECT s.*, 
         a.street, a.number, a.city, a.provincia,
         c.name as classroom_name,
         r.role_name,
         al.access_name
         FROM staff s
         LEFT JOIN address a ON s.address_id = a.id
         LEFT JOIN classroom c ON c.teacher_id = s.id
         LEFT JOIN role r ON s.role_id = r.id
         LEFT JOIN access_level al ON r.access_level_id = al.id
         WHERE s.email = ?`,
        [email]
      );
      return result[0];
    } finally {
      conn.release();
    }
  }

  static async count(filters = {}) {
    const conn = await getConnection();
    try {
      let query = `
        SELECT CAST(COUNT(DISTINCT s.id) AS SIGNED) as count
        FROM staff s
        LEFT JOIN classroom c ON c.teacher_id = s.id
        LEFT JOIN role r ON s.role_id = r.id
        WHERE 1=1
      `;
      const params = [];

      if (filters.isActive !== undefined) {
        query += ' AND s.is_active = ?';
        params.push(filters.isActive);
      }

      if (filters.roleId) {
        query += ' AND s.role_id = ?';
        params.push(filters.roleId);
      }

      if (filters.classroomId) {
        query += ' AND c.id = ?';
        params.push(filters.classroomId);
      }

      const result = await conn.query(query, params);
      return result[0].count;
    } finally {
      conn.release();
    }
  }

  static async getRoles() {
    const conn = await getConnection();
    try {
      const result = await conn.query('SELECT id, role_name FROM role ORDER BY role_name');
      return result;
    } finally {
      conn.release();
    }
  }
  static _handleBigInt(obj) {
    if (!obj) return obj;
    for (const key in obj) {
      if (typeof obj[key] === 'bigint') {
        obj[key] = Number(obj[key]);
      }
    }
    return obj;
  }
}

module.exports = StaffRepository;
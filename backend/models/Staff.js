// models/Staff.js (updated)
const { getConnection } = require('../db');

class Staff {
  static async getAll(filters = {}) {
    const conn = await getConnection();
    try {
      let query = `SELECT s.*,
                   a.street, a.number, a.city, a.provincia,
                   c.name as classroom_name,
                   r.role_name,
                   al.access_name
                   FROM staff s
                   LEFT JOIN address a ON s.address_id = a.id
                   LEFT JOIN classroom c ON s.classroom_id = c.id
                   LEFT JOIN role r ON s.role_id = r.id
                   LEFT JOIN access_level al ON r.access_level_id = al.id
                   WHERE 1=1`;
      const params = [];

      // Apply filters if provided
      if (filters.isActive !== undefined) {
        query += ' AND s.is_active = ?';
        params.push(filters.isActive);
      }

      if (filters.roleId) {
        query += ' AND s.role_id = ?';
        params.push(filters.roleId);
      }

      if (filters.classroomId) {
        query += ' AND s.classroom_id = ?';
        params.push(filters.classroomId);
      }

      query += ' ORDER BY s.paternal_surname, s.first_name';

      const result = await conn.query(query, params);

      // Convertir BigInts a números normales para evitar problemas de serialización
      for (const user of result) {
        for (const key in user) {
          if (typeof user[key] === 'bigint') {
            user[key] = Number(user[key]);
          }
        }
      }
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
         c.name as classroom_name,
         r.role_name,
         al.access_name
         FROM staff s
         LEFT JOIN address a ON s.address_id = a.id
         LEFT JOIN classroom c ON s.classroom_id = c.id
         LEFT JOIN role r ON s.role_id = r.id
         LEFT JOIN access_level al ON r.access_level_id = al.id
         WHERE s.id = ?`,
        [id]
      );

      // Convertir BigInts a números normales para evitar problemas de serialización
      const user = result[0];
      if (user) {
        // Convertir campos BigInt a números de manera más eficiente
        for (const key in user) {
          if (typeof user[key] === 'bigint') {
            user[key] = Number(user[key]);
          }
        }
      }
      return user;
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
         LEFT JOIN classroom c ON s.classroom_id = c.id
         LEFT JOIN role r ON s.role_id = r.id
         LEFT JOIN access_level al ON r.access_level_id = al.id
         WHERE s.email = ?`,
        [email]
      );

      // Convertir BigInts a números normales para evitar problemas de serialización
      const user = result[0];
      if (user) {
        // Convertir campos BigInt a números de manera más eficiente
        for (const key in user) {
          if (typeof user[key] === 'bigint') {
            user[key] = Number(user[key]);
          }
        }
      }
      return user;
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
          staffData.middle_name_optional,
          staffData.third_name_optional,
          staffData.paternal_surname,
          staffData.maternal_surname,
          staffData.dni,
          staffData.email,
          staffData.password_hash,
          staffData.is_active !== undefined ? staffData.is_active : true,
          staffData.last_login || null,
          staffData.created_at || new Date(),
          staffData.preferred_surname,
          staffData.address_id,
          staffData.phone,
          staffData.email_optional,
          staffData.classroom_id,
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
          staffData.middle_name_optional,
          staffData.third_name_optional,
          staffData.paternal_surname,
          staffData.maternal_surname,
          staffData.dni,
          staffData.email,
          staffData.password_hash,
          staffData.is_active,
          staffData.last_login,
          staffData.preferred_surname,
          staffData.address_id,
          staffData.phone,
          staffData.email_optional,
          staffData.classroom_id,
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
}

module.exports = Staff;
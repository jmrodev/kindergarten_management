// models/Address.js
const { getConnection } = require('../db');

class Address {
  static async getAll() {
    const conn = await getConnection();
    try {
      const result = await conn.query('SELECT * FROM address ORDER BY city, street');
      return result;
    } finally {
      conn.release();
    }
  }

  static async getById(id) {
    const conn = await getConnection();
    try {
      const result = await conn.query('SELECT * FROM address WHERE id = ?', [id]);
      return result[0];
    } finally {
      conn.release();
    }
  }

  static async create(addressData) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `INSERT INTO address (street, number, city, provincia, postal_code_optional) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          addressData.street,
          addressData.number,
          addressData.city,
          addressData.provincia,
          addressData.postal_code_optional
        ]
      );
      return result.insertId;
    } finally {
      conn.release();
    }
  }

  static async update(id, addressData) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `UPDATE address SET street = ?, number = ?, city = ?, 
         provincia = ?, postal_code_optional = ? WHERE id = ?`,
        [
          addressData.street,
          addressData.number,
          addressData.city,
          addressData.provincia,
          addressData.postal_code_optional,
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
      const result = await conn.query('DELETE FROM address WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } finally {
      conn.release();
    }
  }
}

module.exports = Address;
// models/Classroom.js
const { getConnection } = require('../db');

class Classroom {
  constructor(id, name, capacity, shift) {
    this.id = id;
    this.name = name;
    this.capacity = capacity;
    this.shift = shift;
  }

  isValid() {
    // Validar campos requeridos
    if (!this.name || !this.capacity) {
      return false;
    }

    // Validar que la capacidad sea un número positivo
    if (typeof this.capacity === 'number' && this.capacity <= 0) {
      return false;
    }

    // Validar que la capacidad sea un número si es string
    if (typeof this.capacity === 'string') {
      const capacityNum = parseInt(this.capacity);
      if (isNaN(capacityNum) || capacityNum <= 0) {
        return false;
      }
    }

    // Validar turno
    const validShifts = ['Mañana', 'Tarde', 'Completo'];
    if (this.shift && !validShifts.includes(this.shift)) {
      return false;
    }

    return true;
  }

  static fromDbRow(row) {
    return new Classroom(
      row.id,
      row.name,
      row.capacity,
      row.shift
    );
  }

  toDbRow() {
    return {
      id: this.id,
      name: this.name,
      capacity: this.capacity,
      shift: this.shift
    };
  }

  static async getAll(filters = {}) {
    const conn = await getConnection();
    try {
      let query = 'SELECT * FROM classroom WHERE 1=1';
      const params = [];

      // Apply filters if provided
      if (filters.isActive !== undefined) {
        query += ' AND is_active = ?';
        params.push(filters.isActive);
      }

      query += ' ORDER BY name';

      const result = await conn.query(query, params);
      return result;
    } finally {
      conn.release();
    }
  }

  static async getById(id) {
    const conn = await getConnection();
    try {
      const result = await conn.query('SELECT * FROM classroom WHERE id = ?', [id]);
      return result[0];
    } finally {
      conn.release();
    }
  }

  static async create(classroomData) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `INSERT INTO classroom (name, capacity, shift, academic_year,
         age_group, is_active)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          classroomData.name,
          classroomData.capacity,
          classroomData.shift,
          classroomData.academic_year || new Date().getFullYear(),
          classroomData.age_group || null,
          classroomData.is_active !== undefined ? classroomData.is_active : true
        ]
      );
      return result.insertId;
    } finally {
      conn.release();
    }
  }

  static async update(id, classroomData) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `UPDATE classroom SET name = ?, capacity = ?, shift = ?,
         academic_year = ?, age_group = ?, is_active = ? WHERE id = ?`,
        [
          classroomData.name,
          classroomData.capacity,
          classroomData.shift,
          classroomData.academic_year,
          classroomData.age_group,
          classroomData.is_active,
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
      const result = await conn.query('DELETE FROM classroom WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } finally {
      conn.release();
    }
  }
}

module.exports = Classroom;
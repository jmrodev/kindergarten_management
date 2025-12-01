// repositories/MeetingMinutesRepository.js
const { getConnection } = require('../db');

class MeetingMinutesRepository {
  static async getAll(options = {}) {
    const conn = await getConnection();
    try {
      const { filters = {}, pagination = {} } = options;
      let query = 'SELECT * FROM meeting_minutes WHERE 1=1';
      const params = [];

      // Apply filters
      if (filters.meetingType) {
        query += ' AND meeting_type = ?';
        params.push(filters.meetingType);
      }
      
      if (filters.startDate) {
        query += ' AND meeting_date >= ?';
        params.push(filters.startDate);
      }
      
      if (filters.endDate) {
        query += ' AND meeting_date <= ?';
        params.push(filters.endDate);
      }

      // Apply pagination
      if (pagination.limit && pagination.offset !== undefined) {
        query += ' LIMIT ? OFFSET ?';
        params.push(pagination.limit, pagination.offset);
      } else if (pagination.limit) {
        query += ' LIMIT ?';
        params.push(pagination.limit);
      }

      query += ' ORDER BY meeting_date DESC, meeting_time DESC';

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
        `SELECT * FROM meeting_minutes WHERE id = ?`,
        [id]
      );
      return result[0];
    } finally {
      conn.release();
    }
  }

  static async create(meetingData) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `INSERT INTO meeting_minutes (meeting_type, meeting_date, meeting_time, 
         participants, purpose, conclusions, responsible_staff_id, created_by) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          meetingData.meeting_type,
          meetingData.meeting_date,
          meetingData.meeting_time,
          meetingData.participants,
          meetingData.purpose,
          meetingData.conclusions,
          meetingData.responsible_staff_id,
          meetingData.created_by
        ]
      );
      return result.insertId;
    } finally {
      conn.release();
    }
  }

  static async update(id, meetingData) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        `UPDATE meeting_minutes SET meeting_type = ?, meeting_date = ?, 
         meeting_time = ?, participants = ?, purpose = ?, conclusions = ?, 
         responsible_staff_id = ?, updated_by = ?, updated_at = NOW() 
         WHERE id = ?`,
        [
          meetingData.meeting_type,
          meetingData.meeting_date,
          meetingData.meeting_time,
          meetingData.participants,
          meetingData.purpose,
          meetingData.conclusions,
          meetingData.responsible_staff_id,
          meetingData.updated_by,
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
      const result = await conn.query('DELETE FROM meeting_minutes WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } finally {
      conn.release();
    }
  }

  static async count(filters = {}) {
    const conn = await getConnection();
    try {
      let query = 'SELECT COUNT(*) as count FROM meeting_minutes WHERE 1=1';
      const params = [];

      if (filters.meetingType) {
        query += ' AND meeting_type = ?';
        params.push(filters.meetingType);
      }
      
      if (filters.startDate) {
        query += ' AND meeting_date >= ?';
        params.push(filters.startDate);
      }
      
      if (filters.endDate) {
        query += ' AND meeting_date <= ?';
        params.push(filters.endDate);
      }

      const result = await conn.query(query, params);
      return result[0].count;
    } finally {
      conn.release();
    }
  }
}

module.exports = MeetingMinutesRepository;
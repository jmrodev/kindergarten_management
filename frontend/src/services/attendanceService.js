/* global URLSearchParams */
import api from '../utils/api';

const attendanceService = {
  /**
   * Get all attendance records with optional filters
   * @param {Object} filters - Filters (studentId, staffId, classroomId, date, startDate, endDate)
   * @returns {Promise<Array>} Array of attendance records
   */
  async getAll(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    const queryString = params.toString();
    return api.get(`/api/attendance${queryString ? '?' + queryString : ''}`);
  },

  /**
   * Get attendance record by ID
   * @param {number} id - Attendance ID
   * @returns {Promise<Object>} Attendance record
   */
  async getById(id) {
    return api.get(`/api/attendance/${id}`);
  },

  /**
   * Get daily attendance for a specific date
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise<Array>} Array of attendance records for that date
   */
  async getDailyAttendance(date) {
    return api.get(`/api/attendance/daily/${date}`);
  },

  /**
   * Get attendance for a specific student and date
   * @param {number} studentId - Student ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise<Object>} Attendance record
   */
  async getByStudentAndDate(studentId, date) {
    return api.get(`/api/attendance/student/${studentId}/date/${date}`);
  },

  /**
   * Create a new attendance record
   * @param {Object} data - Attendance data (studentId, date, status, notes, etc.)
   * @returns {Promise<Object>} Created attendance record
   */
  async create(data) {
    return api.post('/api/attendance', data);
  },

  /**
   * Update an existing attendance record
   * @param {number} id - Attendance ID
   * @param {Object} data - Updated attendance data
   * @returns {Promise<Object>} Updated attendance record
   */
  async update(id, data) {
    return api.put(`/api/attendance/${id}`, data);
  },

  /**
   * Delete an attendance record
   * @param {number} id - Attendance ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  async delete(id) {
    return api.del(`/api/attendance/${id}`);
  },

  /**
   * Get staff attendance records
   * @returns {Promise<Array>} Array of staff attendance records
   */
  async getStaffAttendance() {
    return api.get('/api/attendance/staff');
  }
};

export default attendanceService;

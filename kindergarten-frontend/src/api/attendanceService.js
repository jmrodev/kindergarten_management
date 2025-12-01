// api/attendanceService.js
import api from './api';

const attendanceService = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return api.get(`/attendance?${params}`);
  },

  getById: (id) => {
    return api.get(`/attendance/${id}`);
  },

  create: (attendanceData) => {
    return api.post('/attendance', attendanceData);
  },

  update: (id, attendanceData) => {
    return api.put(`/attendance/${id}`, attendanceData);
  },

  delete: (id) => {
    return api.delete(`/attendance/${id}`);
  },

  getByStudentAndDate: (studentId, date) => {
    return api.get(`/attendance/student/${studentId}/date/${date}`);
  },

  getDailyAttendance: (date) => {
    return api.get(`/attendance/daily/${date}`);
  },

  getStaffAttendance: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return api.get(`/attendance/staff?${params}`);
  }
};

export default attendanceService;
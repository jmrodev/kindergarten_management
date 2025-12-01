// api/calendarService.js
import api from './api';

const calendarService = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return api.get(`/calendar?${params}`);
  },

  getById: (id) => {
    return api.get(`/calendar/${id}`);
  },

  create: (calendarData) => {
    return api.post('/calendar', calendarData);
  },

  update: (id, calendarData) => {
    return api.put(`/calendar/${id}`, calendarData);
  },

  delete: (id) => {
    return api.delete(`/calendar/${id}`);
  },

  getByMonth: (year, month) => {
    return api.get(`/calendar/month/${year}/${month}`);
  },

  getByClassroom: (classroomId, filters = {}) => {
    const params = new URLSearchParams(filters);
    return api.get(`/calendar/classroom/${classroomId}?${params}`);
  },

  getSpecialEvents: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return api.get(`/calendar/special?${params}`);
  }
};

export default calendarService;
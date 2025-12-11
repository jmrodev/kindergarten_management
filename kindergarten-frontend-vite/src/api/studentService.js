// api/studentService.js
import api from './api';

export const studentService = {
  getAll: () => {
    return api.get('/students');
  },

  getById: (id) => {
    return api.get(`/students/${id}`);
  },

  create: (data) => {
    return api.post('/students', data);
  },

  update: (id, data) => {
    return api.put(`/students/${id}`, data);
  },

  delete: (id) => {
    return api.delete(`/students/${id}`);
  },

  getByStatus: (status) => {
    return api.get(`/students?status=${status}`);
  },

  getByClassroom: (classroomId) => {
    return api.get(`/students?classroom_id=${classroomId}`);
  }
};
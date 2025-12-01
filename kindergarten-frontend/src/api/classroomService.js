// api/classroomService.js
import api from './api';

const classroomService = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return api.get(`/classrooms?${params}`);
  },

  getById: (id) => {
    return api.get(`/classrooms/${id}`);
  },

  create: (classroomData) => {
    return api.post('/classrooms', classroomData);
  },

  update: (id, classroomData) => {
    return api.put(`/classrooms/${id}`, classroomData);
  },

  delete: (id) => {
    return api.delete(`/classrooms/${id}`);
  }
};

export default classroomService;
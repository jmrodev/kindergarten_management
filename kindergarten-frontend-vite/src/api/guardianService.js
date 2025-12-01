// api/guardianService.js
import api from './api';

const guardianService = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return api.get(`/guardians?${params}`);
  },

  getById: (id) => {
    return api.get(`/guardians/${id}`);
  },

  create: (guardianData) => {
    return api.post('/guardians', guardianData);
  },

  update: (id, guardianData) => {
    return api.put(`/guardians/${id}`, guardianData);
  },

  delete: (id) => {
    return api.delete(`/guardians/${id}`);
  },

  getByStudentId: (studentId) => {
    return api.get(`/guardians/student/${studentId}`);
  }
};

export default guardianService;
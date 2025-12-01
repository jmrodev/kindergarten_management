// api/studentService.js
import api from './api';

const studentService = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return api.get(`/students?${params}`);
  },

  getById: (id) => {
    return api.get(`/students/${id}`);
  },

  create: (studentData) => {
    return api.post('/students', studentData);
  },

  update: (id, studentData) => {
    return api.put(`/students/${id}`, studentData);
  },

  delete: (id) => {
    return api.delete(`/students/${id}`);
  },

  getVaccinationStatus: (studentId) => {
    return api.get(`/students/${studentId}/vaccination-status`);
  },

  getPendingDocuments: (studentId) => {
    return api.get(`/students/${studentId}/pending-documents`);
  }
};

export default studentService;
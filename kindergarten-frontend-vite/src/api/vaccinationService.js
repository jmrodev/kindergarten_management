// api/vaccinationService.js
import api from './api';

const vaccinationService = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return api.get(`/vaccination-records?${params}`);
  },

  getById: (id) => {
    return api.get(`/vaccination-records/${id}`);
  },

  getByStudentId: (studentId) => {
    return api.get(`/vaccination-records/student/${studentId}`);
  },

  create: (vaccinationData) => {
    return api.post('/vaccination-records', vaccinationData);
  },

  update: (id, vaccinationData) => {
    return api.put(`/vaccination-records/${id}`, vaccinationData);
  },

  delete: (id) => {
    return api.delete(`/vaccination-records/${id}`);
  },

  getSummary: () => {
    return api.get('/vaccination-records/summary');
  }
};

export default vaccinationService;
// api/staffService.js
import api from './api';

const staffService = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return api.get(`/staff?${params}`);
  },

  getById: (id) => {
    return api.get(`/staff/${id}`);
  },

  create: (staffData) => {
    return api.post('/staff', staffData);
  },

  update: (id, staffData) => {
    return api.put(`/staff/${id}`, staffData);
  },

  delete: (id) => {
    return api.delete(`/staff/${id}`);
  },

  getRoles: () => {
    return api.get(`/staff/roles`);
  }
};

export default staffService;
// api/activityService.js
import api from './api';

const activityService = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return api.get(`/activities?${params}`);
  },

  getById: (id) => {
    return api.get(`/activities/${id}`);
  },

  create: (activityData) => {
    return api.post('/activities', activityData);
  },

  update: (id, activityData) => {
    return api.put(`/activities/${id}`, activityData);
  },

  delete: (id) => {
    return api.delete(`/activities/${id}`);
  },

  getByClassroom: (classroomId) => {
    return api.get(`/activities/classroom/${classroomId}`);
  },

  getByTeacher: (teacherId) => {
    return api.get(`/activities/teacher/${teacherId}`);
  },

  getSpecialActivities: () => {
    return api.get('/activities/special');
  }
};

export default activityService;
// api/meetingMinutesService.js
import api from './api';

const meetingMinutesService = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return api.get(`/meeting-minutes?${params}`);
  },

  getById: (id) => {
    return api.get(`/meeting-minutes/${id}`);
  },

  create: (meetingMinuteData) => {
    return api.post('/meeting-minutes', meetingMinuteData);
  },

  update: (id, meetingMinuteData) => {
    return api.put(`/meeting-minutes/${id}`, meetingMinuteData);
  },

  delete: (id) => {
    return api.delete(`/meeting-minutes/${id}`);
  }
};

export default meetingMinutesService;
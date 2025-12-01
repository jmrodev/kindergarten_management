// api/documentReviewService.js
import api from './api';

const documentReviewService = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return api.get(`/document-reviews?${params}`);
  },

  getById: (id) => {
    return api.get(`/document-reviews/${id}`);
  },

  create: (documentReviewData) => {
    return api.post('/document-reviews', documentReviewData);
  },

  update: (id, documentReviewData) => {
    return api.put(`/document-reviews/${id}`, documentReviewData);
  },

  delete: (id) => {
    return api.delete(`/document-reviews/${id}`);
  },

  getPending: () => {
    return api.get('/document-reviews/pending');
  },

  getByType: (documentType, status = null) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    return api.get(`/document-reviews?type=${documentType}&${params}`);
  }
};

export default documentReviewService;
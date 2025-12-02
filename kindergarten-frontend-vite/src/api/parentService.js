import api from './api';

const parentService = {
  // Get parent info by portal user ID
  getByPortalUserId: async (id) => {
    const response = await api.get(`/parent-portal/portal-user/${id}`);
    return response;
  },

  // Get children associated with a parent
  getChildrenByParent: async (parentId) => {
    const response = await api.get(`/parent-portal/students/${parentId}`);
    return response;
  },

  // Save draft registration
  saveDraft: async (draftData) => {
    const response = await api.post('/parent-portal/draft', draftData);
    return response;
  },

  // Get draft registration
  getDraft: async (userId) => {
    const response = await api.get(`/parent-portal/draft/${userId}`);
    return response;
  },

  // Delete draft registration
  deleteDraft: async (userId) => {
    const response = await api.delete(`/parent-portal/draft/${userId}`);
    return response;
  },

  // Submit registration
  submitRegistration: async (submissionData) => {
    const response = await api.post('/parent-portal/submission', submissionData);
    return response;
  }
};

export default parentService;
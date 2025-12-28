import api from '../utils/api';
import { formatStudentDataForBackend } from '../utils/studentUtils';

const parentPortalService = {
    /**
     * Get draft for the current user
     * @param {string} userId - Current User ID
     * @returns {Promise<Object>} Draft data { data, currentStep, updatedAt }
     */
    async getDraft(userId) {
        return api.get(`/api/parent-portal/draft/${userId}`);
    },

    /**
     * Save draft
     * @param {Object} draftData - { data: Object, currentStep: number }
     * @returns {Promise<Object>} Success message
     */
    async saveDraft(draftData) {
        return api.post('/api/parent-portal/draft', draftData);
    },

    /**
     * Delete draft
     * @param {string} userId - Current User ID
     * @returns {Promise<Object>} Success message
     */
    async deleteDraft(userId) {
        return api.del(`/api/parent-portal/draft/${userId}`);
    },

    /**
     * Submit final registration
     * @param {Object} data - Full registration data
     * @returns {Promise<Object>} Success message and Student ID
     */
    async submitRegistration(data) {
        const payload = formatStudentDataForBackend(data);
        return api.post('/api/parent-portal/submission', payload);
    },

    /**
     * Check if enrollment is open
     * @returns {Promise<Object>} { enrollmentOpen: boolean }
     */
    async getEnrollmentStatus() {
        return api.get('/api/parent-portal/enrollment-status');
    }
};

export default parentPortalService;

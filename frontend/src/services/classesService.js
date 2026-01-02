import api from '../utils/api'

const classesService = {
    /**
     * Get all classrooms
     * @returns {Promise<Array>} Array of classrooms
     */
    async getAll({ page, limit, ...filters } = {}) {
        const params = new URLSearchParams();
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);
        // Add other filters if needed
        Object.keys(filters).forEach(key => {
            if (filters[key] !== undefined) {
                params.append(key, filters[key]);
            }
        });

        const queryString = params.toString();
        return api.get(`/api/classrooms${queryString ? '?' + queryString : ''}`)
    },

    /**
     * Get classroom by ID
     * @param {number} id - Classroom ID
     * @returns {Promise<Object>} Classroom object
     */
    async getById(id) {
        return api.get(`/api/classrooms/${id}`)
    },

    /**
     * Create a new classroom
     * @param {Object} data - Classroom data
     * @returns {Promise<Object>} Created classroom
     */
    async create(data) {
        return api.post('/api/classrooms', data)
    },

    /**
     * Update an existing classroom
     * @param {number} id - Classroom ID
     * @param {Object} data - Updated classroom data
     * @returns {Promise<Object>} Updated classroom
     */
    async update(id, data) {
        return api.put(`/api/classrooms/${id}`, data)
    },

    /**
     * Delete a classroom
     * @param {number} id - Classroom ID
     * @returns {Promise<Object>} Deletion confirmation
     */
    async delete(id) {
        return api.del(`/api/classrooms/${id}`)
    }
}

export default classesService

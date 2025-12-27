import api from '../utils/api'

const usersService = {
  /**
   * Get all staff/users
   * @returns {Promise<Array>} Array of users
   */
  async getAll({ page, limit, ...filters } = {}) {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);

    // Append all other filters
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null) {
        params.append(key, filters[key]);
      }
    });

    const queryString = params.toString();
    return api.get(`/api/staff${queryString ? '?' + queryString : ''}`);
  },

  /**
   * Get user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object>} User object
   */
  async getById(id) {
    return api.get(`/api/staff/${id}`)
  },

  /**
   * Get all available roles
   * @returns {Promise<Array>} Array of roles
   */
  async getRoles() {
    return api.get('/api/staff/roles')
  },

  /**
   * Create a new user
   * @param {Object} data - User data (first_name, last_name, dni, email, role_id)
   * @returns {Promise<Object>} Created user
   */
  async create(data) {
    return api.post('/api/staff', data)
  },

  /**
   * Update an existing user
   * @param {number} id - User ID
   * @param {Object} data - Updated user data
   * @returns {Promise<Object>} Updated user
   */
  async update(id, data) {
    return api.put(`/api/staff/${id}`, data)
  },

  /**
   * Delete a user
   * @param {number} id - User ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  async delete(id) {
    return api.del(`/api/staff/${id}`)
  },

  /**
   * Change user password
   * @param {number} id - User ID
   * @param {Object} passwords - { currentPassword, newPassword }
   * @returns {Promise<Object>} Update confirmation
   */
  async changePassword(id, passwords) {
    return api.put(`/api/staff/${id}/password`, passwords)
  },
}

export default usersService

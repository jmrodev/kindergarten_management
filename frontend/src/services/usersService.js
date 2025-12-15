import api from '../utils/api'

const usersService = {
  /**
   * Get all staff/users
   * @returns {Promise<Array>} Array of users
   */
  async getAll() {
    return api.get('/api/staff')
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

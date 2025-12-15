/* global URLSearchParams */
import api from '../utils/api'

const studentsService = {
  /**
   * Get all students
   * @returns {Promise<Array>} Array of students
   */
  async getAll() {
    return api.get('/api/students')
  },

  /**
   * Get student by ID
   * @param {number} id - Student ID
   * @returns {Promise<Object>} Student object
   */
  async getById(id) {
    return api.get(`/api/students/${id}`)
  },

  /**
   * Search students with filters
   * @param {Object} filters - Search filters (name, dni, classroom, status)
   * @returns {Promise<Array>} Array of matching students
   */
  async search(filters) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    const queryString = params.toString()
    return api.get(
      `/api/students/search${queryString ? '?' + queryString : ''}`
    )
  },

  /**
   * Create a new student
   * @param {Object} data - Student data
   * @returns {Promise<Object>} Created student
   */
  async create(data) {
    return api.post('/api/students', data)
  },

  /**
   * Update an existing student
   * @param {number} id - Student ID
   * @param {Object} data - Updated student data
   * @returns {Promise<Object>} Updated student
   */
  async update(id, data) {
    return api.put(`/api/students/${id}`, data)
  },

  /**
   * Delete a student
   * @param {number} id - Student ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  async delete(id) {
    return api.del(`/api/students/${id}`)
  },

  /**
   * Assign classroom to student
   * @param {number} studentId - Student ID
   * @param {number} classroomId - Classroom ID
   * @returns {Promise<Object>} Update confirmation
   */
  async assignClassroom(studentId, classroomId) {
    return api.patch(`/api/students/${studentId}/assign-classroom`, {
      classroomId,
    })
  },
}

export default studentsService

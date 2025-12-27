/* global URLSearchParams */
import api from '../utils/api'

const studentsService = {
  /**
   * Get all students
   * @returns {Promise<Array>} Array of students
   */
  async getAll({ page, limit, status } = {}) {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (status) params.append('status', status);

    const queryString = params.toString();
    return api.get(`/api/students${queryString ? '?' + queryString : ''}`);
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
   * Helper to flatten nested data (address, emergency_contact) for backend consumption
   */
  _flattenStudentData(data) {
    const flatData = { ...data }

    // Flatten Address
    if (data.address) {
      flatData.street = data.address.street
      flatData.number = data.address.number
      flatData.city = data.address.city
      flatData.provincia = data.address.provincia
      flatData.postal_code_optional = data.address.postal_code_optional
      delete flatData.address
    }



    // Pass guardians array directly if present
    if (data.guardians) {
      flatData.guardians = data.guardians;
    }

    return flatData
  },

  /**
   * Create a new student
   * @param {Object} data - Student data
   * @returns {Promise<Object>} Created student
   */
  async create(data) {
    const payload = this._flattenStudentData(data)
    return api.post('/api/students', payload)
  },

  /**
   * Update an existing student
   * @param {number} id - Student ID
   * @param {Object} data - Updated student data
   * @returns {Promise<Object>} Updated student
   */
  async update(id, data) {
    const payload = this._flattenStudentData(data)
    return api.put(`/api/students/${id}`, payload)
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

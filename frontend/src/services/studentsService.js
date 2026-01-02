/* global URLSearchParams */
import api from '../utils/api'
import { formatStudentDataForBackend } from '../utils/studentUtils';

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
   * Format flat frontend state to structured backend payload
   */
  _formatForBackend(data) {
    // Map flat snake_case state to nested camelCase expected by EnrollmentController
    const student = {
      firstName: data.first_name,
      middleName: data.middle_name_optional,
      thirdName: data.third_name_optional,
      paternalSurname: data.paternal_surname,
      maternalSurname: data.maternal_surname,
      nickname: data.nickname_optional,
      dni: data.dni,
      birthDate: data.birth_date,
      gender: data.gender,
      healthInsurance: data.health_insurance,
      affiliateNumber: data.affiliate_number, // checking if frontend has this field? not in initial state shown but maybe dynamically added
      allergies: data.allergies,
      medications: data.medications,
      medicalObservations: data.medical_observations,
      bloodType: data.blood_type,
      pediatricianName: data.pediatrician_name,
      pediatricianPhone: data.pediatrician_phone,
      photoAuthorization: data.photo_authorization,
      tripAuthorization: data.trip_authorization,
      medicalAttentionAuthorization: data.medical_attention_authorization,
      hasSiblingsInSchool: data.has_siblings_in_school,
      specialNeeds: data.special_needs,
      vaccinationStatus: data.vaccination_status,
      observations: data.observations,

      // Address nested
      address: {
        street: data.street,
        number: data.number,
        city: data.city,
        provincia: data.provincia,
        postalCode: data.postal_code_optional
      }
    };

    return {
      student: student,
      guardians: data.guardians || [],
      classroomId: data.classroom_id,
      shift: data.shift
    };
  },

  /**
   * Create a new student
   * @param {Object} data - Student data
   * @returns {Promise<Object>} Created student
   */
  async create(data) {
    // Controller expects flat snake_case object (same as frontend state)
    // Do NOT format to nested camelCase
    return api.post('/api/students', data)
  },

  /**
   * Update an existing student
   * @param {number} id - Student ID
   * @param {Object} data - Updated student data
   * @returns {Promise<Object>} Updated student
   */
  async update(id, data) {
    // Controller expects flat snake_case object
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

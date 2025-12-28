// repositories/StudentRepository.js
const { getConnection } = require('../db');
const GuardianRepository = require('./GuardianRepository');

class StudentRepository {
  static async linkGuardian(studentId, guardianId, relationData, externalConn = null) {
    const conn = externalConn || await getConnection();
    try {
      await conn.query(
        `INSERT INTO student_guardian (
           student_id, guardian_id, relationship_type,
           is_primary, is_emergency, can_pickup, has_restraining_order, can_change_diaper,
           custody_rights, financial_responsible
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          studentId,
          guardianId,
          relationData.relationship_type || 'otro',
          relationData.is_primary || false,
          relationData.is_emergency || false,
          relationData.can_pickup || false,
          relationData.has_restraining_order || false,
          relationData.can_change_diaper || false,
          relationData.custody_rights !== undefined ? relationData.custody_rights : true, // Default true often
          relationData.financial_responsible || false
        ]
      );
    } finally {
      if (!externalConn) conn.release();
    }
  }

  static STUDENT_COLUMNS = `
    s.id, s.first_name, s.middle_name_optional, s.third_name_optional, 
    s.paternal_surname, s.maternal_surname, s.nickname_optional, s.dni, 
    s.birth_date, s.address_id, s.emergency_contact_id, s.classroom_id, 
    s.shift, s.status, s.enrollment_date, s.withdrawal_date, 
    s.health_insurance, s.affiliate_number, s.allergies, s.medications, 
    s.medical_observations, s.blood_type, s.pediatrician_name, 
    s.pediatrician_phone, s.photo_authorization, s.trip_authorization, 
    s.medical_attention_authorization, s.has_siblings_in_school, 
    s.special_needs, s.vaccination_status, s.observations, s.gender
  `;

  static async getAll(options = {}, externalConn = null) {
    const conn = externalConn || await getConnection();
    try {
      const { filters = {}, pagination = {} } = options;
      let query = `
        SELECT ${this.STUDENT_COLUMNS}, 
               a.street, a.number, a.city, a.provincia,
               c.name as classroom_name,
               g.first_name as guardian_first_name, g.paternal_surname as guardian_paternal_surname,
               g.dni as guardian_dni, g.phone as guardian_phone, g.email_optional as guardian_email,
               ga.street as guardian_address, sg.relationship_type as guardian_relationship
        FROM student s
        LEFT JOIN address a ON s.address_id = a.id
        LEFT JOIN classroom c ON s.classroom_id = c.id
        LEFT JOIN student_guardian sg ON s.id = sg.student_id AND sg.is_primary = TRUE
        LEFT JOIN guardian g ON sg.guardian_id = g.id
        LEFT JOIN address ga ON g.address_id = ga.id
        WHERE 1=1
      `;
      const params = [];

      // Apply filters
      if (filters.status) {
        query += ' AND s.status = ?';
        params.push(filters.status);
      }

      if (filters.classroomId) {
        query += ' AND s.classroom_id = ?';
        params.push(filters.classroomId);
      }

      if (filters.shift) {
        query += ' AND s.shift = ?';
        params.push(filters.shift);
      }

      if (filters.dni) {
        query += ' AND s.dni = ?';
        params.push(filters.dni);
      }

      query += ' ORDER BY s.paternal_surname, s.first_name';

      // Apply pagination
      if (pagination.limit && pagination.offset !== undefined) {
        query += ' LIMIT ? OFFSET ?';
        params.push(pagination.limit, pagination.offset);
      } else if (pagination.limit) {
        query += ' LIMIT ?';
        params.push(pagination.limit);
      }

      const results = await conn.query(query, params);
      return results;
    } finally {
      if (!externalConn) conn.release();
    }
  }

  static async getById(id, externalConn = null) {
    const conn = externalConn || await getConnection();
    try {
      // Get student with basic info
      const studentResult = await conn.query(
        `SELECT ${this.STUDENT_COLUMNS}, 
         a.street, a.number, a.city, a.provincia, a.postal_code_optional,
         c.name as classroom_name
         FROM student s
         LEFT JOIN address a ON s.address_id = a.id
         LEFT JOIN classroom c ON s.classroom_id = c.id
         WHERE s.id = ?`,
        [id]
      );

      if (!studentResult || studentResult.length === 0) {
        return null;
      }

      const student = studentResult[0];

      // Get ALL guardians for this student with their permissions
      const guardiansResult = await conn.query(
        `SELECT g.id, g.first_name, g.paternal_surname, g.maternal_surname,
         g.dni, g.phone, g.email_optional,
         ga.street as address_street, ga.number as address_number, 
         ga.city as address_city, ga.provincia as address_provincia, ga.postal_code_optional as address_postal_code,
         sg.relationship_type, sg.is_primary, sg.is_emergency,
         sg.can_pickup, sg.has_restraining_order, sg.can_change_diaper
         FROM student_guardian sg
         JOIN guardian g ON sg.guardian_id = g.id
         LEFT JOIN address ga ON g.address_id = ga.id
         WHERE sg.student_id = ?`,
        [id]
      );

      // Attach guardians array to student
      student.guardians = guardiansResult;

      return student;
    } finally {
      if (!externalConn) conn.release();
    }
  }

  static async create(studentData, externalConn = null) {
    const conn = externalConn || await getConnection();
    try {
      const result = await conn.query(
        `INSERT INTO student (first_name, middle_name_optional, third_name_optional, 
         paternal_surname, maternal_surname, nickname_optional, dni, birth_date, 
         address_id, emergency_contact_id, classroom_id, shift, gender, status, 
         enrollment_date, withdrawal_date, health_insurance, affiliate_number, 
         allergies, medications, medical_observations, blood_type, 
         pediatrician_name, pediatrician_phone, photo_authorization, 
         trip_authorization, medical_attention_authorization, 
         has_siblings_in_school, special_needs, vaccination_status, observations) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          studentData.first_name,
          studentData.middle_name_optional,
          studentData.third_name_optional,
          studentData.maternal_surname,
          studentData.nickname_optional,
          studentData.dni,
          studentData.birth_date,
          studentData.address_id,
          studentData.emergency_contact_id,
          studentData.classroom_id,
          studentData.shift,
          studentData.gender,
          studentData.status,
          studentData.enrollment_date,
          studentData.withdrawal_date,
          studentData.health_insurance,
          studentData.affiliate_number,
          studentData.allergies,
          studentData.medications,
          studentData.medical_observations,
          studentData.blood_type,
          studentData.pediatrician_name,
          studentData.pediatrician_phone,
          studentData.photo_authorization || false,
          studentData.trip_authorization || false,
          studentData.medical_attention_authorization || false,
          studentData.has_siblings_in_school || false,
          studentData.special_needs,
          studentData.vaccination_status || 'no_informado',
          studentData.observations
        ]
      );

      const studentId = result.insertId;

      // Helper to process and link a guardian
      const processGuardian = async (guardianData, isEmergency = false, relationship = 'otro') => {
        let guardianId = guardianData.id;

        // If no ID, create the guardian first
        if (!guardianId) {
          // Handle name splitting for emergency contact if needed
          if (isEmergency && guardianData.full_name && !guardianData.first_name) {
            const names = guardianData.full_name.split(' ');
            guardianData.first_name = names[0];
            guardianData.paternal_surname = names.length > 1 ? names.slice(1).join(' ') : 'Unknown';
          }

          // Should probably check if guardian exists by DNI to avoid widespread duplication? 
          // For now, assuming creation or ID provided.
          guardianId = await GuardianRepository.create(guardianData, conn);
        } else {
          // Optional: Update existing guardian data if provided?
          // await GuardianRepository.update(guardianId, guardianData, conn);
        }

        // Link to student
        await conn.query(
          `INSERT INTO student_guardian (student_id, guardian_id, relationship_type, 
           is_primary, is_emergency, can_pickup, has_restraining_order, can_change_diaper) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            studentId,
            guardianId,
            guardianData.relationship || relationship,
            guardianData.is_primary || false,
            isEmergency,
            guardianData.can_pickup || (isEmergency), // Default emergency contacts to can_pickup
            guardianData.has_restraining_order || false,
            guardianData.can_change_diaper || false
          ]
        );
      };

      // Process regular guardians
      if (studentData.guardians && Array.isArray(studentData.guardians)) {
        for (const guardian of studentData.guardians) {
          await processGuardian(guardian, false, guardian.relationship_type);
        }
      }

      // Process emergency contact (legacy support / unified logic)
      if (studentData.emergency_contact) {
        await processGuardian(studentData.emergency_contact, true, studentData.emergency_contact.relationship);
      }

      return Number(studentId);
    } finally {
      if (!externalConn) conn.release();
    }
  }

  static async update(id, studentData, externalConn = null) {
    const conn = externalConn || await getConnection();
    try {
      // Update the student record
      const result = await conn.query(
        `UPDATE student SET first_name = ?, middle_name_optional = ?, 
         third_name_optional = ?, paternal_surname = ?, maternal_surname = ?, 
         nickname_optional = ?, dni = ?, birth_date = ?, address_id = ?, emergency_contact_id = ?,
         classroom_id = ?, shift = ?, gender = ?, status = ?, 
         enrollment_date = ?, withdrawal_date = ?, health_insurance = ?, 
         affiliate_number = ?, allergies = ?, medications = ?, 
         medical_observations = ?, blood_type = ?, pediatrician_name = ?, 
         pediatrician_phone = ?, photo_authorization = ?, trip_authorization = ?, 
         medical_attention_authorization = ?, has_siblings_in_school = ?, 
         special_needs = ?, vaccination_status = ?, observations = ? 
         WHERE id = ?`,
        [
          studentData.first_name,
          studentData.middle_name_optional,
          studentData.third_name_optional,
          studentData.paternal_surname,
          studentData.maternal_surname,
          studentData.nickname_optional,
          studentData.dni,
          studentData.birth_date,
          studentData.address_id,
          studentData.emergency_contact_id,
          studentData.classroom_id,
          studentData.shift,
          studentData.gender,
          studentData.status,
          studentData.enrollment_date,
          studentData.withdrawal_date,
          studentData.health_insurance,
          studentData.affiliate_number,
          studentData.allergies,
          studentData.medications,
          studentData.medical_observations,
          studentData.blood_type,
          studentData.pediatrician_name,
          studentData.pediatrician_phone,
          studentData.photo_authorization,
          studentData.trip_authorization,
          studentData.medical_attention_authorization,
          studentData.has_siblings_in_school,
          studentData.special_needs,
          studentData.vaccination_status,
          studentData.observations,
          id
        ]
      );

      // Handle Guardians Sync
      // Strategy: Delete existing links and re-create them. 
      // This is simpler than differencing and allows easy updates of relationship types.
      // However, it destroys "history" if any additional metadata was on the link, but currently it's just relationship/permissions.

      if (studentData.guardians || studentData.emergency_contact) {
        // Verify we should be updating guardians? 
        // If the array is provided, we assume it's the NEW complete list.

        // First, clear existing links? 
        // Or should we be smarter? For now, clearing prevents duplicates.
        // Note: This only removes the LINK, not the Guardian record itself.
        await conn.query('DELETE FROM student_guardian WHERE student_id = ?', [id]);

        const processGuardian = async (guardianData, isEmergency = false, relationship = 'otro') => {
          let guardianId = guardianData.id;

          // If strictly updating, we might expect guardianId to be present.
          // If not present, create new guardian.
          if (!guardianId) {
            if (isEmergency && guardianData.full_name && !guardianData.first_name) {
              const names = guardianData.full_name.split(' ');
              guardianData.first_name = names[0];
              guardianData.paternal_surname = names.length > 1 ? names.slice(1).join(' ') : 'Unknown';
            }
            guardianId = await GuardianRepository.create(guardianData, conn);
          } else {
            // Update guardian details too? Usually yes in a full update form.
            await GuardianRepository.update(guardianId, guardianData, conn);
          }

          await conn.query(
            `INSERT INTO student_guardian (student_id, guardian_id, relationship_type, 
               is_primary, is_emergency, can_pickup, has_restraining_order, can_change_diaper) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              id,
              guardianId,
              guardianData.relationship || relationship,
              guardianData.is_primary || false,
              isEmergency,
              guardianData.can_pickup || (isEmergency),
              guardianData.has_restraining_order || false,
              guardianData.can_change_diaper || false
            ]
          );
        };

        if (studentData.guardians && Array.isArray(studentData.guardians)) {
          for (const guardian of studentData.guardians) {
            await processGuardian(guardian, false, guardian.relationship_type);
          }
        }

        if (studentData.emergency_contact) {
          await processGuardian(studentData.emergency_contact, true, studentData.emergency_contact.relationship);
        }
      }

      return result.affectedRows > 0;
    } finally {
      if (!externalConn) conn.release();
    }
  }

  static async delete(id, externalConn = null) {
    const conn = externalConn || await getConnection();
    try {
      // Delete related records
      await conn.query('DELETE FROM student_guardian WHERE student_id = ?', [id]);
      await conn.query('DELETE FROM student_documents WHERE student_id = ?', [id]);
      await conn.query('DELETE FROM student_status_history WHERE student_id = ?', [id]);
      await conn.query('DELETE FROM pending_documentation WHERE student_id = ?', [id]);
      await conn.query('DELETE FROM attendance WHERE student_id = ?', [id]);
      await conn.query('DELETE FROM parent_portal_submissions WHERE student_id = ?', [id]);
      await conn.query('DELETE FROM vaccination_records WHERE student_id = ?', [id]);

      // Then delete the student
      const result = await conn.query('DELETE FROM student WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } finally {
      if (!externalConn) conn.release();
    }
  }

  static async count(filters = {}, externalConn = null) {
    const conn = externalConn || await getConnection();
    try {
      let query = `
        SELECT CAST(COUNT(*) AS SIGNED) as count
        FROM student s
        LEFT JOIN classroom c ON s.classroom_id = c.id
        WHERE 1=1
      `;
      const params = [];

      if (filters.status) {
        query += ' AND s.status = ?';
        params.push(filters.status);
      }

      if (filters.classroomId) {
        query += ' AND s.classroom_id = ?';
        params.push(filters.classroomId);
      }

      if (filters.shift) {
        query += ' AND s.shift = ?';
        params.push(filters.shift);
      }

      if (filters.dni) {
        query += ' AND s.dni = ?';
        params.push(filters.dni);
      }

      const result = await conn.query(query, params);
      return Number(result[0].count);
    } finally {
      if (!externalConn) conn.release();
    }
  }

  static async search(filters = {}, externalConn = null) {
    const conn = externalConn || await getConnection();
    try {
      let query = `
        SELECT ${this.STUDENT_COLUMNS}, 
               a.street, a.number, a.city, a.provincia,
               c.name as classroom_name
        FROM student s
        LEFT JOIN address a ON s.address_id = a.id
        LEFT JOIN classroom c ON s.classroom_id = c.id
        WHERE 1=1
      `;
      const params = [];

      if (filters.searchText) {
        query += ' AND (s.first_name LIKE ? OR s.paternal_surname LIKE ? OR s.dni LIKE ?)';
        const searchPattern = `%${filters.searchText}%`;
        params.push(searchPattern, searchPattern, searchPattern);
      }

      if (filters.nombre) {
        query += ' AND (s.first_name LIKE ? OR s.paternal_surname LIKE ?)';
        const namePattern = `%${filters.nombre}%`;
        params.push(namePattern, namePattern);
      }

      if (filters.dni) {
        query += ' AND s.dni = ?';
        params.push(filters.dni);
      }

      if (filters.salaId) {
        query += ' AND s.classroom_id = ?';
        params.push(filters.salaId);
      }

      if (filters.turno) {
        query += ' AND s.shift = ?';
        params.push(filters.turno);
      }

      if (filters.ciudad) {
        query += ' AND a.city LIKE ?';
        params.push(`%${filters.ciudad}%`);
      }

      if (filters.provincia) {
        query += ' AND a.provincia LIKE ?';
        params.push(`%${filters.provincia}%`);
      }

      if (filters.yearNacimiento) {
        query += ' AND YEAR(s.birth_date) = ?';
        params.push(filters.yearNacimiento);
      }

      query += ' ORDER BY s.paternal_surname, s.first_name';

      const results = await conn.query(query, params);
      return results;
    } finally {
      if (!externalConn) conn.release();
    }
  }
  static async getVaccinationStatus(studentId, externalConn = null) {
    const conn = externalConn || await getConnection();
    try {
      const result = await conn.query(
        `SELECT s.vaccination_status as overall_status,
         COUNT(CASE WHEN vr.status = 'faltante' THEN 1 END) as missing_vaccines,
         COUNT(CASE WHEN vr.status = 'activo' THEN 1 END) as active_vaccines,
         COUNT(CASE WHEN vr.status = 'completo' THEN 1 END) as complete_vaccines,
         COUNT(vr.id) as total_vaccines
         FROM student s
         LEFT JOIN vaccination_records vr ON s.id = vr.student_id
         WHERE s.id = ?
         GROUP BY s.id, s.vaccination_status`,
        [studentId]
      );
      return result[0] || null;
    } finally {
      if (!externalConn) conn.release();
    }
  }

  static async getPendingDocuments(studentId, externalConn = null) {
    const conn = externalConn || await getConnection();
    try {
      const result = await conn.query(
        `SELECT pd.*, 
         CONCAT(stf.first_name, ' ', stf.paternal_surname) as completed_by_name
         FROM pending_documentation pd
         LEFT JOIN staff stf ON pd.completed_by = stf.id
         WHERE pd.student_id = ? AND pd.completed_at IS NULL`,
        [studentId]
      );
      return result;
    } finally {
      if (!externalConn) conn.release();
    }
  }
  static async getBirthdaysByMonth(month) {
    const conn = await getConnection();
    try {
      const query = `
           SELECT first_name, paternal_surname, birth_date, classroom_id
           FROM student
           WHERE MONTH(birth_date) = ? AND status IN ('activo', 'inscripto')
           ORDER BY DAY(birth_date)
       `;
      const results = await conn.query(query, [month]);
      return results;
    } finally {
      conn.release();
    }
  }

  static async getPendingDocsCount() {
    const conn = await getConnection();
    try {
      const query = `
            SELECT CAST(COUNT(DISTINCT id) AS SIGNED) as count
            FROM v_students_with_pending_docs
        `;
      const result = await conn.query(query);
      return Number(result[0].count);
    } catch (err) {
      const fallbackQuery = `SELECT CAST(COUNT(DISTINCT student_id) AS SIGNED) as count FROM pending_documentation WHERE completed_at IS NULL`;
      const result = await conn.query(fallbackQuery);
      return Number(result[0].count);
    } finally {
      conn.release();
    }
  }
}

module.exports = StudentRepository;
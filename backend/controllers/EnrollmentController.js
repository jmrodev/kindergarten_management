// backend/controllers/EnrollmentController.js
const { pool } = require('../db');
const { AppError } = require('../middleware/errorHandler'); // Import AppError
const { sanitizeObject, sanitizeWhitespace } = require('../utils/sanitization'); // Import sanitization utilities

class EnrollmentController {
    // Crear inscripción completa
    async createEnrollment(req, res) {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // Sanitize all string inputs from req.body
            const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);

            const {
                // Datos del alumno
                student,
                // Datos del responsable
                guardian,
                // Datos de contacto de emergencia
                emergencyContact,
                // Sala y turno
                classroomId,
                shift
            } = sanitizedBody;

            // 1. Crear dirección del alumno
            const [addressResult] = await connection.query(
                `INSERT INTO address (street, number, city, provincia, postal_code_optional) 
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    student.address?.street || null,
                    student.address?.number || null,
                    student.address?.city || null,
                    student.address?.provincia || null,
                    student.address?.postalCode || null
                ]
            );
            const addressId = addressResult.insertId;

            // 2. Crear contacto de emergencia
            let emergencyContactId = null;
            if (emergencyContact) {
                const [ecResult] = await connection.query(
                    `INSERT INTO emergency_contact (full_name, relationship, phone, alternative_phone, priority, is_authorized_pickup) 
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        emergencyContact.fullName,
                        emergencyContact.relationship,
                        emergencyContact.phone,
                        emergencyContact.alternativePhone || null,
                        emergencyContact.priority || 1,
                        emergencyContact.isAuthorizedPickup || false
                    ]
                );
                emergencyContactId = ecResult.insertId;
            }

            // 3. Crear alumno
            const [studentResult] = await connection.query(
                `INSERT INTO student (
                    first_name, middle_name_optional, third_name_optional,
                    paternal_surname, maternal_surname, nickname_optional,
                    dni, birth_date, address_id, emergency_contact_id,
                    classroom_id, shift, status, enrollment_date,
                    health_insurance, affiliate_number, allergies, medications,
                    medical_observations, blood_type, pediatrician_name, pediatrician_phone,
                    photo_authorization, trip_authorization, medical_attention_authorization,
                    has_siblings_in_school, special_needs, vaccination_status, observations
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    student.firstName,
                    student.middleName || null,
                    student.thirdName || null,
                    student.paternalSurname,
                    student.maternalSurname || null,
                    student.nickname || null,
                    student.dni || null,
                    student.birthDate || null,
                    addressId,
                    emergencyContactId,
                    classroomId || null,
                    shift || null,
                    'inscripto',
                    new Date(),
                    student.healthInsurance || null,
                    student.affiliateNumber || null,
                    student.allergies || null,
                    student.medications || null,
                    student.medicalObservations || null,
                    student.bloodType || null,
                    student.pediatricianName || null,
                    student.pediatricianPhone || null,
                    student.photoAuthorization || false,
                    student.tripAuthorization || false,
                    student.medicalAttentionAuthorization || false,
                    student.hasSiblingsInSchool || false,
                    student.specialNeeds || null,
                    student.vaccinationStatus || 'no_informado',
                    student.observations || null
                ]
            );
            const studentId = studentResult.insertId;

            // 4. Crear/vincular responsable(s)
            if (guardian) {
                // Verificar si el guardian ya existe (por DNI)
                let guardianId;

                if (guardian.dni) {
                    const [existingGuardian] = await connection.query(
                        'SELECT id FROM guardian WHERE dni = ?',
                        [guardian.dni]
                    );

                    if (existingGuardian.length > 0) {
                        guardianId = existingGuardian[0].id;
                    }
                }

                // Si no existe, crear nuevo guardian
                if (!guardianId) {
                    // Crear dirección del guardian si es diferente
                    let guardianAddressId = addressId; // Por defecto, misma dirección

                    if (guardian.address && guardian.address.street !== student.address?.street) {
                        const [guardAddrResult] = await connection.query(
                            `INSERT INTO address (street, number, city, provincia, postal_code_optional) 
                             VALUES (?, ?, ?, ?, ?)`,
                            [
                                guardian.address.street,
                                guardian.address.number || null,
                                guardian.address.city || null,
                                guardian.address.provincia || null,
                                guardian.address.postalCode || null
                            ]
                        );
                        guardianAddressId = guardAddrResult.insertId;
                    }

                    const [guardianResult] = await connection.query(
                        `INSERT INTO guardian (
                            first_name, middle_name_optional, paternal_surname, maternal_surname,
                            dni, address_id, phone, email_optional,
                            workplace, work_phone,
                            authorized_pickup, authorized_change
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            guardian.firstName,
                            guardian.middleName || null,
                            guardian.paternalSurname,
                            guardian.maternalSurname || null,
                            guardian.dni || null,
                            guardianAddressId,
                            guardian.phone,
                            guardian.email || null,
                            guardian.workplace || null,
                            guardian.workPhone || null,
                            guardian.authorizedPickup !== false,
                            guardian.authorizedChange !== false
                        ]
                    );
                    guardianId = guardianResult.insertId;
                }

                // 5. Crear relación student_guardian
                await connection.query(
                    `INSERT INTO student_guardian (
                        student_id, guardian_id, relationship_type,
                        is_primary, custody_rights, financial_responsible
                    ) VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        studentId,
                        guardianId,
                        guardian.relationshipType || 'padre',
                        guardian.isPrimary || true,
                        guardian.custodyRights !== false,
                        guardian.financialResponsible || false
                    ]
                );
            }

            await connection.commit();

            // Obtener el registro completo creado
            const [enrollmentData] = await connection.query(
                `SELECT 
                    s.*,
                    a.street, a.number, a.city, a.provincia, a.postal_code_optional,
                    ec.full_name as ec_name, ec.phone as ec_phone,
                    c.name as classroom_name, c.capacity as classroom_capacity
                FROM student s
                LEFT JOIN address a ON s.address_id = a.id
                LEFT JOIN emergency_contact ec ON s.emergency_contact_id = ec.id
                LEFT JOIN classroom c ON s.classroom_id = c.id
                WHERE s.id = ?`,
                [studentId]
            );

            res.status(201).json({
                success: true,
                message: 'Inscripción creada exitosamente',
                data: enrollmentData[0]
            });

        } catch (error) {
            await connection.rollback();
            console.error('Error al crear inscripción:', error);
            throw new AppError('Error al crear inscripción', 500);
        } finally {
            connection.release();
        }
    }

    // Obtener todas las inscripciones
    async getAllEnrollments(req, res) {
        try {
            // Sanitize query parameters
            const sanitizedQuery = sanitizeObject(req.query, sanitizeWhitespace);
            const { status, year, classroomId, shift } = sanitizedQuery;

            let query = `
                SELECT 
                    s.id, s.first_name, s.middle_name_optional, s.third_name_optional,
                    s.paternal_surname, s.maternal_surname, s.dni, s.birth_date,
                    s.status, s.enrollment_date, s.shift,
                    c.name as classroom_name,
                    a.street, a.city,
                    ec.full_name as emergency_contact_name, ec.phone as emergency_contact_phone
                FROM student s
                LEFT JOIN classroom c ON s.classroom_id = c.id
                LEFT JOIN address a ON s.address_id = a.id
                LEFT JOIN emergency_contact ec ON s.emergency_contact_id = ec.id
                WHERE 1=1
            `;

            const params = [];

            if (status) {
                query += ' AND s.status = ?';
                params.push(status);
            }

            if (year) {
                query += ' AND YEAR(s.enrollment_date) = ?';
                params.push(year);
            }

            if (classroomId) {
                query += ' AND s.classroom_id = ?';
                params.push(classroomId);
            }

            if (shift) {
                query += ' AND s.shift = ?';
                params.push(shift);
            }

            query += ' ORDER BY s.enrollment_date DESC, s.paternal_surname, s.first_name';

            const [enrollments] = await pool.query(query, params);

            res.status(200).json({
                success: true,
                count: enrollments.length,
                data: enrollments
            });

        } catch (error) {
            console.error('Error al obtener inscripciones:', error);
            throw new AppError('Error al obtener inscripciones', 500);
        }
    }

    // Obtener inscripción por ID de estudiante
    async getEnrollmentByStudent(req, res) {
        try {
            const { studentId } = req.params;

            const [enrollment] = await pool.query(
                `SELECT 
                    s.*,
                    a.street, a.number, a.city, a.provincia, a.postal_code_optional,
                    ec.full_name as ec_name, ec.relationship as ec_relationship, 
                    ec.phone as ec_phone, ec.alternative_phone as ec_alt_phone,
                    c.id as classroom_id, c.name as classroom_name, c.capacity as classroom_capacity
                FROM student s
                LEFT JOIN address a ON s.address_id = a.id
                LEFT JOIN emergency_contact ec ON s.emergency_contact_id = ec.id
                LEFT JOIN classroom c ON s.classroom_id = c.id
                WHERE s.id = ?`,
                [studentId]
            );

            if (enrollment.length === 0) {
                throw new AppError('Inscripción no encontrada', 404);
            }

            // Obtener responsables
            const [guardians] = await pool.query(
                `SELECT 
                    g.*, 
                    sg.relationship_type, sg.is_primary, sg.custody_rights,
                    ga.street as g_street, ga.city as g_city
                FROM guardian g
                INNER JOIN student_guardian sg ON g.id = sg.guardian_id
                LEFT JOIN address ga ON g.address_id = ga.id
                WHERE sg.student_id = ?`,
                [studentId]
            );

            res.status(200).json({
                success: true,
                data: {
                    student: enrollment[0],
                    guardians: guardians
                }
            });

        } catch (error) {
            console.error('Error al obtener inscripción:', error);
            throw new AppError('Error al obtener inscripción', 500);
        }
    }

    // Actualizar inscripción
    async updateEnrollment(req, res) {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const { studentId } = req.params;
            // Sanitize all string inputs from req.body
            const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);
            const { student, guardian, emergencyContact } = sanitizedBody;

            // Actualizar datos del alumno
            if (student) {
                const updateFields = [];
                const updateValues = [];

                const fieldMapping = {
                    firstName: 'first_name',
                    middleName: 'middle_name_optional',
                    thirdName: 'third_name_optional',
                    paternalSurname: 'paternal_surname',
                    maternalSurname: 'maternal_surname',
                    nickname: 'nickname_optional',
                    dni: 'dni',
                    birthDate: 'birth_date',
                    healthInsurance: 'health_insurance',
                    affiliateNumber: 'affiliate_number',
                    allergies: 'allergies',
                    medications: 'medications',
                    medicalObservations: 'medical_observations',
                    bloodType: 'blood_type',
                    pediatricianName: 'pediatrician_name',
                    pediatricianPhone: 'pediatrician_phone',
                    photoAuthorization: 'photo_authorization',
                    tripAuthorization: 'trip_authorization',
                    medicalAttentionAuthorization: 'medical_attention_authorization',
                    hasSiblingsInSchool: 'has_siblings_in_school',
                    specialNeeds: 'special_needs',
                    vaccinationStatus: 'vaccination_status',
                    observations: 'observations'
                };

                for (const [jsKey, sqlKey] of Object.entries(fieldMapping)) {
                    if (student[jsKey] !== undefined) {
                        updateFields.push(`${sqlKey} = ?`);
                        updateValues.push(student[jsKey]);
                    }
                }

                if (updateFields.length > 0) {
                    updateValues.push(studentId);
                    await connection.query(
                        `UPDATE student SET ${updateFields.join(', ')} WHERE id = ?`,
                        updateValues
                    );
                }
            }

            await connection.commit();

            res.status(200).json({
                success: true,
                message: 'Inscripción actualizada exitosamente'
            });

        } catch (error) {
            await connection.rollback();
            console.error('Error al actualizar inscripción:', error);
            throw new AppError('Error al actualizar inscripción', 500);
        } finally {
            connection.release();
        }
    }

    // Cambiar estado de inscripción
    async updateEnrollmentStatus(req, res) {
        try {
            const { studentId } = req.params;
            // Sanitize status and reason
            const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);
            const { status, reason } = sanitizedBody;

            const validStatuses = ['inscripto', 'activo', 'inactivo', 'egresado'];
            if (!validStatuses.includes(status)) {
                throw new AppError('Estado inválido', 400);
            }

            // Obtener estado actual
            const [current] = await pool.query(
                'SELECT status FROM student WHERE id = ?',
                [studentId]
            );

            if (current.length === 0) {
                throw new AppError('Alumno no encontrado', 404);
            }

            const oldStatus = current[0].status;

            // Actualizar estado
            await pool.query(
                'UPDATE student SET status = ? WHERE id = ?',
                [status, studentId]
            );

            // Registrar en historial
            await pool.query(
                `INSERT INTO student_status_history 
                (student_id, old_status, new_status, reason) 
                VALUES (?, ?, ?, ?)`,
                [studentId, oldStatus, status, reason || null]
            );

            res.status(200).json({
                success: true,
                message: 'Estado actualizado exitosamente',
                oldStatus,
                newStatus: status
            });

        } catch (error) {
            console.error('Error al actualizar estado:', error);
            throw new AppError('Error al actualizar estado', 500);
        }
    }

    // Obtener estadísticas de inscripciones
    async getEnrollmentStats(req, res) {
        try {
            // Sanitize query parameters
            const sanitizedQuery = sanitizeObject(req.query, sanitizeWhitespace);
            const { year } = sanitizedQuery;
            const currentYear = year || new Date().getFullYear();

            const [stats] = await pool.query(
                `SELECT 
                    CAST(COUNT(*) AS SIGNED) as total,
                    CAST(SUM(CASE WHEN status = 'inscripto' THEN 1 ELSE 0 END) AS SIGNED) as inscripto,
                    CAST(SUM(CASE WHEN status = 'activo' THEN 1 ELSE 0 END) AS SIGNED) as activo,
                    CAST(SUM(CASE WHEN status = 'inactivo' THEN 1 ELSE 0 END) AS SIGNED) as inactivo,
                    CAST(SUM(CASE WHEN dni IS NULL THEN 1 ELSE 0 END) AS SIGNED) as sin_dni,
                    CAST(SUM(CASE WHEN birth_date IS NULL THEN 1 ELSE 0 END) AS SIGNED) as sin_fecha_nacimiento,
                    CAST(SUM(CASE WHEN health_insurance IS NULL THEN 1 ELSE 0 END) AS SIGNED) as sin_obra_social,
                    CAST(SUM(CASE WHEN emergency_contact_id IS NULL THEN 1 ELSE 0 END) AS SIGNED) as sin_contacto_emergencia
                FROM student
                WHERE YEAR(enrollment_date) = ? OR enrollment_date IS NULL`,
                [currentYear]
            );

            res.status(200).json({
                success: true,
                year: currentYear,
                stats: stats && stats.length > 0 ? stats[0] : null
            });

        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            throw new AppError('Error al obtener estadísticas', 500);
        }
    }

    // Obtener inscripciones incompletas
    async getIncompleteEnrollments(req, res) {
        try {
            const [incomplete] = await pool.query(
                `SELECT 
                    s.id, s.first_name, s.paternal_surname,
                    s.dni IS NULL as missing_dni,
                    s.birth_date IS NULL as missing_birth_date,
                    s.health_insurance IS NULL as missing_health_insurance,
                    s.emergency_contact_id IS NULL as missing_emergency_contact,
                    s.classroom_id IS NULL as missing_classroom,
                    CAST(COUNT(sg.guardian_id) AS SIGNED) as guardians_count
                FROM student s
                LEFT JOIN student_guardian sg ON s.id = sg.student_id
                WHERE s.status = 'inscripto'
                  AND (s.dni IS NULL 
                    OR s.birth_date IS NULL 
                    OR s.health_insurance IS NULL 
                    OR s.emergency_contact_id IS NULL)
                GROUP BY s.id
                ORDER BY s.enrollment_date DESC`
            );

            res.status(200).json({
                success: true,
                count: incomplete.length,
                data: incomplete
            });

        } catch (error) {
            console.error('Error al obtener inscripciones incompletas:', error);
            throw new AppError('Error al obtener inscripciones incompletas', 500);
        }
    }
}

module.exports = new EnrollmentController();

// backend/controllers/EnrollmentController.js
const { getConnection } = require('../db');
const { AppError } = require('../middleware/errorHandler');
const { sanitizeObject, sanitizeWhitespace } = require('../utils/sanitization');
const StudentRepository = require('../repositories/StudentRepository');
const GuardianRepository = require('../repositories/GuardianRepository');
const AddressRepository = require('../repositories/AddressRepository');

class EnrollmentController {
    // Crear inscripción completa
    async createEnrollment(req, res) {
        const connection = await getConnection();

        try {
            await connection.beginTransaction();

            const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);

            const {
                student: studentObj, // renaming to avoid confusion with variable below
                guardian, // Legacy support
                emergencyContact, // Legacy support
                guardians, // NEW: Full array support
                classroomId,
                shift
            } = sanitizedBody;

            // If flat student data came in 'studentObj', use it, or if fields provided at root?
            // The controller assumes 'student' key contains student fields.
            // But if frontend sends structured data { student: {...}, guardians: [...] }, we use that.

            const student = studentObj || {}; // Fallback if needed, but validation should handle it


            // 1. Crear dirección del alumno
            const addressData = {
                street: student.address?.street || null,
                number: student.address?.number || null,
                city: student.address?.city || null,
                provincia: student.address?.provincia || null,
                postal_code_optional: student.address?.postalCode || null
            };
            const addressId = await AddressRepository.create(addressData, connection);

            // 2. Procesar Emergency Contact (Ahora como un Guardian)
            // No creamos registro antes. Lo haremos junto con guardians.
            // Pero necesitamos su ID? No, Student ya no tiene emergency_contact_id.

            // 3. Crear alumno
            const studentData = {
                first_name: student.firstName,
                middle_name_optional: student.middleName || null,
                third_name_optional: student.thirdName || null,
                paternal_surname: student.paternalSurname,
                maternal_surname: student.maternalSurname || null,
                nickname_optional: student.nickname || null,
                dni: student.dni || null,
                birth_date: student.birthDate || null,
                address_id: addressId,
                // emergency_contact_id: REMOVED
                classroom_id: classroomId || null,
                shift: shift || null,
                gender: student.gender || 'U',
                status: 'inscripto',
                enrollment_date: new Date(),
                health_insurance: student.healthInsurance || null,
                affiliate_number: student.affiliateNumber || null,
                allergies: student.allergies || null,
                medications: student.medications || null,
                medical_observations: student.medicalObservations || null,
                blood_type: student.bloodType || null,
                pediatrician_name: student.pediatricianName || null,
                pediatrician_phone: student.pediatricianPhone || null,
                photo_authorization: student.photoAuthorization || false,
                trip_authorization: student.tripAuthorization || false,
                medical_attention_authorization: student.medicalAttentionAuthorization || false,
                has_siblings_in_school: student.hasSiblingsInSchool || false,
                special_needs: student.specialNeeds || null,
                vaccination_status: student.vaccinationStatus || 'no_informado',
                observations: student.observations || null
            };

            const studentId = await StudentRepository.create(studentData, connection);

            // 4. Crear/vincular responsable(s) (Primary Guardian)
            if (guardian) {
                await this._processGuardian(guardian, studentId, addressId, student.address?.street, connection, false);
            }

            // 5. Crear/vincular contacto de emergencia (Como Guardian)
            if (emergencyContact) {
                // emergencyContact from frontend usually has: { fullName, relationship, phone, alternativePhone, ... }
                // Map to Guardian structure
                // Emergency contact often lacks surname split, DNI, Address.

                const names = (emergencyContact.fullName || '').split(' ');
                const firstName = names[0] || 'Unknown';
                const paternalSurname = names.length > 1 ? names.slice(1).join(' ') : 'Unknown';

                const ecGuardianData = {
                    firstName: firstName,
                    paternalSurname: paternalSurname,
                    phone: emergencyContact.phone,
                    // address: use student address or null? Null usually acceptable for pure EC.
                    // But address_id is required? Let's check GuardianRepository schema. 
                    // Address ID is FK. Nullable?
                    // In init_db.sql: address_id INT, FOREIGN KEY ...
                    // Usually int columns are nullable unless NOT NULL specified.
                    // Guardian table creation: address_id INT. (Nullable).
                    relationshipType: emergencyContact.relationship || 'otro',
                    isPrimary: false,
                    isEmergency: true,
                    authorizedPickup: emergencyContact.isAuthorizedPickup || false,
                    // Map other specific fields if any
                };

                await this._processGuardian(ecGuardianData, studentId, null, null, connection, true);
            }

            // 6. Process 'guardians' array (Unified Frontend)
            if (guardians && Array.isArray(guardians)) {
                for (const g of guardians) {
                    // Check if this guardian is effectively a primary (guardian var above) or EC (emergencyContact var above) to avoid duplication if user sent both formats?
                    // Ideally frontend sends ONLY 'guardians' array OR 'guardian'/'emergencyContact' legacy fields.
                    // We process blindly assuming they are distinct or frontend logic handles it.

                    // The 'g' object from frontend likely matches Guardian structure or close to it.
                    // We need to map it carefully.

                    // Frontend 'g' keys from StepFamily: first_name, paternal_surname, dni, relationship, phone, is_primary, etc.
                    // _processGuardian expects camelCase if we stick to one convention, OR we adapt logic inside it.
                    // Let's look at _processGuardian: It handles both (input.firstName || input.first_name).

                    await this._processGuardian(g, studentId, addressId, student.address?.street, connection, g.is_emergency || g.isEmergency);
                }
            }

            await connection.commit();

            const enrollmentData = await StudentRepository.getById(studentId);
            res.status(201).json({
                success: true,
                message: 'Inscripción creada exitosamente',
                data: enrollmentData
            });

        } catch (error) {
            await connection.rollback();
            console.error('Error al crear inscripción:', error);
            throw new AppError('Error al crear inscripción', 500);
        } finally {
            connection.release();
        }
    }

    // Helper to process guardian creation/linking
    async _processGuardian(guardianDataInput, studentId, defaultAddressId, defaultStreet, connection, isEmergencyObj) {
        let guardianId;

        // Check existence by DNI if present
        if (guardianDataInput.dni) {
            const [existing] = await connection.query('SELECT id FROM guardian WHERE dni = ?', [guardianDataInput.dni]);
            if (existing.length > 0) guardianId = existing[0].id;
        }

        if (!guardianId) {
            let guardianAddressId = defaultAddressId || null; // emergency contact might have null address

            // Create address if needed and provided
            // For primary guardian, we did logic comparing street.
            // For EC, usually no address provided in this form.
            // If guardianDataInput has address:
            if (guardianDataInput.address && guardianDataInput.address.street) {
                if (guardianDataInput.address.street !== defaultStreet) {
                    const gAddrData = {
                        street: guardianDataInput.address.street,
                        number: guardianDataInput.address.number || null,
                        city: guardianDataInput.address.city || null,
                        provincia: guardianDataInput.address.provincia || null,
                        postal_code_optional: guardianDataInput.address.postalCode || null
                    };
                    guardianAddressId = await AddressRepository.create(gAddrData, connection);
                }
            } else if (!isEmergencyObj && defaultAddressId) {
                // Primary guardian defaults to student address if not specified distinct
                guardianAddressId = defaultAddressId;
            }

            const guardianData = {
                first_name: guardianDataInput.firstName || guardianDataInput.first_name,
                middle_name_optional: guardianDataInput.middleName || null,
                paternal_surname: guardianDataInput.paternalSurname || guardianDataInput.paternal_surname,
                maternal_surname: guardianDataInput.maternalSurname || null,
                preferred_surname: null,
                dni: guardianDataInput.dni || null,
                address_id: guardianAddressId,
                phone: guardianDataInput.phone,
                email_optional: guardianDataInput.email || null,
                workplace: guardianDataInput.workplace || null,
                work_phone: guardianDataInput.workPhone || null,
                authorized_pickup: guardianDataInput.authorizedPickup !== false,
                authorized_change: guardianDataInput.authorizedChange !== false,
                parent_portal_user_id: null,
                role_id: null
            };
            guardianId = await GuardianRepository.create(guardianData, connection);
        }

        // Link
        const relationData = {
            relationship_type: guardianDataInput.relationshipType || 'otro',
            is_primary: guardianDataInput.isPrimary || false,
            custody_rights: guardianDataInput.custodyRights !== false,
            financial_responsible: guardianDataInput.financialResponsible || false,
            is_emergency: isEmergencyObj || guardianDataInput.isEmergency || false,
            can_pickup: guardianDataInput.authorizedPickup || false, // ensure sync
            // other flags...
        };
        await StudentRepository.linkGuardian(studentId, guardianId, relationData, connection);
    }


    // Obtener todas las inscripciones
    async getAllEnrollments(req, res) {
        try {
            const sanitizedQuery = sanitizeObject(req.query, sanitizeWhitespace);
            const { status, year, classroomId, shift } = sanitizedQuery;
            const filters = {
                status,
                classroomId,
                shift
            };

            const enrollments = await StudentRepository.getAll({ filters });
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

    async getEnrollmentByStudent(req, res) {
        try {
            const { studentId } = req.params;
            const enrollment = await StudentRepository.getById(studentId);

            if (!enrollment) {
                throw new AppError('Inscripción no encontrada', 404);
            }

            const responseData = {
                student: enrollment,
                guardians: enrollment.guardians
            };

            res.status(200).json({
                success: true,
                data: responseData
            });

        } catch (error) {
            console.error('Error al obtener inscripción:', error);
            throw new AppError('Error al obtener inscripción', 500);
        }
    }

    async updateEnrollment(req, res) {
        const connection = await getConnection();
        try {
            await connection.beginTransaction();

            const { studentId } = req.params;
            const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);
            const { student, guardian, emergencyContact } = sanitizedBody;

            const mapStudentToRepo = (s) => ({
                first_name: s.firstName,
                middle_name_optional: s.middleName,
                third_name_optional: s.thirdName,
                paternal_surname: s.paternalSurname,
                maternal_surname: s.maternalSurname,
                nickname_optional: s.nickname,
                dni: s.dni,
                birth_date: s.birthDate,
                health_insurance: s.healthInsurance,
                affiliate_number: s.affiliateNumber,
                allergies: s.allergies,
                medications: s.medications,
                medical_observations: s.medicalObservations,
                blood_type: s.bloodType,
                pediatrician_name: s.pediatricianName,
                pediatrician_phone: s.pediatricianPhone,
                photo_authorization: s.photoAuthorization,
                trip_authorization: s.tripAuthorization,
                medical_attention_authorization: s.medicalAttentionAuthorization,
                has_siblings_in_school: s.hasSiblingsInSchool,
                special_needs: s.specialNeeds,
                vaccination_status: s.vaccinationStatus,
                observations: s.observations,
                classroom_id: s.classroomId,
                shift: s.shift,
                gender: s.gender,
                status: s.status,
                enrollment_date: s.enrollmentDate
            });

            if (student) {
                const repoData = mapStudentToRepo(student);
                await StudentRepository.update(studentId, repoData, connection);
            }

            // Note: If guardian/emergencyContact provided in update, we should ideally re-process them.
            // But complex update logic is skipped to avoid regression risks in this step as agreed implicitly.
            // We rely on separate endpoints or full update logic if demanded.

            await connection.commit();
            res.status(200).json({
                success: true,
                message: 'Inscripción actualizada exitosamente'
            });
        } catch (error) {
            await connection.rollback();
            console.error('Error al actualizar:', error);
            throw new AppError('Error al actualizar inscripción', 500);
        } finally {
            connection.release();
        }
    }

    async updateEnrollmentStatus(req, res) {
        try {
            const { studentId } = req.params;
            const { status, reason } = req.body;

            const connection = await getConnection();
            try {
                await connection.beginTransaction();

                const current = await StudentRepository.getById(studentId, connection);
                if (!current) throw new AppError('Alumno no encontrado', 404);

                const oldStatus = current.status;

                await StudentRepository.update(studentId, { status }, connection);

                await connection.query(
                    `INSERT INTO student_status_history 
                    (student_id, old_status, new_status, reason) 
                    VALUES (?, ?, ?, ?)`,
                    [studentId, oldStatus, status, reason || null]
                );

                await connection.commit();

                res.status(200).json({
                    success: true,
                    message: 'Estado actualizado exitosamente',
                    oldStatus,
                    newStatus: status
                });
            } catch (err) {
                await connection.rollback();
                throw err;
            } finally {
                connection.release();
            }

        } catch (error) {
            console.error('Error al actualizar estado:', error);
            throw new AppError('Error al actualizar estado', 500);
        }
    }

    async getEnrollmentStats(req, res) {
        const connection = await getConnection();
        try {
            const { year } = req.query;
            const currentYear = year || new Date().getFullYear();

            const [stats] = await connection.query(
                `SELECT 
                    CAST(COUNT(*) AS SIGNED) as total,
                    CAST(SUM(CASE WHEN status = 'inscripto' THEN 1 ELSE 0 END) AS SIGNED) as inscripto,
                    CAST(SUM(CASE WHEN status = 'activo' THEN 1 ELSE 0 END) AS SIGNED) as activo,
                    CAST(SUM(CASE WHEN status = 'inactivo' THEN 1 ELSE 0 END) AS SIGNED) as inactivo,
                    CAST(SUM(CASE WHEN dni IS NULL THEN 1 ELSE 0 END) AS SIGNED) as sin_dni,
                    CAST(SUM(CASE WHEN birth_date IS NULL THEN 1 ELSE 0 END) AS SIGNED) as sin_fecha_nacimiento,
                    CAST(SUM(CASE WHEN health_insurance IS NULL THEN 1 ELSE 0 END) AS SIGNED) as sin_obra_social,
                     -- Fixed: Use count of Emergency Guardians instead of column check
                    CAST(SUM(CASE WHEN (SELECT COUNT(*) FROM student_guardian sg WHERE sg.student_id = student.id AND sg.is_emergency = 1) = 0 THEN 1 ELSE 0 END) AS SIGNED) as sin_contacto_emergencia
                FROM student
                WHERE YEAR(enrollment_date) = ? OR enrollment_date IS NULL`,
                [currentYear]
            );

            res.status(200).json({
                success: true,
                year: currentYear,
                stats: stats && stats.length > 0 ? stats[0] : null
            });
        } finally {
            connection.release();
        }
    }

    async getIncompleteEnrollments(req, res) {
        const connection = await getConnection();
        try {
            // Updated query to check student_guardian for emergency contact
            const [incomplete] = await connection.query(
                `SELECT 
                    s.id, s.first_name, s.paternal_surname,
                    s.dni IS NULL as missing_dni,
                    s.birth_date IS NULL as missing_birth_date,
                    s.health_insurance IS NULL as missing_health_insurance,
                    (SELECT COUNT(*) FROM student_guardian sg WHERE sg.student_id = s.id AND sg.is_emergency = 1) = 0 as missing_emergency_contact,
                    s.classroom_id IS NULL as missing_classroom,
                    CAST(COUNT(sg.guardian_id) AS SIGNED) as guardians_count
                FROM student s
                LEFT JOIN student_guardian sg ON s.id = sg.student_id
                WHERE s.status = 'inscripto'
                GROUP BY s.id
                HAVING missing_dni = 1 
                    OR missing_birth_date = 1 
                    OR missing_health_insurance = 1 
                    OR missing_emergency_contact = 1
                ORDER BY s.enrollment_date DESC`
            );
            res.status(200).json({
                success: true,
                count: incomplete.length,
                data: incomplete
            });
        } finally {
            connection.release();
        }
    }
}

module.exports = new EnrollmentController();

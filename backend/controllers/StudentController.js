// backend/controllers/AlumnoController.js
const StudentRepository = require('../repositories/StudentRepository');
const { AppError } = require('../middleware/errorHandler'); // Import AppError
const { sanitizeObject, sanitizeWhitespace } = require('../utils/sanitization'); // Import sanitization utilities
const { getConnection } = require('../db');
const StudentValidator = require('../utils/StudentValidator');
const HealthInsuranceRepository = require('../repositories/HealthInsuranceRepository');
const PediatricianRepository = require('../repositories/PediatricianRepository');

class StudentController {
    async createStudent(req, res) {
        console.log('[CREATE STUDENT] Received body:', JSON.stringify(req.body, null, 2));
        console.log('[CREATE STUDENT] Address data:', {
            street: req.body.street,
            number: req.body.number,
            city: req.body.city
        });
        console.log('[CREATE STUDENT] Guardians array:', req.body.guardians);

        const conn = await getConnection();
        try {
            const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);

            StudentValidator.validateForCreate(sanitizedBody);

            await conn.beginTransaction();

            // Registrar obra social si es nueva
            if (sanitizedBody.health_insurance) {
                const existing = await HealthInsuranceRepository.findByName(sanitizedBody.health_insurance);
                if (!existing) {
                    await conn.query("INSERT INTO health_insurance_providers (name) VALUES (?)", [sanitizedBody.health_insurance]);
                }
            }

            // Registrar/Actualizar pediatra si es nuevo o cambió teléfono
            if (sanitizedBody.pediatrician_name) {
                const existingPed = await PediatricianRepository.findByName(sanitizedBody.pediatrician_name);
                if (!existingPed) {
                    await conn.query("INSERT INTO pediatricians (full_name, phone) VALUES (?, ?)", [sanitizedBody.pediatrician_name, sanitizedBody.pediatrician_phone]);
                } else if (sanitizedBody.pediatrician_phone && existingPed.phone !== sanitizedBody.pediatrician_phone) {
                    await conn.query("UPDATE pediatricians SET phone = ? WHERE full_name = ?", [sanitizedBody.pediatrician_phone, sanitizedBody.pediatrician_name]);
                }
            }

            // Procesar la dirección si se proporciona
            let addressId = null;
            if (sanitizedBody.street || sanitizedBody.number || sanitizedBody.city || sanitizedBody.provincia) {
                const addressResult = await conn.query(
                    `INSERT INTO address (street, number, city, provincia, postal_code_optional)
                         VALUES (?, ?, ?, ?, ?)`,
                    [
                        sanitizedBody.street || null,
                        sanitizedBody.number || null,
                        sanitizedBody.city || null,
                        sanitizedBody.provincia || null,
                        sanitizedBody.postal_code_optional || null
                    ]
                );
                addressId = addressResult.insertId;
            }



            // Crear el estudiante
            const result = await conn.query(
                `INSERT INTO student (first_name, middle_name_optional, third_name_optional,
                     paternal_surname, maternal_surname, nickname_optional, dni, birth_date,
                     address_id, classroom_id, shift, status,
                     enrollment_date, withdrawal_date, health_insurance, affiliate_number,
                     allergies, medications, medical_observations, blood_type,
                     pediatrician_name, pediatrician_phone, photo_authorization,
                     trip_authorization, medical_attention_authorization,
                     has_siblings_in_school, special_needs, vaccination_status, observations)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    sanitizedBody.first_name,
                    sanitizedBody.middle_name_optional || null,
                    sanitizedBody.third_name_optional || null,
                    sanitizedBody.paternal_surname,
                    sanitizedBody.maternal_surname || null,
                    sanitizedBody.nickname_optional || null,
                    sanitizedBody.dni || null,
                    sanitizedBody.birth_date || null,
                    addressId,
                    sanitizedBody.classroom_id || null,
                    sanitizedBody.shift || null,
                    sanitizedBody.status || 'preinscripto',
                    sanitizedBody.enrollment_date || null,
                    sanitizedBody.withdrawal_date || null,
                    sanitizedBody.health_insurance || null,
                    sanitizedBody.affiliate_number || null,
                    sanitizedBody.allergies || null,
                    sanitizedBody.medications || null,
                    sanitizedBody.medical_observations || null,
                    sanitizedBody.blood_type || null,
                    sanitizedBody.pediatrician_name || null,
                    sanitizedBody.pediatrician_phone || null,
                    sanitizedBody.photo_authorization !== undefined ? sanitizedBody.photo_authorization : false,
                    sanitizedBody.trip_authorization !== undefined ? sanitizedBody.trip_authorization : false,
                    sanitizedBody.medical_attention_authorization !== undefined ? sanitizedBody.medical_attention_authorization : false,
                    sanitizedBody.has_siblings_in_school !== undefined ? sanitizedBody.has_siblings_in_school : false,
                    sanitizedBody.special_needs || null,
                    sanitizedBody.vaccination_status || 'no_informado',
                    sanitizedBody.observations || null
                ]
            );

            const studentId = result.insertId;



            // 6. Gestionar Responsables (Guardians)
            const guardiansList = sanitizedBody.guardians || [];



            if (guardiansList.length > 0) {
                // Get Tutor Role ID (assuming 'Tutor' exists)
                const tutorRole = await conn.query("SELECT id FROM role WHERE role_name = 'Tutor'");
                const tutorRoleId = tutorRole.length > 0 ? tutorRole[0].id : null;

                for (const g of guardiansList) {
                    // Check if guardian exists by DNI
                    const existingGuardian = await conn.query("SELECT id, address_id FROM guardian WHERE dni = ?", [g.dni]);
                    let guardianId;

                    // Handle Guardian Address
                    let finalAddressId = null;
                    if (existingGuardian.length > 0) {
                        guardianId = existingGuardian[0].id;
                        finalAddressId = existingGuardian[0].address_id;
                    }

                    // If new address provided specific to guardian
                    if (g.address) {
                        if (finalAddressId) {
                            // Update or Create? Be careful not to change shared address unless intended. 
                            // For simplicity, if they provide address, we assume it's their current one.
                            await conn.query("UPDATE address SET street = ? WHERE id = ?", [g.address, finalAddressId]);
                        } else {
                            // Create new address
                            const gaResult = await conn.query("INSERT INTO address (street) VALUES (?)", [g.address]);
                            finalAddressId = gaResult.insertId;
                        }
                    }

                    if (existingGuardian.length > 0) {
                        // Update existing guardian info
                        await conn.query(
                            `UPDATE guardian SET first_name=?, paternal_surname=?, phone=?, email_optional=?, address_id=? WHERE id=?`,
                            [g.first_name, g.paternal_surname, g.phone, g.email, finalAddressId, guardianId]
                        );
                    } else {
                        // Create new
                        const gRes = await conn.query(
                            `INSERT INTO guardian (first_name, paternal_surname, dni, phone, email_optional, address_id, role_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                            [g.first_name, g.paternal_surname, g.dni, g.phone, g.email, finalAddressId, tutorRoleId]
                        );
                        guardianId = gRes.insertId;
                    }

                    // Link to Student
                    await conn.query(
                        `INSERT INTO student_guardian (student_id, guardian_id, relationship_type, is_primary, is_emergency, can_pickup, has_restraining_order, can_change_diaper) 
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
                         ON DUPLICATE KEY UPDATE relationship_type=?, is_primary=?, is_emergency=?, can_pickup=?, has_restraining_order=?, can_change_diaper=?`,
                        [
                            studentId,
                            guardianId,
                            g.relationship || 'tutor',
                            g.is_primary || false,
                            g.is_emergency || false,
                            g.can_pickup || false,
                            g.has_restraining_order || false,
                            g.can_change_diaper || false,
                            g.relationship || 'tutor',
                            g.is_primary || false,
                            g.is_emergency || false,
                            g.can_pickup || false,
                            g.has_restraining_order || false,
                            g.can_change_diaper || false
                        ]
                    );
                }
            }

            // Devolver el estudiante recién creado (dentro de la misma transacción)
            const createdStudent = await StudentRepository.getById(studentId, conn);

            // Commit ONLY if getById also succeeded
            await conn.commit();

            res.status(201).json({
                status: 'success',
                data: createdStudent
            });
        } catch (error) {
            console.error("Error in createStudent:", error);
            try { if (conn) await conn.rollback(); } catch (rbErr) { console.error("Rollback error:", rbErr); } // Rollback on error

            // Si es un error de validación (400), mantenerlo tal cual
            if (error.statusCode === 400) {
                throw error;
            } else {
                // Si es un error del servidor (como constraint violations), intentar proporcionar un mensaje más útil
                if (error.errno === 1062) { // ER_DUP_ENTRY - entrada duplicada
                    throw new AppError('Ya existe un estudiante con ese DNI', 400);
                } else if (error.errno === 1452) { // ER_NO_REFERENCED_ROW_2 - constraint de clave foránea
                    throw new AppError('Dato de referencia inválido (posible ID inexistente)', 400);
                } else {
                    throw new AppError('Error creando estudiante: ' + error.message, 500);
                }
            }
        } finally {
            if (conn) conn.release();
        }
    }

    async getAllStudents(req, res) {
        try {
            const { page = 1, limit = 10, ...filters } = req.query;
            const offset = (page - 1) * limit;

            const [students, total] = await Promise.all([
                StudentRepository.getAll({
                    filters,
                    pagination: { limit: parseInt(limit), offset: parseInt(offset) }
                }),
                StudentRepository.count(filters)
            ]);

            const totalCount = Number(total);
            const totalPages = Math.ceil(totalCount / limit);

            res.status(200).json({
                status: 'success',
                data: students,
                meta: {
                    total: totalCount,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: totalPages
                }
            });
        } catch (error) {
            console.error("Error in getAllStudents:", error);
            throw new AppError('Error fetching students', 500);
        }
    }

    async searchStudents(req, res) {
        try {
            const sanitizedQuery = sanitizeObject(req.query, sanitizeWhitespace);
            const {
                searchText,
                nombre,
                salaId,
                turno,
                ciudad,
                provincia,
                calle,
                yearNacimiento,
                edadMin,
                edadMax,
                contactoEmergencia
            } = sanitizedQuery;

            const filters = {};

            // Búsqueda general
            if (searchText) filters.searchText = searchText;

            // Filtros específicos
            if (nombre) filters.nombre = nombre;
            if (salaId) filters.salaId = parseInt(salaId);
            if (turno) filters.turno = turno;
            if (ciudad) filters.ciudad = ciudad;
            if (provincia) filters.provincia = provincia;
            if (calle) filters.calle = calle;
            if (yearNacimiento) filters.yearNacimiento = parseInt(yearNacimiento);
            if (edadMin) filters.edadMin = parseInt(edadMin);
            if (edadMax) filters.edadMax = parseInt(edadMax);
            if (contactoEmergencia) filters.contactoEmergencia = contactoEmergencia;

            const students = await StudentRepository.search(filters);
            res.status(200).json({
                status: 'success',
                data: students
            });
        } catch (error) {
            console.error("Error in searchStudents:", error);
            throw new AppError('Error searching students', 500);
        }
    }

    async getStudentById(req, res) {
        try {
            const { id } = req.params;
            const rawStudent = await StudentRepository.getById(id);
            if (!rawStudent) {
                throw new AppError("Student not found", 404);
            }

            // Restructure the data to match frontend expectations
            const student = {
                ...rawStudent,
                // Nested address data
                address: rawStudent.street || rawStudent.city ? {
                    street: rawStudent.street,
                    number: rawStudent.number,
                    city: rawStudent.city,
                    provincia: rawStudent.provincia,
                    postal_code_optional: rawStudent.postal_code_optional
                } : null,
                // Keep primary guardian info at root level for backwards compatibility
                guardian_first_name: rawStudent.guardians?.find(g => g.is_primary)?.first_name,
                guardian_paternal_surname: rawStudent.guardians?.find(g => g.is_primary)?.paternal_surname,
                guardian_phone: rawStudent.guardians?.find(g => g.is_primary)?.phone,
                guardian_email: rawStudent.guardians?.find(g => g.is_primary)?.email_optional
            };

            res.status(200).json({
                status: 'success',
                data: student
            });
        } catch (error) {
            console.error(`Error in getStudentById for id ${req.params.id}:`, error);
            throw new AppError('Error fetching student', 500);
        }
    }

    async updateStudent(req, res) {
        const conn = await getConnection();
        try {
            const { id } = req.params;
            const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);

            StudentValidator.validateForUpdate(sanitizedBody, id);

            await conn.beginTransaction();

            // Registrar obra social si es nueva
            if (sanitizedBody.health_insurance) {
                const existing = await HealthInsuranceRepository.findByName(sanitizedBody.health_insurance);
                if (!existing) {
                    await conn.query("INSERT INTO health_insurance_providers (name) VALUES (?)", [sanitizedBody.health_insurance]);
                }
            }

            // Registrar/Actualizar pediatra si es nuevo o cambió teléfono
            if (sanitizedBody.pediatrician_name) {
                const existingPed = await PediatricianRepository.findByName(sanitizedBody.pediatrician_name);
                if (!existingPed) {
                    await conn.query("INSERT INTO pediatricians (full_name, phone) VALUES (?, ?)", [sanitizedBody.pediatrician_name, sanitizedBody.pediatrician_phone]);
                } else if (sanitizedBody.pediatrician_phone && existingPed.phone !== sanitizedBody.pediatrician_phone) {
                    await conn.query("UPDATE pediatricians SET phone = ? WHERE full_name = ?", [sanitizedBody.pediatrician_phone, sanitizedBody.pediatrician_name]);
                }
            }

            // Actualizar la dirección si se proporciona
            if (sanitizedBody.street || sanitizedBody.number || sanitizedBody.city || sanitizedBody.provincia || sanitizedBody.postal_code_optional) {
                // Primero obtener el student existente para obtener address_id
                const existingStudent = await conn.query('SELECT address_id FROM student WHERE id = ?', [id]);
                if (existingStudent.length > 0 && existingStudent[0].address_id) {
                    // Actualizar la dirección existente
                    await conn.query(
                        `UPDATE address SET street = ?, number = ?, city = ?, provincia = ?, postal_code_optional = ?
                             WHERE id = ?`,
                        [
                            sanitizedBody.street || null,
                            sanitizedBody.number || null,
                            sanitizedBody.city || null,
                            sanitizedBody.provincia || null,
                            sanitizedBody.postal_code_optional || null,
                            existingStudent[0].address_id
                        ]
                    );
                } else if (sanitizedBody.street || sanitizedBody.number || sanitizedBody.city || sanitizedBody.provincia) {
                    // Crear nueva dirección si no existía
                    const addressResult = await conn.query(
                        `INSERT INTO address (street, number, city, provincia, postal_code_optional)
                             VALUES (?, ?, ?, ?, ?)`,
                        [
                            sanitizedBody.street || null,
                            sanitizedBody.number || null,
                            sanitizedBody.city || null,
                            sanitizedBody.provincia || null,
                            sanitizedBody.postal_code_optional || null
                        ]
                    );
                    // Actualizar el student con el nuevo address_id
                    await conn.query('UPDATE student SET address_id = ? WHERE id = ?', [addressResult.insertId, id]);
                }
            }



            // Actualizar el estudiante
            const result = await conn.query(
                `UPDATE student SET
                     first_name = ?, middle_name_optional = ?, third_name_optional = ?,
                     paternal_surname = ?, maternal_surname = ?, nickname_optional = ?,
                     dni = ?, birth_date = ?, classroom_id = ?, shift = ?, status = ?,
                     enrollment_date = ?, withdrawal_date = ?, health_insurance = ?,
                     affiliate_number = ?, allergies = ?, medications = ?,
                     medical_observations = ?, blood_type = ?, pediatrician_name = ?,
                     pediatrician_phone = ?, photo_authorization = ?,
                     trip_authorization = ?, medical_attention_authorization = ?,
                     has_siblings_in_school = ?, special_needs = ?,
                     vaccination_status = ?, observations = ?
                     WHERE id = ?`,
                [
                    sanitizedBody.first_name || null,
                    sanitizedBody.middle_name_optional || null,
                    sanitizedBody.third_name_optional || null,
                    sanitizedBody.paternal_surname || null,
                    sanitizedBody.maternal_surname || null,
                    sanitizedBody.nickname_optional || null,
                    sanitizedBody.dni || null,
                    sanitizedBody.birth_date || null,
                    sanitizedBody.classroom_id || null,
                    sanitizedBody.shift || null,
                    sanitizedBody.status || null,
                    sanitizedBody.enrollment_date || null,
                    sanitizedBody.withdrawal_date || null,
                    sanitizedBody.health_insurance || null,
                    sanitizedBody.affiliate_number || null,
                    sanitizedBody.allergies || null,
                    sanitizedBody.medications || null,
                    sanitizedBody.medical_observations || null,
                    sanitizedBody.blood_type || null,
                    sanitizedBody.pediatrician_name || null,
                    sanitizedBody.pediatrician_phone || null,
                    sanitizedBody.photo_authorization !== undefined ? sanitizedBody.photo_authorization : null,
                    sanitizedBody.trip_authorization !== undefined ? sanitizedBody.trip_authorization : null,
                    sanitizedBody.medical_attention_authorization !== undefined ? sanitizedBody.medical_attention_authorization : null,
                    sanitizedBody.has_siblings_in_school !== undefined ? sanitizedBody.has_siblings_in_school : null,
                    sanitizedBody.special_needs || null,
                    sanitizedBody.vaccination_status || null,
                    sanitizedBody.observations || null,
                    id
                ]
            );

            if (result.affectedRows === 0) {
                throw new AppError('Student not found', 404);
            }

            // Handle Guardians Update (Array)
            const guardiansList = sanitizedBody.guardians || [];



            if (guardiansList.length > 0) {
                // Get Tutor Role ID
                const tutorRole = await conn.query("SELECT id FROM role WHERE role_name = 'Tutor'");
                const tutorRoleId = tutorRole.length > 0 ? tutorRole[0].id : null;

                for (const g of guardiansList) {
                    // 1. Find target guardian by DNI
                    const existingGuardianByDni = await conn.query("SELECT id, address_id FROM guardian WHERE dni = ?", [g.dni]);

                    let targetGuardianId;
                    let targetAddressId = null;

                    if (existingGuardianByDni.length > 0) {
                        targetGuardianId = existingGuardianByDni[0].id;
                        targetAddressId = existingGuardianByDni[0].address_id;
                    } else {
                        targetGuardianId = null;
                    }

                    // 2. Handle Address
                    if (g.address) {
                        if (targetAddressId) {
                            await conn.query("UPDATE address SET street = ? WHERE id = ?", [g.address, targetAddressId]);
                        } else {
                            const gaResult = await conn.query("INSERT INTO address (street) VALUES (?)", [g.address]);
                            targetAddressId = gaResult.insertId;
                        }
                    }

                    // 3. Create or Update Guardian
                    if (targetGuardianId) {
                        await conn.query(
                            `UPDATE guardian SET first_name=?, paternal_surname=?, phone=?, email_optional=?, address_id=? WHERE id=?`,
                            [g.first_name, g.paternal_surname, g.phone, g.email, targetAddressId, targetGuardianId]
                        );
                    } else {
                        const gRes = await conn.query(
                            `INSERT INTO guardian (first_name, paternal_surname, dni, phone, email_optional, role_id, address_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                            [g.first_name, g.paternal_surname, g.dni, g.phone, g.email, tutorRoleId, targetAddressId]
                        );
                        targetGuardianId = gRes.insertId;
                    }

                    // 4. Update Student Linkage
                    await conn.query(
                        `INSERT INTO student_guardian (student_id, guardian_id, relationship_type, is_primary, is_emergency, can_pickup, has_restraining_order, can_change_diaper) 
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
                         ON DUPLICATE KEY UPDATE relationship_type=?, is_primary=?, is_emergency=?, can_pickup=?, has_restraining_order=?, can_change_diaper=?`,
                        [
                            id,
                            targetGuardianId,
                            g.relationship || 'tutor',
                            g.is_primary || false,
                            g.is_emergency || false,
                            g.can_pickup || false,
                            g.has_restraining_order || false,
                            g.can_change_diaper || false,
                            g.relationship || 'tutor',
                            g.is_primary || false,
                            g.is_emergency || false,
                            g.can_pickup || false,
                            g.has_restraining_order || false,
                            g.can_change_diaper || false
                        ]
                    );
                }
            }

            // Devolver el estudiante actualizado (dentro de la misma transacción)
            const updatedStudent = await StudentRepository.getById(id, conn);

            // Commit ONLY if getById also succeeded
            await conn.commit();

            res.status(200).json({
                status: 'success',
                data: updatedStudent
            });
        } catch (error) {
            console.error(`Error in updateStudent for id ${req.params.id}:`, error);
            try { if (conn) await conn.rollback(); } catch (rbErr) { console.error("Rollback error:", rbErr); } // Rollback on error

            // Si es un error de validación (400), mantenerlo tal cual
            if (error.statusCode === 400) {
                throw error;
            } else if (error.errno === 1062) { // ER_DUP_ENTRY - entrada duplicada
                throw new AppError('Ya existe un estudiante con ese DNI', 400);
            } else if (error.errno === 1452) { // ER_NO_REFERENCED_ROW_2 - constraint de clave foránea
                throw new AppError('Dato de referencia inválido (posible ID inexistente)', 400);
            } else {
                throw new AppError('Error actualizando estudiante: ' + error.message, 500);
            }
        } finally {
            if (conn) conn.release();
        }
    }

    async deleteStudent(req, res) {
        try {
            const { id } = req.params;
            const success = await StudentRepository.delete(id);
            if (!success) {
                throw new AppError("Student not found or could not be deleted", 404);
            }
            res.status(204).send(); // No content for successful deletion
        } catch (error) {
            console.error(`Error in deleteStudent for id ${req.params.id}:`, error);
            throw new AppError('Error deleting student', 500);
        }
    }

    async assignClassroom(req, res) {
        try {
            const { studentId } = req.params;
            const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);
            const { classroomId } = sanitizedBody;

            if (!classroomId) {
                throw new AppError("classroomId is required", 400);
            }

            const success = await StudentRepository.assignClassroom(studentId, classroomId);
            if (!success) {
                throw new AppError("Student or Classroom not found", 404);
            }

            const updatedStudent = await StudentRepository.getById(studentId);
            res.status(200).json(updatedStudent);
        } catch (error) {
            console.error(`Error in assignClassroom for student ${req.params.studentId}:`, error);
            throw new AppError('Error assigning classroom', 500);
        }
    }
}

module.exports = new StudentController();

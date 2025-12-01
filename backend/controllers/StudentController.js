// backend/controllers/AlumnoController.js
const StudentRepository = require('../repositories/StudentRepository');
const { AppError } = require('../middleware/errorHandler'); // Import AppError
const { sanitizeObject, sanitizeWhitespace } = require('../utils/sanitization'); // Import sanitization utilities
const { getConnection } = require('../db');
const StudentValidator = require('../utils/StudentValidator');

class StudentController {
    async createStudent(req, res) {
        try {
            const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);

            // Validar los datos usando el validador
            StudentValidator.validateForCreate(sanitizedBody);

            const conn = await getConnection();
            try {
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

                // Crear contacto de emergencia si se proporciona
                let emergencyContactId = null;
                if (sanitizedBody.emergency_contact_full_name) {
                    const ecResult = await conn.query(
                        `INSERT INTO emergency_contact (student_id, full_name, relationship,
                         priority, phone, alternative_phone, is_authorized_pickup)
                         VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [
                            null, // student_id will be set after student creation
                            sanitizedBody.emergency_contact_full_name,
                            sanitizedBody.emergency_contact_relationship || null,
                            sanitizedBody.emergency_contact_priority || 1,
                            sanitizedBody.emergency_contact_phone || null,
                            sanitizedBody.emergency_contact_alternative_phone || null,
                            sanitizedBody.emergency_contact_authorized_pickup || false
                        ]
                    );
                    emergencyContactId = ecResult.insertId;
                }

                // Crear el estudiante
                const result = await conn.query(
                    `INSERT INTO student (first_name, middle_name_optional, third_name_optional,
                     paternal_surname, maternal_surname, nickname_optional, dni, birth_date,
                     address_id, emergency_contact_id, classroom_id, shift, status,
                     enrollment_date, withdrawal_date, health_insurance, affiliate_number,
                     allergies, medications, medical_observations, blood_type,
                     pediatrician_name, pediatrician_phone, photo_authorization,
                     trip_authorization, medical_attention_authorization,
                     has_siblings_in_school, special_needs, vaccination_status, observations)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
                        emergencyContactId,
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

                // Actualizar el contacto de emergencia con el ID del estudiante si se creó
                if (emergencyContactId) {
                    await conn.query(
                        `UPDATE emergency_contact SET student_id = ? WHERE id = ?`,
                        [studentId, emergencyContactId]
                    );
                }

                // Devolver el estudiante recién creado
                const createdStudent = await StudentRepository.getById(studentId);
                res.status(201).json({
                    status: 'success',
                    data: createdStudent
                });
            } finally {
                conn.release();
            }
        } catch (error) {
            console.error("Error in createStudent:", error);
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
        }
    }

    async getAllStudents(req, res) {
        try {
            const students = await StudentRepository.getAll();
            res.status(200).json({
                status: 'success',
                data: students
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
            const student = await StudentRepository.getById(id);
            if (!student) {
                throw new AppError("Student not found", 404);
            }
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
        try {
            const { id } = req.params;
            const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);

            // Validar los datos para actualización
            StudentValidator.validateForUpdate(sanitizedBody, id);

            const conn = await getConnection();
            try {
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

                // Actualizar contacto de emergencia si se proporciona
                if (sanitizedBody.emergency_contact_full_name) {
                    // Primero obtener el student existente para ver si ya tiene un contacto de emergencia
                    const existingStudent = await conn.query('SELECT emergency_contact_id FROM student WHERE id = ?', [id]);
                    if (existingStudent.length > 0 && existingStudent[0].emergency_contact_id) {
                        // Actualizar contacto de emergencia existente
                        await conn.query(
                            `UPDATE emergency_contact SET full_name = ?, relationship = ?, priority = ?,
                             phone = ?, alternative_phone = ?, is_authorized_pickup = ?
                             WHERE id = ?`,
                            [
                                sanitizedBody.emergency_contact_full_name,
                                sanitizedBody.emergency_contact_relationship || null,
                                sanitizedBody.emergency_contact_priority || 1,
                                sanitizedBody.emergency_contact_phone || null,
                                sanitizedBody.emergency_contact_alternative_phone || null,
                                sanitizedBody.emergency_contact_authorized_pickup || false,
                                existingStudent[0].emergency_contact_id
                            ]
                        );
                    } else {
                        // Crear nuevo contacto de emergencia
                        const ecResult = await conn.query(
                            `INSERT INTO emergency_contact (student_id, full_name, relationship,
                             priority, phone, alternative_phone, is_authorized_pickup)
                             VALUES (?, ?, ?, ?, ?, ?, ?)`,
                            [
                                id,
                                sanitizedBody.emergency_contact_full_name,
                                sanitizedBody.emergency_contact_relationship || null,
                                sanitizedBody.emergency_contact_priority || 1,
                                sanitizedBody.emergency_contact_phone || null,
                                sanitizedBody.emergency_contact_alternative_phone || null,
                                sanitizedBody.emergency_contact_authorized_pickup || false
                            ]
                        );
                        // Actualizar el student con el nuevo emergency_contact_id
                        await conn.query('UPDATE student SET emergency_contact_id = ? WHERE id = ?', [ecResult.insertId, id]);
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

                // Devolver el estudiante actualizado
                const updatedStudent = await StudentRepository.getById(id);
                res.status(200).json({
                    status: 'success',
                    data: updatedStudent
                });
            } finally {
                conn.release();
            }
        } catch (error) {
            console.error(`Error in updateStudent for id ${req.params.id}:`, error);
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

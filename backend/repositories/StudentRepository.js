// backend/repositories/AlumnoRepository.js
const { getConnection } = require('../db');
const Student = require('../models/Student');
const Address = require('../models/Address');
const EmergencyContact = require('../models/EmergencyContact');
const Classroom = require('../models/Classroom');

class StudentRepository {
    async create(student) {
        let conn;
        try {
            conn = await getConnection();
            await conn.beginTransaction();

            // 1. Create Address
            const addressResult = await conn.query(
                "INSERT INTO address (street, number, city, provincia, postal_code_optional) VALUES (?, ?, ?, ?, ?)",
                [student.address.street, student.address.number, student.address.city, student.address.provincia, student.address.postalCodeOptional]
            );
            student.address.id = addressResult.insertId;

            // 2. Create EmergencyContact
            const emergencyContactResult = await conn.query(
                "INSERT INTO emergency_contact (full_name, relationship, phone) VALUES (?, ?, ?)",
                [student.emergencyContact.fullName, student.emergencyContact.relationship, student.emergencyContact.phone]
            );
            student.emergencyContact.id = emergencyContactResult.insertId;

            // 3. Create Student
            const studentResult = await conn.query(
                "INSERT INTO student (first_name, middle_name_optional, third_name_optional, paternal_surname, maternal_surname, nickname_optional, birth_date, address_id, emergency_contact_id, classroom_id, shift) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    student.firstName, student.middleNameOptional, student.thirdNameOptional, 
                    student.paternalSurname, student.maternalSurname, student.nicknameOptional, 
                    student.birthDate,
                    student.address.id, student.emergencyContact.id, student.classroom.id, student.shift
                ]
            );
            student.id = studentResult.insertId;

            await conn.commit();
            return student;
        } catch (err) {
            if (conn) await conn.rollback();
            console.error("Error creating student:", err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async findAll() {
        let conn;
        try {
            conn = await getConnection();
            const rows = await conn.query(`
                SELECT
                    a.id, a.first_name, a.middle_name_optional, a.third_name_optional, a.nickname_optional, a.paternal_surname, a.maternal_surname, a.birth_date, a.shift,
                    d.id AS direccion_id, d.street, d.number, d.city, d.provincia, d.postal_code_optional,
                    ce.id AS contacto_emergencia_id, ce.full_name AS ce_full_name, ce.relationship AS ce_relacion, ce.phone AS ce_phone,
                    s.id AS classroom_id, s.name AS classroom_name, s.capacity AS classroom_capacity
                FROM student a
                JOIN address d ON a.address_id = d.id
                JOIN emergency_contact ce ON a.emergency_contact_id = ce.id
                JOIN classroom s ON a.classroom_id = s.id
            `);
            return rows.map(row => {
                const direccion = Address.fromDbRow({
                    id: row.direccion_id, street: row.street, number: row.number, city: row.city, provincia: row.provincia, postal_code_optional: row.postal_code_optional
                });
                const contactoEmergencia = EmergencyContact.fromDbRow({
                    id: row.contacto_emergencia_id, full_name: row.ce_full_name, relationship: row.ce_relacion, phone: row.ce_phone
                });
                const sala = Classroom.fromDbRow({
                    id: row.classroom_id, name: row.classroom_name, capacity: row.classroom_capacity
                });
                return Student.fromDbRow(row, direccion, contactoEmergencia, sala);
            });
        } catch (err) {
            console.error("Error finding all students:", err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async search(filters = {}) {
        let conn;
        try {
            conn = await getConnection();
            
            let query = `
                SELECT
                    a.id, a.first_name, a.middle_name_optional, a.third_name_optional, a.nickname_optional, a.paternal_surname, a.maternal_surname, a.birth_date, a.shift,
                    d.id AS direccion_id, d.street, d.number, d.city, d.provincia, d.postal_code_optional,
                    ce.id AS contacto_emergencia_id, ce.full_name AS ce_full_name, ce.relationship AS ce_relacion, ce.phone AS ce_phone,
                    s.id AS classroom_id, s.name AS classroom_name, s.capacity AS classroom_capacity
                FROM student a
                JOIN address d ON a.address_id = d.id
                JOIN emergency_contact ce ON a.emergency_contact_id = ce.id
                JOIN classroom s ON a.classroom_id = s.id
                WHERE 1=1
            `;
            
            const params = [];
            
            // Búsqueda general - busca en todos los campos de texto
            if (filters.searchText) {
                query += ` AND (
                    a.first_name LIKE ? 
                    OR a.middle_name_optional LIKE ? 
                    OR a.third_name_optional LIKE ?
                    OR a.paternal_surname LIKE ? 
                    OR a.maternal_surname LIKE ?
                    OR a.nickname_optional LIKE ?
                    OR d.street LIKE ?
                    OR d.city LIKE ?
                    OR d.provincia LIKE ?
                    OR d.postal_code_optional LIKE ?
                    OR s.name LIKE ?
                    OR ce.full_name LIKE ?
                    OR ce.relationship LIKE ?
                    OR ce.phone LIKE ?
                )`;
                const searchTerm = `%${filters.searchText}%`;
                params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, 
                           searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, 
                           searchTerm, searchTerm);
            }
            
            // Filtros específicos (se pueden combinar con búsqueda general)
            
            // Filtro por nombre específico
            if (filters.nombre) {
                query += ` AND (
                    a.first_name LIKE ? 
                    OR a.middle_name_optional LIKE ? 
                    OR a.third_name_optional LIKE ?
                    OR a.paternal_surname LIKE ? 
                    OR a.maternal_surname LIKE ?
                    OR a.nickname_optional LIKE ?
                )`;
                const searchTerm = `%${filters.nombre}%`;
                params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
            }
            
            // Filtro por sala
            if (filters.salaId) {
                query += ` AND a.classroom_id = ?`;
                params.push(filters.salaId);
            }
            
            // Filtro por turno
            if (filters.turno) {
                query += ` AND a.shift = ?`;
                params.push(filters.turno);
            }
            
            // Filtro por ciudad
            if (filters.ciudad) {
                query += ` AND d.city LIKE ?`;
                params.push(`%${filters.ciudad}%`);
            }
            
            // Filtro por provincia
            if (filters.provincia) {
                query += ` AND d.provincia LIKE ?`;
                params.push(`%${filters.provincia}%`);
            }
            
            // Filtro por calle
            if (filters.calle) {
                query += ` AND d.street LIKE ?`;
                params.push(`%${filters.calle}%`);
            }
            
            // Filtro por edad (año de nacimiento)
            if (filters.yearNacimiento) {
                query += ` AND YEAR(a.birth_date) = ?`;
                params.push(filters.yearNacimiento);
            }
            
            // Filtro por rango de edad
            if (filters.edadMin || filters.edadMax) {
                const currentYear = new Date().getFullYear();
                
                if (filters.edadMin) {
                    const maxBirthYear = currentYear - filters.edadMin;
                    query += ` AND YEAR(a.birth_date) <= ?`;
                    params.push(maxBirthYear);
                }
                
                if (filters.edadMax) {
                    const minBirthYear = currentYear - filters.edadMax;
                    query += ` AND YEAR(a.birth_date) >= ?`;
                    params.push(minBirthYear);
                }
            }
            
            // Filtro por contacto de emergencia
            if (filters.contactoEmergencia) {
                query += ` AND (ce.full_name LIKE ? OR ce.phone LIKE ?)`;
                const searchTerm = `%${filters.contactoEmergencia}%`;
                params.push(searchTerm, searchTerm);
            }
            
            // Ordenamiento
            query += ` ORDER BY a.first_name, a.paternal_surname`;
            
            const rows = await conn.query(query, params);
            
            return rows.map(row => {
                const direccion = Address.fromDbRow({
                    id: row.direccion_id, street: row.street, number: row.number, city: row.city, provincia: row.provincia, postal_code_optional: row.postal_code_optional
                });
                const contactoEmergencia = EmergencyContact.fromDbRow({
                    id: row.contacto_emergencia_id, full_name: row.ce_full_name, relationship: row.ce_relacion, phone: row.ce_phone
                });
                const sala = Classroom.fromDbRow({
                    id: row.classroom_id, name: row.classroom_name, capacity: row.classroom_capacity
                });
                return Student.fromDbRow(row, direccion, contactoEmergencia, sala);
            });
        } catch (err) {
            console.error("Error searching students:", err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async findById(id) {
        let conn;
        try {
            conn = await getConnection();
            const rows = await conn.query(`
                SELECT
                    a.id, a.first_name, a.middle_name_optional, a.third_name_optional, a.nickname_optional, a.paternal_surname, a.maternal_surname, a.birth_date, a.shift,
                    d.id AS direccion_id, d.street, d.number, d.city, d.provincia, d.postal_code_optional,
                    ce.id AS contacto_emergencia_id, ce.full_name AS ce_full_name, ce.relationship AS ce_relacion, ce.phone AS ce_phone,
                    s.id AS classroom_id, s.name AS classroom_name, s.capacity AS classroom_capacity
                FROM student a
                JOIN address d ON a.address_id = d.id
                JOIN emergency_contact ce ON a.emergency_contact_id = ce.id
                JOIN classroom s ON a.classroom_id = s.id
                WHERE a.id = ?
            `, [id]);
            if (rows.length === 0) return null;

            const row = rows[0];
            const direccion = Address.fromDbRow({
                id: row.direccion_id, street: row.street, number: row.number, city: row.city, provincia: row.provincia, postal_code_optional: row.postal_code_optional
            });
            const contactoEmergencia = EmergencyContact.fromDbRow({
                id: row.contacto_emergencia_id, full_name: row.ce_full_name, relationship: row.ce_relacion, phone: row.ce_phone
            });
            const sala = Classroom.fromDbRow({
                id: row.classroom_id, name: row.classroom_name, capacity: row.classroom_capacity
            });
            return Student.fromDbRow(row, direccion, contactoEmergencia, sala);
        } catch (err) {
            console.error(`Error finding student with id ${id}:`, err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async update(student) {
        let conn;
        try {
            conn = await getConnection();
            await conn.beginTransaction();

            // 1. Update Address
            await conn.query(
                "UPDATE address SET street = ?, number = ?, city = ?, provincia = ?, postal_code_optional = ? WHERE id = ?",
                [student.address.street, student.address.number, student.address.city, student.address.provincia, student.address.postalCodeOptional, student.address.id]
            );

            // 2. Update EmergencyContact
            await conn.query(
                "UPDATE emergency_contact SET full_name = ?, relationship = ?, phone = ? WHERE id = ?",
                [student.emergencyContact.fullName, student.emergencyContact.relationship, student.emergencyContact.phone, student.emergencyContact.id]
            );

            // 3. Update student
            await conn.query(
                "UPDATE student SET first_name = ?, middle_name_optional = ?, third_name_optional = ?, paternal_surname = ?, maternal_surname = ?, nickname_optional = ?, birth_date = ?, classroom_id = ?, shift = ? WHERE id = ?",
                [
                    student.firstName, student.middleNameOptional, student.thirdNameOptional, 
                    student.paternalSurname, student.maternalSurname, student.nicknameOptional, 
                    student.birthDate,
                    student.classroom.id, student.shift, student.id
                ]
            );

            await conn.commit();
            
            // Retornar el alumno actualizado con todas sus relaciones
            return await this.findById(student.id);
        } catch (err) {
            if (conn) await conn.rollback();
            console.error(`Error updating student with id ${student.id}:`, err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async delete(id) {
        let conn;
        try {
            conn = await getConnection();
            await conn.beginTransaction();

            // Get student to retrieve associated address_id and emergency_contact_id
            const studentToDelete = await this.findById(id);
            if (!studentToDelete) {
                throw new Error("Student not found");
            }

            const addressId = studentToDelete.address?.id;
            const emergencyContactId = studentToDelete.emergencyContact?.id;

            // 1. Delete student first (due to foreign key constraints)
            await conn.query("DELETE FROM student WHERE id = ?", [id]);

            // 2. Check if EmergencyContact is used by other students
            if (emergencyContactId) {
                const [contactUsage] = await conn.query(
                    "SELECT COUNT(*) as count FROM student WHERE emergency_contact_id = ?",
                    [emergencyContactId]
                );
                
                // Only delete if no other student is using this contact
                if (contactUsage.count === 0) {
                    await conn.query("DELETE FROM emergency_contact WHERE id = ?", [emergencyContactId]);
                    console.log(`Emergency contact ${emergencyContactId} deleted (not used by other students)`);
                } else {
                    console.log(`Emergency contact ${emergencyContactId} kept (used by ${contactUsage.count} other student(s))`);
                }
            }

            // 3. Check if Address is used by other students
            if (addressId) {
                const [addressUsage] = await conn.query(
                    "SELECT COUNT(*) as count FROM student WHERE address_id = ?",
                    [addressId]
                );
                
                // Only delete if no other student is using this address
                if (addressUsage.count === 0) {
                    await conn.query("DELETE FROM address WHERE id = ?", [addressId]);
                    console.log(`Address ${addressId} deleted (not used by other students)`);
                } else {
                    console.log(`Address ${addressId} kept (used by ${addressUsage.count} other student(s))`);
                }
            }

            await conn.commit();
            return true;
        } catch (err) {
            if (conn) await conn.rollback();
            console.error(`Error deleting student with id ${id}:`, err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }
}

module.exports = new StudentRepository();

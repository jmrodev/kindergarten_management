// backend/controllers/AlumnoController.js
const StudentRepository = require('../repositories/StudentRepository');
const Student = require('../models/Student');
const Address = require('../models/Address');
const EmergencyContact = require('../models/EmergencyContact');
const Classroom = require('../models/Classroom');
const { AppError } = require('../middleware/errorHandler'); // Import AppError
const { sanitizeObject, sanitizeWhitespace } = require('../utils/sanitization'); // Import sanitization utilities

class StudentController {
    async createStudent(req, res) {
        try {
            const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);
            const { nombre, segundoNombre, tercerNombre, alias, apellidoMaterno, apellidoPaterno, fechaNacimiento, direccion, contactoEmergencia, sala, turno } = sanitizedBody;

            // Validar que existan los objetos requeridos
            if (!direccion || !contactoEmergencia || !sala) {
                throw new AppError("Faltan datos requeridos: direccion, contactoEmergencia o sala", 400);
            }

            // Create model objects from request body
            const newAddress = new Address(
                null, 
                direccion.calle, 
                direccion.numero, 
                direccion.ciudad, 
                direccion.provincia, 
                direccion.codigoPostal
            );
            
            const newEmergencyContact = new EmergencyContact(
                null, 
                contactoEmergencia.nombreCompleto, 
                contactoEmergencia.relacion, 
                contactoEmergencia.telefono
            );
            
            const newClassroom = sala && sala.id ? new Classroom(
                sala.id,
                sala.nombre || sala.name,
                sala.capacidad || sala.capacity
            ) : null;

            const newStudent = new Student(
                null, nombre, segundoNombre, tercerNombre, alias,
                apellidoPaterno, apellidoMaterno, fechaNacimiento,
                newAddress, newEmergencyContact, newClassroom, turno
            );

            if (!newStudent.isValid()) {
                throw new AppError("Invalid student data", 400);
            }

            const createdStudent = await StudentRepository.create(newStudent);
            res.status(201).json(createdStudent);
        } catch (error) {
            console.error("Error in createStudent:", error);
            throw new AppError('Error creating student', 500);
        }
    }

    async getAllStudents(req, res) {
        try {
            const students = await StudentRepository.findAll();
            res.status(200).json(students);
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
            res.status(200).json(students);
        } catch (error) {
            console.error("Error in searchStudents:", error);
            throw new AppError('Error searching students', 500);
        }
    }

    async getStudentById(req, res) {
        try {
            const { id } = req.params;
            const student = await StudentRepository.findById(id);
            if (!student) {
                throw new AppError("Student not found", 404);
            }
            res.status(200).json(student);
        } catch (error) {
            console.error(`Error in getStudentById for id ${req.params.id}:`, error);
            throw new AppError('Error fetching student', 500);
        }
    }

    async updateStudent(req, res) {
        try {
            const { id } = req.params;
            const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);
            const { nombre, segundoNombre, tercerNombre, alias, apellidoMaterno, apellidoPaterno, fechaNacimiento, direccion, contactoEmergencia, sala, turno } = sanitizedBody;

            // Reconstruct model objects. IDs are crucial for update.
            const updatedAddress = new Address(direccion.id, direccion.calle, direccion.numero, direccion.ciudad, direccion.provincia, direccion.codigoPostal);
            const updatedEmergencyContact = new EmergencyContact(contactoEmergencia.id, contactoEmergencia.nombreCompleto, contactoEmergencia.relacion, contactoEmergencia.telefono);
            const updatedClassroom = sala && sala.id ? new Classroom(sala.id, sala.name, sala.capacity) : null; // Handle null classroom

            const updatedStudent = new Student(
                id, nombre, segundoNombre, tercerNombre, alias,
                apellidoPaterno, apellidoMaterno, fechaNacimiento,
                updatedAddress, updatedEmergencyContact, updatedClassroom, turno
            );

            if (!updatedStudent.isValid()) {
                throw new AppError("Invalid student data", 400);
            }

            const result = await StudentRepository.update(updatedStudent);
            res.status(200).json(result);
        } catch (error) {
            console.error(`Error in updateStudent for id ${req.params.id}:`, error);
            throw new AppError('Error updating student', 500);
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

            const updatedStudent = await StudentRepository.findById(studentId);
            res.status(200).json(updatedStudent);
        } catch (error) {
            console.error(`Error in assignClassroom for student ${req.params.studentId}:`, error);
            throw new AppError('Error assigning classroom', 500);
        }
    }
}

module.exports = new StudentController();

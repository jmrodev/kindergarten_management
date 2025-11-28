// backend/controllers/AlumnoController.js
const StudentRepository = require('../repositories/StudentRepository');
const Student = require('../models/Student');
const Address = require('../models/Address');
const EmergencyContact = require('../models/EmergencyContact');
const Classroom = require('../models/Classroom');
const { serializeBigInt } = require('../utils/serialization');

class StudentController {
    async createStudent(req, res) {
        try {
            const { nombre, segundoNombre, tercerNombre, alias, apellidoMaterno, apellidoPaterno, fechaNacimiento, direccion, contactoEmergencia, sala, turno } = req.body;

            // Validar que existan los objetos requeridos
            if (!direccion || !contactoEmergencia || !sala) {
                return res.status(400).json({ 
                    message: "Faltan datos requeridos: direccion, contactoEmergencia o sala",
                    received: { 
                        hasDireccion: !!direccion, 
                        hasContactoEmergencia: !!contactoEmergencia, 
                        hasSala: !!sala 
                    }
                });
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
            
            const newClassroom = new Classroom(
                sala.id, 
                sala.nombre || sala.name, 
                sala.capacidad || sala.capacity
            );

            const newStudent = new Student(
                null, nombre, segundoNombre, tercerNombre, alias,
                apellidoPaterno, apellidoMaterno, fechaNacimiento,
                newAddress, newEmergencyContact, newClassroom, turno
            );

            if (!newStudent.isValid()) {
                return res.status(400).json({ message: "Invalid student data" });
            }

            const createdStudent = await StudentRepository.create(newStudent);
            res.status(201).json(serializeBigInt(createdStudent));
        } catch (error) {
            console.error("Error in createStudent:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async getAllStudents(req, res) {
        try {
            const students = await StudentRepository.findAll();
            res.status(200).json(serializeBigInt(students));
        } catch (error) {
            console.error("Error in getAllStudents:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async searchStudents(req, res) {
        try {
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
            } = req.query;
            
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
            res.status(200).json(serializeBigInt(students));
        } catch (error) {
            console.error("Error in searchStudents:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async getStudentById(req, res) {
        try {
            const { id } = req.params;
            const student = await StudentRepository.findById(id);
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }
            res.status(200).json(serializeBigInt(student));
        } catch (error) {
            console.error(`Error in getStudentById for id ${req.params.id}:`, error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async updateStudent(req, res) {
        try {
            const { id } = req.params;
            const { nombre, segundoNombre, tercerNombre, alias, apellidoMaterno, apellidoPaterno, fechaNacimiento, direccion, contactoEmergencia, sala, turno } = req.body;

            // Reconstruct model objects. IDs are crucial for update.
            const updatedAddress = new Address(direccion.id, direccion.calle, direccion.numero, direccion.ciudad, direccion.provincia, direccion.codigoPostal);
            const updatedEmergencyContact = new EmergencyContact(contactoEmergencia.id, contactoEmergencia.nombreCompleto, contactoEmergencia.relacion, contactoEmergencia.telefono);
            const updatedClassroom = new Classroom(sala.id, sala.name, sala.capacity); // Assuming sala already exists and we get its ID

            const updatedStudent = new Student(
                id, nombre, segundoNombre, tercerNombre, alias,
                apellidoPaterno, apellidoMaterno, fechaNacimiento,
                updatedAddress, updatedEmergencyContact, updatedClassroom, turno
            );

            if (!updatedStudent.isValid()) {
                return res.status(400).json({ message: "Invalid student data" });
            }

            const result = await StudentRepository.update(updatedStudent);
            res.status(200).json(serializeBigInt(result));
        } catch (error) {
            console.error(`Error in updateStudent for id ${req.params.id}:`, error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async deleteStudent(req, res) {
        try {
            const { id } = req.params;
            const success = await StudentRepository.delete(id);
            if (!success) {
                return res.status(404).json({ message: "Student not found or could not be deleted" });
            }
            res.status(204).send(); // No content for successful deletion
        } catch (error) {
            console.error(`Error in deleteStudent for id ${req.params.id}:`, error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async assignClassroom(req, res) {
        try {
            const { studentId } = req.params;
            const { classroomId } = req.body;

            if (!classroomId) {
                return res.status(400).json({ message: "classroomId is required" });
            }

            const success = await StudentRepository.assignClassroom(studentId, classroomId);
            if (!success) {
                return res.status(404).json({ message: "Student or Classroom not found" });
            }

            const updatedStudent = await StudentRepository.findById(studentId);
            res.status(200).json(serializeBigInt(updatedStudent));
        } catch (error) {
            console.error(`Error in assignClassroom for student ${req.params.studentId}:`, error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

module.exports = new StudentController();

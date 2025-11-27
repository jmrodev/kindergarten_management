// backend/models/Student.js
const Address = require('./Address');
const EmergencyContact = require('./EmergencyContact');
const Classroom = require('./Classroom');

class Student {
    constructor(
        id, firstName, middleNameOptional, thirdNameOptional, nicknameOptional,
        paternalSurname, maternalSurname, birthDate,
        address, emergencyContact, classroom, shift
    ) {
        this.id = id;
        this.firstName = firstName;
        this.middleNameOptional = middleNameOptional;
        this.thirdNameOptional = thirdNameOptional;
        this.nicknameOptional = nicknameOptional;
        this.paternalSurname = paternalSurname;
        this.maternalSurname = maternalSurname;
        this.birthDate = birthDate; // Date object or string
        this.address = address; // Direccion object
        this.emergencyContact = emergencyContact; // ContactoEmergencia object
        this.classroom = classroom; // Sala object
        this.shift = shift;
    }

    // Optional: Add validation methods for Alumno
    isValid() {
        return this.firstName && this.maternalSurname && this.paternalSurname &&
               this.birthDate && this.address && this.address.isValid() &&
               this.emergencyContact && this.emergencyContact.isValid() &&
               this.classroom && this.classroom.isValid() && this.shift;
    }

    static fromDbRow(row, addressRow = null, emergencyContactRow = null, classroomRow = null) {
        if (!row) return null;

        const address = addressRow ? Address.fromDbRow(addressRow) : null;
        const emergencyContact = emergencyContactRow ? EmergencyContact.fromDbRow(emergencyContactRow) : null;
        const classroom = classroomRow ? Classroom.fromDbRow(classroomRow) : null;

        return new Student(
            row.id,
            row.first_name,
            row.middle_name_optional,
            row.third_name_optional,
            row.nickname_optional,
            row.paternal_surname,
            row.maternal_surname,
            row.birth_date,
            address,
            emergencyContact,
            classroom,
            row.shift
        );
    }

    toDbRow() {
        return {
            first_name: this.firstName,
            middle_name_optional: this.middleNameOptional,
            third_name_optional: this.thirdNameOptional,
            nickname_optional: this.nicknameOptional,
            paternal_surname: this.paternalSurname,
            maternal_surname: this.maternalSurname,
            birth_date: this.birthDate, // Ensure format is compatible with DB
            address_id: this.address ? this.address.id : null,
            emergency_contact_id: this.emergencyContact ? this.emergencyContact.id : null,
            classroom_id: this.classroom ? this.classroom.id : null,
            shift: this.shift
        };
    }

    // Serializar para el frontend (español)
    toJSON() {
        return {
            id: this.id,
            nombre: this.firstName,
            segundoNombre: this.middleNameOptional,
            tercerNombre: this.thirdNameOptional,
            alias: this.nicknameOptional,
            apellidoPaterno: this.paternalSurname,
            apellidoMaterno: this.maternalSurname,
            fechaNacimiento: this.birthDate,
            turno: this.shift,
            direccion: this.address ? {
                id: this.address.id,
                calle: this.address.street,
                numero: this.address.number,
                ciudad: this.address.city,
                provincia: this.address.provincia,
                codigoPostal: this.address.postalCodeOptional
            } : null,
            contactoEmergencia: this.emergencyContact ? {
                id: this.emergencyContact.id,
                nombreCompleto: this.emergencyContact.fullName,
                relacion: this.emergencyContact.relationship,
                telefono: this.emergencyContact.phone
            } : null,
            sala: this.classroom ? {
                id: this.classroom.id,
                nombre: this.classroom.name,
                capacidad: this.classroom.capacity
            } : null
        };
    }
}

module.exports = Student;

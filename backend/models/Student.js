// backend/models/Student.js
const Address = require('./Address');
const EmergencyContact = require('./EmergencyContact');
const Classroom = require('./Classroom');

class Student {
    constructor(
        id, firstName, middleNameOptional, thirdNameOptional, nicknameOptional,
        paternalSurname, maternalSurname, dni, birthDate,
        address, emergencyContact, classroom, shift,
        healthInsurance, affiliateNumber, allergies, medications, medicalObservations,
        bloodType, pediatricianName, pediatricianPhone,
        photoAuthorization, tripAuthorization, medicalAttentionAuthorization,
        status, enrollmentDate, withdrawalDate,
        hasSiblingsInSchool, specialNeeds, vaccinationStatus, observations
    ) {
        this.id = id;
        this.firstName = firstName;
        this.middleNameOptional = middleNameOptional;
        this.thirdNameOptional = thirdNameOptional;
        this.nicknameOptional = nicknameOptional;
        this.paternalSurname = paternalSurname;
        this.maternalSurname = maternalSurname;
        this.dni = dni;
        this.birthDate = birthDate;
        this.address = address;
        this.emergencyContact = emergencyContact;
        this.classroom = classroom;
        this.shift = shift;
        // Medical info
        this.healthInsurance = healthInsurance;
        this.affiliateNumber = affiliateNumber;
        this.allergies = allergies;
        this.medications = medications;
        this.medicalObservations = medicalObservations;
        this.bloodType = bloodType;
        this.pediatricianName = pediatricianName;
        this.pediatricianPhone = pediatricianPhone;
        // Authorizations
        this.photoAuthorization = photoAuthorization;
        this.tripAuthorization = tripAuthorization;
        this.medicalAttentionAuthorization = medicalAttentionAuthorization;
        // Status
        this.status = status;
        this.enrollmentDate = enrollmentDate;
        this.withdrawalDate = withdrawalDate;
        // Additional info
        this.hasSiblingsInSchool = hasSiblingsInSchool;
        this.specialNeeds = specialNeeds;
        this.vaccinationStatus = vaccinationStatus;
        this.observations = observations;
    }

    // Optional: Add validation methods for Alumno
    isValid() {
        return this.firstName && this.maternalSurname && this.paternalSurname &&
               this.birthDate && this.address && this.address.isValid() &&
               this.shift; // Se remueve la validación estricta de classroom ya que puede ser null al crear
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
            row.dni,
            row.birth_date,
            address,
            emergencyContact,
            classroom,
            row.shift,
            row.health_insurance,
            row.affiliate_number,
            row.allergies,
            row.medications,
            row.medical_observations,
            row.blood_type,
            row.pediatrician_name,
            row.pediatrician_phone,
            row.photo_authorization,
            row.trip_authorization,
            row.medical_attention_authorization,
            row.status,
            row.enrollment_date,
            row.withdrawal_date,
            row.has_siblings_in_school,
            row.special_needs,
            row.vaccination_status,
            row.observations
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
            dni: this.dni,
            birth_date: this.birthDate,
            address_id: this.address ? this.address.id : null,
            emergency_contact_id: this.emergencyContact ? this.emergencyContact.id : null,
            classroom_id: this.classroom ? this.classroom.id : null,
            shift: this.shift,
            health_insurance: this.healthInsurance,
            affiliate_number: this.affiliateNumber,
            allergies: this.allergies,
            medications: this.medications,
            medical_observations: this.medicalObservations,
            blood_type: this.bloodType,
            pediatrician_name: this.pediatricianName,
            pediatrician_phone: this.pediatricianPhone,
            photo_authorization: this.photoAuthorization,
            trip_authorization: this.tripAuthorization,
            medical_attention_authorization: this.medicalAttentionAuthorization,
            status: this.status,
            enrollment_date: this.enrollmentDate,
            withdrawal_date: this.withdrawalDate,
            has_siblings_in_school: this.hasSiblingsInSchool,
            special_needs: this.specialNeeds,
            vaccination_status: this.vaccinationStatus,
            observations: this.observations
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

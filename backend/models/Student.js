// models/Student.js

class Student {
  constructor(data) {
    this.id = data.id;
    this.first_name = data.first_name;
    this.middle_name_optional = data.middle_name_optional;
    this.third_name_optional = data.third_name_optional;
    this.paternal_surname = data.paternal_surname;
    this.maternal_surname = data.maternal_surname;
    this.nickname_optional = data.nickname_optional;
    this.dni = data.dni;
    this.birth_date = data.birth_date;
    this.address_id = data.address_id;
    this.classroom_id = data.classroom_id;
    this.shift = data.shift;
    this.status = data.status;
    this.enrollment_date = data.enrollment_date;
    this.withdrawal_date = data.withdrawal_date;
    this.health_insurance = data.health_insurance;
    this.affiliate_number = data.affiliate_number;
    this.allergies = data.allergies;
    this.medications = data.medications;
    this.medical_observations = data.medical_observations;
    this.blood_type = data.blood_type;
    this.pediatrician_name = data.pediatrician_name;
    this.pediatrician_phone = data.pediatrician_phone;
    this.photo_authorization = data.photo_authorization;
    this.trip_authorization = data.trip_authorization;
    this.medical_attention_authorization = data.medical_attention_authorization;
    this.has_siblings_in_school = data.has_siblings_in_school;
    this.special_needs = data.special_needs;
    this.vaccination_status = data.vaccination_status;
    this.observations = data.observations;
    this.gender = data.gender;
  }

  static fromDbRow(row) {
    if (!row) return null;
    return new Student(row);
  }

  // Helper to ensure data integrity if needed
  isValid() {
    return !!(this.first_name && this.paternal_surname && this.dni);
  }
}

module.exports = Student;
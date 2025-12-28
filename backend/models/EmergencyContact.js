// models/EmergencyContact.js

class EmergencyContact {
  constructor(data) {
    this.id = data.id;
    this.student_id = data.student_id;
    this.full_name = data.full_name;
    this.relationship = data.relationship;
    this.priority = data.priority;
    this.phone = data.phone;
    this.alternative_phone = data.alternative_phone;
    this.is_authorized_pickup = data.is_authorized_pickup;
    this.student_first_name = data.student_first_name; // From JOIN
    this.student_paternal_surname = data.student_paternal_surname; // From JOIN
  }

  static fromDbRow(row) {
    if (!row) return null;
    return new EmergencyContact(row);
  }
}

module.exports = EmergencyContact;
// models/VaccinationRecord.js

class VaccinationRecord {
  constructor(data) {
    this.id = data.id;
    this.student_id = data.student_id;
    this.vaccine_name = data.vaccine_name;
    this.vaccine_date = data.vaccine_date;
    this.batch_number = data.batch_number;
    this.dose_number = data.dose_number;
    this.next_due_date = data.next_due_date;
    this.status = data.status;
    this.administered_by = data.administered_by;
    this.notes = data.notes;
    this.student_name = data.first_name; // From JOIN
    this.student_surname = data.paternal_surname; // From JOIN
  }

  static fromDbRow(row) {
    if (!row) return null;
    return new VaccinationRecord(row);
  }
}

module.exports = VaccinationRecord;
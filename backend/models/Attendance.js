// models/Attendance.js

class Attendance {
  constructor(data) {
    this.id = data.id;
    this.student_id = data.student_id;
    this.date = data.date;
    this.status = data.status;
    this.leave_type_optional = data.leave_type_optional;
    this.classroom_id = data.classroom_id;
    this.staff_id = data.staff_id;
    this.check_in_time = data.check_in_time;
    this.check_out_time = data.check_out_time;
    this.check_in_adult = data.check_in_adult;
    this.check_out_adult = data.check_out_adult;
    this.notes = data.notes;
    // Joined fields
    this.student_name = data.student_name;
    this.student_surname = data.paternal_surname; // Careful with field mappings
    this.staff_name = data.staff_first_name;
    this.classroom_name = data.classroom_name;
  }

  static fromDbRow(row) {
    if (!row) return null;
    return new Attendance(row);
  }
}

module.exports = Attendance;
// models/Calendar.js

class Calendar {
  constructor(data) {
    this.id = data.id;
    this.date = data.date;
    this.description = data.description;
    this.event_type = data.event_type;
    this.classroom_id = data.classroom_id;
    this.staff_id = data.staff_id;
    this.classroom_name = data.classroom_name; // From JOIN
    this.staff_name = data.staff_name; // From JOIN
  }

  static fromDbRow(row) {
    if (!row) return null;
    return new Calendar(row);
  }
}

module.exports = Calendar;
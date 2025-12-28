// models/Activity.js

class Activity {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description_optional = data.description_optional;
    this.schedule_optional = data.schedule_optional;
    this.teacher_id = data.teacher_id;
    this.classroom_id = data.classroom_id;
    this.teacher_name = data.teacher_name; // From JOIN
    this.classroom_name = data.classroom_name; // From JOIN
  }

  static fromDbRow(row) {
    if (!row) return null;
    return new Activity(row);
  }
}

module.exports = Activity;
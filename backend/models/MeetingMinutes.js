// models/MeetingMinutes.js

class MeetingMinutes {
  constructor(data) {
    this.id = data.id;
    this.meeting_type = data.meeting_type;
    this.meeting_date = data.meeting_date;
    this.meeting_time = data.meeting_time;
    this.participants = data.participants;
    this.purpose = data.purpose;
    this.conclusions = data.conclusions;
    this.responsible_staff_id = data.responsible_staff_id;
    this.created_by = data.created_by;
    this.created_at = data.created_at;
    this.updated_by = data.updated_by;
    this.updated_at = data.updated_at;
  }

  static fromDbRow(row) {
    if (!row) return null;
    return new MeetingMinutes(row);
  }
}

module.exports = MeetingMinutes;
class Calendar {
    constructor(id, date, description, eventType, classroomId, staffId, classroomName = null, staffName = null) {
        this.id = id;
        this.date = date;
        this.description = description;
        this.eventType = eventType;
        this.classroomId = classroomId;
        this.staffId = staffId;
        this.classroomName = classroomName;
        this.staffName = staffName;
    }

    static fromDbRow(row) {
        if (!row) return null;
        return new Calendar(
            row.id,
            row.date,
            row.description,
            row.event_type,
            row.classroom_id,
            row.staff_id,
            row.classroom_name,
            row.staff_name
        );
    }

    toDbRow() {
        return {
            date: this.date,
            description: this.description,
            event_type: this.eventType,
            classroom_id: this.classroomId,
            staff_id: this.staffId
        };
    }
}

module.exports = Calendar;

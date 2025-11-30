class Activity {
    constructor(id, name, descriptionOptional, scheduleOptional, teacherId, classroomId, teacherName = null, classroomName = null) {
        this.id = id;
        this.name = name;
        this.descriptionOptional = descriptionOptional;
        this.scheduleOptional = scheduleOptional;
        this.teacherId = teacherId;
        this.classroomId = classroomId;
        this.teacherName = teacherName;
        this.classroomName = classroomName;
    }

    static fromDbRow(row) {
        if (!row) return null;
        return new Activity(
            row.id,
            row.name,
            row.description_optional,
            row.schedule_optional,
            row.teacher_id,
            row.classroom_id,
            row.teacher_name,
            row.classroom_name
        );
    }

    toDbRow() {
        return {
            name: this.name,
            description_optional: this.descriptionOptional,
            schedule_optional: this.scheduleOptional,
            teacher_id: this.teacherId,
            classroom_id: this.classroomId
        };
    }
}

module.exports = Activity;

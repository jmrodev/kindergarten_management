class Attendance {
    constructor(id, studentId, date, status, leaveTypeOptional, classroomId, staffId, studentName = null, staffName = null) {
        this.id = id;
        this.studentId = studentId;
        this.date = date;
        this.status = status;
        this.leaveTypeOptional = leaveTypeOptional;
        this.classroomId = classroomId;
        this.staffId = staffId;
        this.studentName = studentName;
        this.staffName = staffName;
    }

    static fromDbRow(row) {
        if (!row) return null;
        return new Attendance(
            row.id,
            row.student_id,
            row.date,
            row.status,
            row.leave_type_optional,
            row.classroom_id,
            row.staff_id,
            row.student_name,
            row.staff_name
        );
    }

    toDbRow() {
        return {
            student_id: this.studentId,
            date: this.date,
            status: this.status,
            leave_type_optional: this.leaveTypeOptional,
            classroom_id: this.classroomId,
            staff_id: this.staffId
        };
    }
}

module.exports = Attendance;

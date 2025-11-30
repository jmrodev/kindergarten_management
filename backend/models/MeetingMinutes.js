class MeetingMinutes {
    constructor(
        id, meetingType, meetingDate, meetingTime, participants,
        purpose, conclusions, responsibleStaffId, createdBy, createdAt,
        updatedBy, updatedAt, responsibleStaffName = null
    ) {
        this.id = id;
        this.meetingType = meetingType;
        this.meetingDate = meetingDate;
        this.meetingTime = meetingTime;
        this.participants = participants;
        this.purpose = purpose;
        this.conclusions = conclusions;
        this.responsibleStaffId = responsibleStaffId;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.updatedBy = updatedBy;
        this.updatedAt = updatedAt;

        // Optional helper field for display
        this.responsibleStaffName = responsibleStaffName;
    }

    static fromDbRow(row) {
        if (!row) return null;
        return new MeetingMinutes(
            row.id,
            row.meeting_type,
            row.meeting_date,
            row.meeting_time,
            row.participants,
            row.purpose,
            row.conclusions,
            row.responsible_staff_id,
            row.created_by,
            row.created_at,
            row.updated_by,
            row.updated_at,
            row.responsible_staff_name // Helper if joined
        );
    }

    toDbRow() {
        return {
            meeting_type: this.meetingType,
            meeting_date: this.meetingDate,
            meeting_time: this.meetingTime,
            participants: this.participants,
            purpose: this.purpose,
            conclusions: this.conclusions,
            responsible_staff_id: this.responsibleStaffId,
            created_by: this.createdBy,
            updated_by: this.updatedBy
        };
    }
}

module.exports = MeetingMinutes;

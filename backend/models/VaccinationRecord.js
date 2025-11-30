class VaccinationRecord {
    constructor(
        id, studentId, vaccineName, vaccineDate, batchNumber, doseNumber,
        nextDueDate, status, administeredBy, notes, createdAt, updatedAt,
        studentName = null
    ) {
        this.id = id;
        this.studentId = studentId;
        this.vaccineName = vaccineName;
        this.vaccineDate = vaccineDate;
        this.batchNumber = batchNumber;
        this.doseNumber = doseNumber;
        this.nextDueDate = nextDueDate;
        this.status = status;
        this.administeredBy = administeredBy;
        this.notes = notes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;

        this.studentName = studentName;
    }

    static fromDbRow(row) {
        if (!row) return null;
        return new VaccinationRecord(
            row.id,
            row.student_id,
            row.vaccine_name,
            row.vaccine_date,
            row.batch_number,
            row.dose_number,
            row.next_due_date,
            row.status,
            row.administered_by,
            row.notes,
            row.created_at,
            row.updated_at,
            row.student_name
        );
    }

    toDbRow() {
        return {
            student_id: this.studentId,
            vaccine_name: this.vaccineName,
            vaccine_date: this.vaccineDate,
            batch_number: this.batchNumber,
            dose_number: this.doseNumber,
            next_due_date: this.nextDueDate,
            status: this.status,
            administered_by: this.administeredBy,
            notes: this.notes
        };
    }
}

module.exports = VaccinationRecord;

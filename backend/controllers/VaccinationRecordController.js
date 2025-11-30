const VaccinationRecordRepository = require('../repositories/VaccinationRecordRepository');
const VaccinationRecord = require('../models/VaccinationRecord');
const { AppError } = require('../middleware/errorHandler');

class VaccinationRecordController {
    async create(req, res) {
        try {
            const {
                studentId, vaccineName, vaccineDate, batchNumber, doseNumber,
                nextDueDate, status, administeredBy, notes
            } = req.body;

            const newRecord = new VaccinationRecord(
                null, studentId, vaccineName, vaccineDate, batchNumber, doseNumber,
                nextDueDate, status, administeredBy, notes
            );

            const createdRecord = await VaccinationRecordRepository.create(newRecord);
            res.status(201).json(createdRecord);
        } catch (error) {
            console.error("Error creating vaccination record:", error);
            throw new AppError('Error creating vaccination record', 500);
        }
    }

    async getByStudentId(req, res) {
        try {
            const { studentId } = req.params;
            const records = await VaccinationRecordRepository.findByStudentId(studentId);
            res.status(200).json(records);
        } catch (error) {
            console.error(`Error fetching vaccination records for student ${req.params.studentId}:`, error);
            throw new AppError('Error fetching vaccination records', 500);
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const record = await VaccinationRecordRepository.findById(id);
            if (!record) {
                throw new AppError("Vaccination record not found", 404);
            }
            res.status(200).json(record);
        } catch (error) {
            console.error(`Error fetching vaccination record ${id}:`, error);
            throw new AppError('Error fetching vaccination record', 500);
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const {
                vaccineName, vaccineDate, batchNumber, doseNumber,
                nextDueDate, status, administeredBy, notes
            } = req.body;

            const existingRecord = await VaccinationRecordRepository.findById(id);
            if (!existingRecord) {
                throw new AppError("Vaccination record not found", 404);
            }

            const updatedRecord = new VaccinationRecord(
                id, existingRecord.studentId, vaccineName, vaccineDate, batchNumber, doseNumber,
                nextDueDate, status, administeredBy, notes, existingRecord.createdAt
            );

            const result = await VaccinationRecordRepository.update(updatedRecord);
            res.status(200).json(result);
        } catch (error) {
            console.error(`Error updating vaccination record ${req.params.id}:`, error);
            throw new AppError('Error updating vaccination record', 500);
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const success = await VaccinationRecordRepository.delete(id);
            if (!success) {
                throw new AppError("Vaccination record not found", 404);
            }
            res.status(204).send();
        } catch (error) {
            console.error(`Error deleting vaccination record ${req.params.id}:`, error);
            throw new AppError('Error deleting vaccination record', 500);
        }
    }
}

module.exports = new VaccinationRecordController();

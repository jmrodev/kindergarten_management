// controllers/VaccinationRecordController.js
const VaccinationRecord = require('../models/VaccinationRecord');
const Student = require('../models/Student');
const { AppError } = require('../middleware/errorHandler');

class VaccinationRecordController {
  static async getAll(req, res, next) {
    try {
      const filters = {};
      
      if (req.query.studentId) filters.studentId = req.query.studentId;
      if (req.query.status) filters.status = req.query.status;

      const vaccinationRecords = await VaccinationRecord.getAll(filters);
      res.status(200).json({
        status: 'success',
        data: vaccinationRecords
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const vaccinationRecord = await VaccinationRecord.getById(id);

      if (!vaccinationRecord) {
        return next(new AppError(`No vaccination record found with id: ${id}`, 404));
      }

      res.status(200).json({
        status: 'success',
        data: vaccinationRecord
      });
    } catch (error) {
      next(error);
    }
  }

  static async getByStudentId(req, res, next) {
    try {
      const { studentId } = req.params;
      const vaccinationRecords = await VaccinationRecord.getByStudentId(studentId);

      res.status(200).json({
        status: 'success',
        data: vaccinationRecords
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      // Validate student exists
      const student = await Student.getById(req.body.student_id);
      if (!student) {
        return next(new AppError(`No student found with id: ${req.body.student_id}`, 404));
      }

      const vaccinationId = await VaccinationRecord.create(req.body);
      const createdVaccination = await VaccinationRecord.getById(vaccinationId);

      res.status(201).json({
        status: 'success',
        message: 'Vaccination record created successfully',
        data: createdVaccination
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const vaccinationRecord = await VaccinationRecord.getById(id);

      if (!vaccinationRecord) {
        return next(new AppError(`No vaccination record found with id: ${id}`, 404));
      }

      // Validate student exists if student_id is being updated
      if (req.body.student_id) {
        const student = await Student.getById(req.body.student_id);
        if (!student) {
          return next(new AppError(`No student found with id: ${req.body.student_id}`, 404));
        }
      }

      const updated = await VaccinationRecord.update(id, req.body);

      if (!updated) {
        return next(new AppError(`No vaccination record found with id: ${id}`, 404));
      }

      const updatedVaccination = await VaccinationRecord.getById(id);

      res.status(200).json({
        status: 'success',
        message: 'Vaccination record updated successfully',
        data: updatedVaccination
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await VaccinationRecord.delete(id);

      if (!deleted) {
        return next(new AppError(`No vaccination record found with id: ${id}`, 404));
      }

      res.status(200).json({
        status: 'success',
        message: 'Vaccination record deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async getVaccinationStatusSummary(req, res, next) {
    try {
      const summary = await VaccinationRecord.getVaccinationStatusSummary();

      res.status(200).json({
        status: 'success',
        data: summary
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = VaccinationRecordController;
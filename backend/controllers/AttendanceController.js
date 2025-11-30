const AttendanceRepository = require('../repositories/AttendanceRepository');
const Attendance = require('../models/Attendance');
const { AppError } = require('../middleware/errorHandler');

class AttendanceController {
    async create(req, res) {
        try {
            const { studentId, date, status, leaveTypeOptional, classroomId, staffId } = req.body;

            const newAttendance = new Attendance(
                null, studentId, date, status, leaveTypeOptional, classroomId, staffId
            );

            const createdAttendance = await AttendanceRepository.create(newAttendance);
            res.status(201).json(createdAttendance);
        } catch (error) {
            console.error("Error creating attendance:", error);
            throw new AppError('Error creating attendance', 500);
        }
    }

    async getByDateAndClassroom(req, res) {
        try {
            const { date, classroomId } = req.query;
            if (!date || !classroomId) {
                throw new AppError("Date and classroomId are required", 400);
            }
            const attendance = await AttendanceRepository.findByDateAndClassroom(date, classroomId);
            res.status(200).json(attendance);
        } catch (error) {
            console.error("Error fetching attendance:", error);
            throw new AppError('Error fetching attendance', 500);
        }
    }

    async getStaffAttendance(req, res) {
        try {
            const { date } = req.query;
            if (!date) {
                throw new AppError("Date is required", 400);
            }
            const attendance = await AttendanceRepository.findStaffAttendance(date);
            res.status(200).json(attendance);
        } catch (error) {
            console.error("Error fetching staff attendance:", error);
            throw new AppError('Error fetching staff attendance', 500);
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { status, leaveTypeOptional } = req.body;

            const updatedAttendance = new Attendance(id, null, null, status, leaveTypeOptional, null, null);

            const result = await AttendanceRepository.update(updatedAttendance);
            res.status(200).json(result);
        } catch (error) {
            console.error(`Error updating attendance ${req.params.id}:`, error);
            throw new AppError('Error updating attendance', 500);
        }
    }
}

module.exports = new AttendanceController();

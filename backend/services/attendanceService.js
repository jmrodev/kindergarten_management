// services/attendanceService.js
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Staff = require('../models/Staff');
const { AppError } = require('../middleware/errorHandler');

class AttendanceService {
  // Mark attendance for a student on a specific date
  static async markStudentAttendance(attendanceData) {
    try {
      // Check if attendance already exists for this student and date
      const existingAttendance = await Attendance.getByStudentAndDate(
        attendanceData.student_id, 
        attendanceData.date
      );

      if (existingAttendance) {
        // Update existing attendance if exists
        await Attendance.update(existingAttendance.id, attendanceData);
        return await Attendance.getById(existingAttendance.id);
      } else {
        // Create new attendance record
        const attendanceId = await Attendance.create(attendanceData);
        return await Attendance.getById(attendanceId);
      }
    } catch (error) {
      throw error;
    }
  }

  // Mark attendance for staff on a specific date
  static async markStaffAttendance(attendanceData) {
    try {
      // Validate it's a staff attendance
      if (!attendanceData.staff_id) {
        throw new AppError('Staff ID is required for staff attendance', 400);
      }

      // Check if attendance already exists for this staff and date
      const existingAttendance = await Attendance.getByStaffAndDate(
        attendanceData.staff_id,
        attendanceData.date
      );

      if (existingAttendance) {
        // Update existing attendance if exists
        await Attendance.update(existingAttendance.id, attendanceData);
        return await Attendance.getById(existingAttendance.id);
      } else {
        // Create new attendance record
        const attendanceId = await Attendance.create(attendanceData);
        return await Attendance.getById(attendanceId);
      }
    } catch (error) {
      throw error;
    }
  }

  // Get attendance summary for a student by date range
  static async getStudentAttendanceSummary(studentId, startDate, endDate) {
    try {
      const student = await Student.getById(studentId);
      if (!student) {
        throw new AppError(`No student found with id: ${studentId}`, 404);
      }

      // Get all attendance records for the student in the date range
      const attendances = await Attendance.getAll({
        studentId,
        startDate,
        endDate
      });

      // Calculate attendance statistics
      const totalDays = attendances.length;
      const presentDays = attendances.filter(a => a.status.toLowerCase() === 'presente').length;
      const absentDays = attendances.filter(a => a.status.toLowerCase() === 'ausente').length;
      const lateDays = attendances.filter(a => a.status.toLowerCase() === 'tarde').length;
      
      const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

      return {
        studentId,
        studentName: `${student.first_name} ${student.paternal_surname}`,
        startDate,
        endDate,
        totalDays,
        presentDays,
        absentDays,
        lateDays,
        attendancePercentage: parseFloat(attendancePercentage.toFixed(2)),
        attendances
      };
    } catch (error) {
      throw error;
    }
  }

  // Get attendance summary for a staff member by date range
  static async getStaffAttendanceSummary(staffId, startDate, endDate) {
    try {
      const staff = await Staff.getById(staffId);
      if (!staff) {
        throw new AppError(`No staff found with id: ${staffId}`, 404);
      }

      // Get all attendance records for the staff in the date range
      const attendances = await Attendance.getStaffAttendance({
        staffId,
        startDate,
        endDate
      });

      // Calculate attendance statistics
      const totalDays = attendances.length;
      const presentDays = attendances.filter(a => a.status.toLowerCase() === 'presente').length;
      const absentDays = attendances.filter(a => a.status.toLowerCase() === 'ausente').length;
      const lateDays = attendances.filter(a => a.status.toLowerCase() === 'tarde').length;
      
      const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

      return {
        staffId,
        staffName: `${staff.first_name} ${staff.paternal_surname}`,
        startDate,
        endDate,
        totalDays,
        presentDays,
        absentDays,
        lateDays,
        attendancePercentage: parseFloat(attendancePercentage.toFixed(2)),
        attendances
      };
    } catch (error) {
      throw error;
    }
  }

  // Get daily attendance summary for the institution
  static async getDailyInstitutionAttendance(date) {
    try {
      const dailyAttendance = await Attendance.getDailyAttendance(date);

      // Calculate institution-wide statistics
      const totalStudents = dailyAttendance.length;
      const presentStudents = dailyAttendance.filter(a => a.status.toLowerCase() === 'presente').length;
      const absentStudents = dailyAttendance.filter(a => a.status.toLowerCase() === 'ausente').length;
      const lateStudents = dailyAttendance.filter(a => a.status.toLowerCase() === 'tarde').length;
      
      const attendancePercentage = totalStudents > 0 ? (presentStudents / totalStudents) * 100 : 0;

      // Group by classroom
      const attendanceByClassroom = {};
      dailyAttendance.forEach(record => {
        const classroomName = record.classroom_name || 'Sin sala';
        if (!attendanceByClassroom[classroomName]) {
          attendanceByClassroom[classroomName] = {
            classroom: classroomName,
            total: 0,
            present: 0,
            absent: 0,
            late: 0,
            students: []
          };
        }
        
        attendanceByClassroom[classroomName].total++;
        attendanceByClassroom[classroomName].students.push(record);
        
        switch(record.status.toLowerCase()) {
          case 'presente':
            attendanceByClassroom[classroomName].present++;
            break;
          case 'ausente':
            attendanceByClassroom[classroomName].absent++;
            break;
          case 'tarde':
            attendanceByClassroom[classroomName].late++;
            break;
        }
      });

      return {
        date,
        totalStudents,
        presentStudents,
        absentStudents,
        lateStudents,
        attendancePercentage: parseFloat(attendancePercentage.toFixed(2)),
        attendanceByClassroom: Object.values(attendanceByClassroom)
      };
    } catch (error) {
      throw error;
    }
  }

  // Generate attendance report for a specific period
  static async generateAttendanceReport(classroomId = null, startDate, endDate) {
    try {
      const filters = { startDate, endDate };
      if (classroomId) {
        filters.classroomId = classroomId;
      }

      const attendanceRecords = await Attendance.getAll(filters);

      // Process attendance records to generate comprehensive report
      const report = {
        startDate,
        endDate,
        classroomId,
        totalAttendanceRecords: attendanceRecords.length,
        summary: {
          totalStudents: 0,
          totalPresent: 0,
          totalAbsent: 0,
          totalLate: 0,
          averageAttendancePercentage: 0
        },
        dailyBreakdown: {},
        students: {}
      };

      // Group by student and by date
      const studentAttendance = {};
      const dailyAttendance = {};

      attendanceRecords.forEach(record => {
        // Group by student
        if (!studentAttendance[record.student_id]) {
          studentAttendance[record.student_id] = {
            id: record.student_id,
            name: `${record.first_name} ${record.paternal_surname}`,
            classroom: record.classroom_name,
            attendance: []
          };
        }
        studentAttendance[record.student_id].attendance.push(record);

        // Group by date
        if (!dailyAttendance[record.date]) {
          dailyAttendance[record.date] = {
            date: record.date,
            total: 0,
            present: 0,
            absent: 0,
            late: 0
          };
        }
        dailyAttendance[record.date].total++;
        
        switch(record.status.toLowerCase()) {
          case 'presente':
            dailyAttendance[record.date].present++;
            break;
          case 'ausente':
            dailyAttendance[record.date].absent++;
            break;
          case 'tarde':
            dailyAttendance[record.date].late++;
            break;
        }
      });

      // Calculate statistics
      report.summary.totalStudents = Object.keys(studentAttendance).length;
      
      let totalPossibleAttendance = 0;
      let totalActualAttendance = 0;
      
      Object.values(studentAttendance).forEach(student => {
        const studentStats = {
          total: student.attendance.length,
          present: 0,
          absent: 0,
          late: 0
        };
        
        student.attendance.forEach(record => {
          totalPossibleAttendance++;
          totalActualAttendance++;
          switch(record.status.toLowerCase()) {
            case 'presente':
              studentStats.present++;
              report.summary.totalPresent++;
              break;
            case 'ausente':
              studentStats.absent++;
              report.summary.totalAbsent++;
              break;
            case 'tarde':
              studentStats.late++;
              report.summary.totalLate++;
              break;
          }
        });
        
        student.stats = studentStats;
      });

      report.dailyBreakdown = dailyAttendance;
      report.students = Object.values(studentAttendance);
      
      if (totalPossibleAttendance > 0) {
        report.summary.averageAttendancePercentage = 
          parseFloat(((report.summary.totalPresent / totalPossibleAttendance) * 100).toFixed(2));
      }

      return report;
    } catch (error) {
      throw error;
    }
  }

  // Get attendance by staff
  static async getAttendanceByStaff(staffId, date) {
    try {
      const attendances = await Attendance.getAll({
        staffId,
        date
      });

      return {
        staffId,
        date,
        count: attendances.length,
        attendances
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AttendanceService;
// services/vaccinationService.js
const VaccinationRecord = require('../models/VaccinationRecord');
const Student = require('../models/Student');
const { AppError } = require('../middleware/errorHandler');

class VaccinationService {
  // Check if a student has all required vaccines
  static async checkStudentVaccinationCompleteness(studentId) {
    try {
      const vaccinationStatus = await Student.getVaccinationStatus(studentId);
      if (!vaccinationStatus) {
        throw new AppError(`No vaccination status found for student ${studentId}`, 404);
      }

      const isComplete = vaccinationStatus.missing_vaccines === 0;
      
      return {
        studentId,
        isComplete,
        totalVaccines: vaccinationStatus.total_vaccines,
        completeVaccines: vaccinationStatus.complete_vaccines,
        missingVaccines: vaccinationStatus.missing_vaccines
      };
    } catch (error) {
      throw error;
    }
  }

  // Get vaccination recommendations based on student age
  static async getVaccinationRecommendations(studentId) {
    try {
      const student = await Student.getById(studentId);
      if (!student) {
        throw new AppError(`No student found with id: ${studentId}`, 404);
      }

      // Calculate age from birth date
      const today = new Date();
      const birthDate = new Date(student.birth_date);
      const ageInMonths = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24 * 30.44));

      // Define vaccination schedule based on age
      // This is a simplified version - in a real system, this would come from official vaccination schedules
      const vaccinationSchedule = this.getVaccinationScheduleByAge(ageInMonths);
      
      // Get student's current vaccinations
      const studentVaccinations = await VaccinationRecord.getByStudentId(studentId);
      
      // Determine which vaccines are missing
      const missingVaccines = vaccinationSchedule.filter(vaccine => {
        return !studentVaccinations.some(sv => 
          sv.vaccine_name.toLowerCase() === vaccine.name.toLowerCase() && 
          sv.status !== 'faltante'
        );
      });

      return {
        studentId,
        ageInMonths,
        vaccinationSchedule,
        studentVaccinations,
        missingVaccines,
        recommendations: missingVaccines.map(v => v.name)
      };
    } catch (error) {
      throw error;
    }
  }

  // Get vaccination schedule based on age in months
  static getVaccinationScheduleByAge(ageInMonths) {
    // Simplified vaccination schedule - in a real system, this would be more comprehensive
    const schedule = [];

    // Birth
    if (ageInMonths >= 0) {
      schedule.push({ name: 'Hepatitis B (dosis 1)', age: 'al nacer', dueDate: null });
    }

    // 2 months
    if (ageInMonths >= 2) {
      schedule.push({ name: 'Hepatitis B (dosis 2)', age: '2 meses', dueDate: null });
      schedule.push({ name: 'DTPa Hib (dosis 1)', age: '2 meses', dueDate: null });
      schedule.push({ name: 'Polio (dosis 1)', age: '2 meses', dueDate: null });
      schedule.push({ name: 'Neumococo (dosis 1)', age: '2 meses', dueDate: null });
    }

    // 4 months
    if (ageInMonths >= 4) {
      schedule.push({ name: 'DTPa Hib (dosis 2)', age: '4 meses', dueDate: null });
      schedule.push({ name: 'Polio (dosis 2)', age: '4 meses', dueDate: null });
      schedule.push({ name: 'Neumococo (dosis 2)', age: '4 meses', dueDate: null });
    }

    // 6 months
    if (ageInMonths >= 6) {
      schedule.push({ name: 'Hepatitis B (dosis 3)', age: '6 meses', dueDate: null });
      schedule.push({ name: 'DTPa Hib (dosis 3)', age: '6 meses', dueDate: null });
      schedule.push({ name: 'Polio (dosis 3)', age: '6 meses', dueDate: null });
      schedule.push({ name: 'Influenza estacional', age: '6 meses', dueDate: null });
    }

    // 12-15 months
    if (ageInMonths >= 12) {
      schedule.push({ name: 'Hib (dosis 4)', age: '12-15 meses', dueDate: null });
      schedule.push({ name: 'Neumococo (dosis 4)', age: '12-15 meses', dueDate: null });
      schedule.push({ name: 'MMR (dosis 1)', age: '12-15 meses', dueDate: null });
    }

    // 15-18 months
    if (ageInMonths >= 15) {
      schedule.push({ name: 'DTPa (refuerzo)', age: '15-18 meses', dueDate: null });
      schedule.push({ name: 'Polio (refuerzo)', age: '15-18 meses', dueDate: null });
    }

    return schedule;
  }

  // Update student vaccination status based on vaccination records
  static async updateStudentVaccinationStatus(studentId) {
    try {
      const vaccinationStatus = await Student.getVaccinationStatus(studentId);
      if (!vaccinationStatus) {
        throw new AppError(`No vaccination status found for student ${studentId}`, 404);
      }

      // Determine overall vaccination status based on missing vaccines
      let overallStatus = 'completo';
      if (vaccinationStatus.missing_vaccines > 0) {
        overallStatus = 'incompleto';
      }

      // Update student record with overall vaccination status
      await Student.update(studentId, { vaccination_status: overallStatus });
      
      return {
        studentId,
        overallStatus,
        totalVaccines: vaccinationStatus.total_vaccines,
        completeVaccines: vaccinationStatus.complete_vaccines,
        missingVaccines: vaccinationStatus.missing_vaccines
      };
    } catch (error) {
      throw error;
    }
  }
  
  // Get vaccination statistics for the institution
  static async getInstitutionVaccinationStats() {
    try {
      const vaccinationSummary = await VaccinationRecord.getVaccinationStatusSummary();
      if (!vaccinationSummary || vaccinationSummary.length === 0) {
        return {
          totalStudents: 0,
          studentsWithCompleteVaccination: 0,
          studentsWithIncompleteVaccination: 0,
          percentageComplete: 0,
          averageVaccinesPerStudent: 0
        };
      }

      const totalStudents = vaccinationSummary.length;
      const studentsWithCompleteVaccination = vaccinationSummary.filter(s => s.overall_status === 'completo').length;
      const studentsWithIncompleteVaccination = totalStudents - studentsWithCompleteVaccination;
      
      const totalVaccines = vaccinationSummary.reduce((sum, student) => sum + Number(student.total_vaccines || 0), 0);
      const averageVaccinesPerStudent = totalStudents > 0 ? totalVaccines / totalStudents : 0;
      const percentageComplete = totalStudents > 0 ? (studentsWithCompleteVaccination / totalStudents) * 100 : 0;

      return {
        totalStudents,
        studentsWithCompleteVaccination,
        studentsWithIncompleteVaccination,
        percentageComplete: parseFloat(percentageComplete.toFixed(2)),
        averageVaccinesPerStudent: parseFloat(averageVaccinesPerStudent.toFixed(2))
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = VaccinationService;
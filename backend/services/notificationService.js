// services/notificationService.js
const Guardian = require('../models/Guardian');
const Staff = require('../models/Staff');
const Student = require('../models/Student');
const { AppError } = require('../middleware/errorHandler');

class NotificationService {
  // Send a notification to guardians of a student
  static async notifyStudentGuardians(studentId, message, type = 'general') {
    try {
      const student = await Student.getById(studentId);
      if (!student) {
        throw new AppError(`No student found with id: ${studentId}`, 404);
      }

      // Get all guardians for this student
      const guardians = await Guardian.getByStudentId(studentId);
      
      if (!guardians || guardians.length === 0) {
        throw new AppError(`No guardians found for student ${studentId}`, 404);
      }

      // In a real system, this would send actual notifications
      // For now, we'll just return information about potential notifications
      const notifications = guardians.map(guardian => ({
        guardianId: guardian.id,
        guardianName: `${guardian.first_name} ${guardian.paternal_surname}`,
        message,
        type,
        sentAt: new Date(),
        studentId,
        studentName: `${student.first_name} ${student.paternal_surname}`,
        contactInfo: {
          phone: guardian.phone,
          email: guardian.email_optional
        }
      }));

      return {
        studentId,
        studentName: `${student.first_name} ${student.paternal_surname}`,
        message,
        type,
        guardians: notifications,
        totalGuardians: guardians.length
      };
    } catch (error) {
      throw error;
    }
  }

  // Send vaccination reminder to student guardians
  static async sendVaccinationReminder(studentId, vaccineName, dueDate) {
    try {
      const student = await Student.getById(studentId);
      if (!student) {
        throw new AppError(`No student found with id: ${studentId}`, 404);
      }

      const message = `Recordatorio: La vacuna "${vaccineName}" para ${student.first_name} ${student.paternal_surname} debe aplicarse antes del ${dueDate}. Por favor comuníquese con su centro de salud.`;

      return await this.notifyStudentGuardians(studentId, message, 'vaccination_reminder');
    } catch (error) {
      throw error;
    }
  }

  // Send attendance alert to guardians
  static async sendAttendanceAlert(studentId, date, status) {
    try {
      const student = await Student.getById(studentId);
      if (!student) {
        throw new AppError(`No student found with id: ${studentId}`, 404);
      }

      let message;
      switch(status.toLowerCase()) {
        case 'ausente':
          message = `Alerta de asistencia: ${student.first_name} ${student.paternal_surname} estuvo ausente el día ${date}.`;
          break;
        case 'tarde':
          message = `Alerta de asistencia: ${student.first_name} ${student.paternal_surname} llegó tarde el día ${date}.`;
          break;
        default:
          message = `Alerta de asistencia: ${student.first_name} ${student.paternal_surname} tiene un estado de asistencia no habitual el día ${date}.`;
      }

      return await this.notifyStudentGuardians(studentId, message, 'attendance_alert');
    } catch (error) {
      throw error;
    }
  }

  // Send calendar event notification to relevant parties
  static async sendCalendarEventNotification(eventId, eventDetails) {
    try {
      // This would notify staff and/or guardians about calendar events
      // Implementation would depend on event type
      const notification = {
        eventId,
        eventDetails,
        message: `Nuevo evento: ${eventDetails.description} el día ${eventDetails.date}`,
        type: 'calendar_event',
        sentAt: new Date()
      };

      return notification;
    } catch (error) {
      throw error;
    }
  }

  // Send document required notification
  static async sendDocumentRequiredNotification(studentId, documentType) {
    try {
      const student = await Student.getById(studentId);
      if (!student) {
        throw new AppError(`No student found with id: ${studentId}`, 404);
      }

      const message = `Documento requerido: Por favor, adjunte el documento "${documentType}" para ${student.first_name} ${student.paternal_surname}. Este documento es necesario para completar el proceso de inscripción.`;

      return await this.notifyStudentGuardians(studentId, message, 'document_required');
    } catch (error) {
      throw error;
    }
  }

  // Send meeting reminder
  static async sendMeetingReminder(meetingId, meetingDetails) {
    try {
      // This would notify participants about upcoming meetings
      const notification = {
        meetingId,
        meetingDetails,
        message: `Recordatorio de reunión: "${meetingDetails.purpose}" está programada para el ${meetingDetails.meeting_date} a las ${meetingDetails.meeting_time}.`,
        type: 'meeting_reminder',
        sentAt: new Date()
      };

      return notification;
    } catch (error) {
      throw error;
    }
  }

  // Send vaccination status update to guardians
  static async sendVaccinationStatusUpdate(studentId, status) {
    try {
      const student = await Student.getById(studentId);
      if (!student) {
        throw new AppError(`No student found with id: ${studentId}`, 404);
      }

      let message;
      switch(status.toLowerCase()) {
        case 'completo':
          message = `¡Buenas noticias! La cartilla de vacunación de ${student.first_name} ${student.paternal_surname} está completa.`;
          break;
        case 'incompleto':
          message = `La cartilla de vacunación de ${student.first_name} ${student.paternal_surname} necesita actualización. Por favor revise los recordatorios.`;
          break;
        case 'no_informado':
          message = `Por favor actualice la información de vacunación para ${student.first_name} ${student.paternal_surname}.`;
          break;
        default:
          message = `Actualización sobre la vacunación de ${student.first_name} ${student.paternal_surname}.`;
      }

      return await this.notifyStudentGuardians(studentId, message, 'vaccination_update');
    } catch (error) {
      throw error;
    }
  }
}

module.exports = NotificationService;
// middleware/validation.js
const { AppError } = require('./errorHandler');
const Validators = require('../utils/validators');

// Validation middleware for vaccination records
const validateVaccinationRecord = (req, res, next) => {
  const { student_id, vaccine_name, vaccine_date, status } = req.body;

  // Validate required fields
  if (!student_id) {
    return next(new AppError('Student ID is required', 400));
  }

  if (!vaccine_name) {
    return next(new AppError('Vaccine name is required', 400));
  }

  if (!vaccine_date) {
    return next(new AppError('Vaccine date is required', 400));
  }

  if (!status) {
    return next(new AppError('Status is required', 400));
  }

  // Validate using our utility functions
  if (!Validators.validateInteger(student_id)) {
    return next(new AppError('Student ID must be a valid integer', 400));
  }

  if (!Validators.validateEnum(status, ['activo', 'faltante', 'completo', 'exento'])) {
    return next(new AppError(`Status must be one of: activo, faltante, completo, exento`, 400));
  }

  if (!Validators.validateDateFormat(vaccine_date)) {
    return next(new AppError('Vaccine date must be in YYYY-MM-DD format', 400));
  }

  next();
};

// Validation middleware for meeting minutes
const validateMeetingMinute = (req, res, next) => {
  const { meeting_type, meeting_date, meeting_time, participants, purpose } = req.body;

  // Validate required fields
  if (!Validators.validateRequired(meeting_type)) {
    return next(new AppError('Meeting type is required', 400));
  }

  if (!Validators.validateRequired(meeting_date)) {
    return next(new AppError('Meeting date is required', 400));
  }

  if (!Validators.validateRequired(participants)) {
    return next(new AppError('Participants are required', 400));
  }

  if (!Validators.validateRequired(purpose)) {
    return next(new AppError('Purpose is required', 400));
  }

  // Validate meeting type enum
  if (!Validators.validateEnum(meeting_type, ['directivos_familia', 'apoyo_familia', 'personal'])) {
    return next(new AppError(`Meeting type must be one of: directivos_familia, apoyo_familia, personal`, 400));
  }

  if (!Validators.validateDateFormat(meeting_date)) {
    return next(new AppError('Meeting date must be in YYYY-MM-DD format', 400));
  }

  // Validate time format if provided
  if (meeting_time && !Validators.validateTimeFormat(meeting_time)) {
    return next(new AppError('Meeting time must be in HH:MM or HH:MM:SS format', 400));
  }

  next();
};

// Validation middleware for document review
const validateDocumentReview = (req, res, next) => {
  const { document_type, document_id, status } = req.body;

  // Validate required fields
  if (!Validators.validateRequired(document_type)) {
    return next(new AppError('Document type is required', 400));
  }

  if (document_id === undefined || document_id === null) {
    return next(new AppError('Document ID is required', 400));
  }

  if (!Validators.validateRequired(status)) {
    return next(new AppError('Status is required', 400));
  }

  // Validate document type enum
  if (!Validators.validateEnum(document_type, ['alumno', 'padre', 'personal', 'acta', 'salida', 'permiso', 'otro'])) {
    return next(new AppError(`Document type must be one of: alumno, padre, personal, acta, salida, permiso, otro`, 400));
  }

  // Validate status enum
  if (!Validators.validateEnum(status, ['pendiente', 'verificado', 'rechazado'])) {
    return next(new AppError(`Status must be one of: pendiente, verificado, rechazado`, 400));
  }

  // Validate document_id is a positive integer
  if (!Validators.validatePositiveNumber(document_id)) {
    return next(new AppError('Document ID must be a positive number', 400));
  }

  next();
};

// Validation middleware for attendance
const validateAttendance = (req, res, next) => {
  const { date, status } = req.body;

  // At least student_id or staff_id must be provided
  if (!req.body.student_id && !req.body.staff_id) {
    return next(new AppError('Either student_id or staff_id must be provided', 400));
  }

  if (!Validators.validateRequired(date)) {
    return next(new AppError('Date is required', 400));
  }

  if (!Validators.validateRequired(status)) {
    return next(new AppError('Status is required', 400));
  }

  if (!Validators.validateDateFormat(date)) {
    return next(new AppError('Date must be in YYYY-MM-DD format', 400));
  }

  // Validate that if student_id is provided, it's a positive integer
  if (req.body.student_id && !Validators.validatePositiveNumber(req.body.student_id)) {
    return next(new AppError('Student ID must be a positive number', 400));
  }

  // Validate that if staff_id is provided, it's a positive integer
  if (req.body.staff_id && !Validators.validatePositiveNumber(req.body.staff_id)) {
    return next(new AppError('Staff ID must be a positive number', 400));
  }

  next();
};

// Validation middleware for calendar events
const validateCalendarEvent = (req, res, next) => {
  const { date, description, event_type } = req.body;

  if (!Validators.validateRequired(date)) {
    return next(new AppError('Date is required', 400));
  }

  if (!Validators.validateRequired(description)) {
    return next(new AppError('Description is required', 400));
  }

  if (!Validators.validateRequired(event_type)) {
    return next(new AppError('Event type is required', 400));
  }

  if (!Validators.validateDateFormat(date)) {
    return next(new AppError('Date must be in YYYY-MM-DD format', 400));
  }

  // Validate event type enum (from the extended list in the database)
  const validEventTypes = [
    'inscripcion', 'inicio_clases', 'fin_clases', 'vacaciones', 'invierno',
    'feriado', 'personal_activo', 'dia_maestro', 'arte', 'musica', 'gimnasia',
    'ingles', 'expresion_corporal', 'salida', 'reunion_directivos_familia',
    'reunion_apoyo_familia', 'reunion_personal', 'celebracion', 'evento_especial'
  ];

  if (!Validators.validateEnum(event_type, validEventTypes)) {
    return next(new AppError(`Event type must be one of the valid types`, 400));
  }

  // Validate that if classroom_id is provided, it's a positive integer
  if (req.body.classroom_id && !Validators.validatePositiveNumber(req.body.classroom_id)) {
    return next(new AppError('Classroom ID must be a positive number', 400));
  }

  // Validate that if staff_id is provided, it's a positive integer
  if (req.body.staff_id && !Validators.validatePositiveNumber(req.body.staff_id)) {
    return next(new AppError('Staff ID must be a positive number', 400));
  }

  next();
};

// Validation middleware for activities
const validateActivity = (req, res, next) => {
  const { name } = req.body;

  if (!Validators.validateRequired(name)) {
    return next(new AppError('Name is required', 400));
  }

  if (!Validators.validateStringLength(name, 2, 255)) {
    return next(new AppError('Name must be between 2 and 255 characters long', 400));
  }

  // Validate that if teacher_id is provided, it's a positive integer
  if (req.body.teacher_id && !Validators.validatePositiveNumber(req.body.teacher_id)) {
    return next(new AppError('Teacher ID must be a positive number', 400));
  }

  // Validate that if classroom_id is provided, it's a positive integer
  if (req.body.classroom_id && !Validators.validatePositiveNumber(req.body.classroom_id)) {
    return next(new AppError('Classroom ID must be a positive number', 400));
  }

  next();
};

module.exports = {
  validateVaccinationRecord,
  validateMeetingMinute,
  validateDocumentReview,
  validateAttendance,
  validateCalendarEvent,
  validateActivity
};
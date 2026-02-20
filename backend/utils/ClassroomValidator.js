const { AppError } = require('../middleware/errorHandler');

class ClassroomValidator {
  static validateForCreate(classroomData) {
    const errors = [];

    // Validaciones requeridas
    if (!classroomData.name || classroomData.name.trim() === '') {
      errors.push('Nombre de sala es requerido');
    }

    if (!classroomData.capacity) {
      errors.push('Capacidad es requerida');
    } else {
      const capacity = parseInt(classroomData.capacity);
      if (isNaN(capacity) || capacity <= 0) {
        errors.push('Capacidad debe ser un número positivo');
      }
    }

    // Validar turno
    const validShifts = ['Mañana', 'Tarde', 'Completo'];
    if (classroomData.shift && !validShifts.includes(classroomData.shift)) {
      errors.push(`Turno inválido. Valores válidos: ${validShifts.join(', ')}`);
    }

    // Validar año académico
    if (classroomData.academic_year) {
      const year = parseInt(classroomData.academic_year);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 2000 || year > currentYear + 5) {
        errors.push('Año académico inválido');
      }
    }

    // Validar grupo de edad
    if (classroomData.age_group && typeof classroomData.age_group === 'string' && classroomData.age_group.length > 50) {
      errors.push('Grupo de edad es demasiado largo (máximo 50 caracteres)');
    }

    if (errors.length > 0) {
      throw new AppError(`Errores de validación: ${errors.join('; ')}`, 400);
    }

    return true;
  }

  static validateForUpdate(classroomData, classroomId) {
    // Similar a validateForCreate pero opcional para algunos campos
    const errors = [];

    // Validar capacidad si se proporciona
    if (classroomData.capacity !== undefined && classroomData.capacity !== null) {
      const capacity = parseInt(classroomData.capacity);
      if (isNaN(capacity) || capacity <= 0) {
        errors.push('Capacidad debe ser un número positivo');
      }
    }

    // Validar turno
    const validShifts = ['Mañana', 'Tarde', 'Completo'];
    if (classroomData.shift && !validShifts.includes(classroomData.shift)) {
      errors.push(`Turno inválido. Valores válidos: ${validShifts.join(', ')}`);
    }

    // Validar año académico
    if (classroomData.academic_year) {
      const year = parseInt(classroomData.academic_year);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 2000 || year > currentYear + 5) {
        errors.push('Año académico inválido');
      }
    }

    // Validar grupo de edad
    if (classroomData.age_group && typeof classroomData.age_group === 'string' && classroomData.age_group.length > 50) {
      errors.push('Grupo de edad es demasiado largo (máximo 50 caracteres)');
    }

    if (errors.length > 0) {
      throw new AppError(`Errores de validación: ${errors.join('; ')}`, 400);
    }

    return true;
  }
}

module.exports = ClassroomValidator;
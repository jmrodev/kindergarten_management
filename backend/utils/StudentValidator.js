const { AppError } = require('../middleware/errorHandler');

class StudentValidator {
  static validateForCreate(studentData) {
    const errors = [];
    
    // Validaciones requeridas
    if (!studentData.first_name || studentData.first_name.trim() === '') {
      errors.push('Nombre es requerido');
    }
    
    if (!studentData.paternal_surname || studentData.paternal_surname.trim() === '') {
      errors.push('Apellido paterno es requerido');
    }
    
    // Validar formato de fecha si se proporciona
    if (studentData.birth_date) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(studentData.birth_date)) {
        errors.push('Fecha de nacimiento inválida. Formato esperado: YYYY-MM-DD');
      }
    }
    
    // Validar DNI si se proporciona
    if (studentData.dni) {
      if (studentData.dni.length < 6 || studentData.dni.length > 15) {
        errors.push('DNI inválido. Debe tener entre 6 y 15 caracteres');
      }
    }
    
    // Validar campo status
    const validStatus = ['preinscripto', 'pendiente', 'approved', 'sorteo', 'inscripto', 'activo', 'inactivo', 'egresado', 'rechazado'];
    if (studentData.status && !validStatus.includes(studentData.status)) {
      errors.push(`Estado inválido. Valores válidos: ${validStatus.join(', ')}`);
    }
    
    // Validar vaccination_status
    const validVaccinationStatus = ['completo', 'incompleto', 'pendiente', 'no_informado'];
    if (studentData.vaccination_status && !validVaccinationStatus.includes(studentData.vaccination_status)) {
      errors.push(`Estado de vacunación inválido. Valores válidos: ${validVaccinationStatus.join(', ')}`);
    }
    
    if (errors.length > 0) {
      throw new AppError(`Errores de validación: ${errors.join('; ')}`, 400);
    }
    
    return true;
  }
  
  static validateForUpdate(studentData, studentId) {
    // Similar a validateForCreate pero opcional para algunos campos
    const errors = [];
    
    // Validar formato de fecha si se proporciona
    if (studentData.birth_date) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(studentData.birth_date)) {
        errors.push('Fecha de nacimiento inválida. Formato esperado: YYYY-MM-DD');
      }
    }
    
    // Validar DNI si se proporciona
    if (studentData.dni) {
      if (studentData.dni.length < 6 || studentData.dni.length > 15) {
        errors.push('DNI inválido. Debe tener entre 6 y 15 caracteres');
      }
    }
    
    // Validar campo status
    const validStatus = ['preinscripto', 'pendiente', 'approved', 'sorteo', 'inscripto', 'activo', 'inactivo', 'egresado', 'rechazado'];
    if (studentData.status && !validStatus.includes(studentData.status)) {
      errors.push(`Estado inválido. Valores válidos: ${validStatus.join(', ')}`);
    }
    
    // Validar vaccination_status
    const validVaccinationStatus = ['completo', 'incompleto', 'pendiente', 'no_informado'];
    if (studentData.vaccination_status && !validVaccinationStatus.includes(studentData.vaccination_status)) {
      errors.push(`Estado de vacunación inválido. Valores válidos: ${validVaccinationStatus.join(', ')}`);
    }
    
    if (errors.length > 0) {
      throw new AppError(`Errores de validación: ${errors.join('; ')}`, 400);
    }
    
    return true;
  }
}

module.exports = StudentValidator;
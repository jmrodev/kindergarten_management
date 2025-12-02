// utils/formValidation.js

// Validador genérico
class FormValidator {
  static validate(value, rules) {
    const errors = [];

    for (const rule of rules) {
      const result = this.applyRule(value, rule);
      if (!result.isValid) {
        errors.push(result.message);
      }
    }

    return errors;
  }

  static applyRule(value, rule) {
    switch (rule.type) {
      case 'required':
        return {
          isValid: value !== undefined && value !== null && value !== '',
          message: rule.message || 'Este campo es obligatorio'
        };
      case 'minLength':
        return {
          isValid: value && value.length >= rule.value,
          message: rule.message || `Mínimo ${rule.value} caracteres`
        };
      case 'maxLength':
        return {
          isValid: value && value.length <= rule.value,
          message: rule.message || `Máximo ${rule.value} caracteres`
        };
      case 'pattern':
        const regex = new RegExp(rule.value);
        return {
          isValid: value && regex.test(value),
          message: rule.message || 'Formato inválido'
        };
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return {
          isValid: value && emailRegex.test(value),
          message: rule.message || 'Email inválido'
        };
      case 'phone':
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return {
          isValid: value && phoneRegex.test(value.replace(/[\s\-\(\)]/g, '')),
          message: rule.message || 'Teléfono inválido'
        };
      case 'dni':
        const dniRegex = /^\d{7,8}$/;
        return {
          isValid: value && dniRegex.test(value),
          message: rule.message || 'DNI inválido (debe tener 7 u 8 dígitos)'
        };
      case 'date':
        const dateValue = new Date(value);
        const isValidDate = value && dateValue instanceof Date && !isNaN(dateValue);
        return {
          isValid: isValidDate && dateValue <= new Date(),
          message: rule.message || 'Fecha inválida o futura'
        };
      case 'minValue':
        return {
          isValid: value && Number(value) >= rule.value,
          message: rule.message || `Valor debe ser al menos ${rule.value}`
        };
      case 'maxValue':
        return {
          isValid: value && Number(value) <= rule.value,
          message: rule.message || `Valor debe ser como máximo ${rule.value}`
        };
      default:
        return { isValid: true, message: '' };
    }
  }

  // Validaciones comunes
  static required = { type: 'required' };
  
  static minLength = (value, message) => ({ type: 'minLength', value, message });
  
  static maxLength = (value, message) => ({ type: 'maxLength', value, message });
  
  static pattern = (value, message) => ({ type: 'pattern', value, message });
  
  static email = (message) => ({ type: 'email', message: message || 'Email inválido' });
  
  static phone = (message) => ({ type: 'phone', message: message || 'Teléfono inválido' });
  
  static dni = (message) => ({ type: 'dni', message: message || 'DNI inválido' });
  
  static date = (message) => ({ type: 'date', message: message || 'Fecha inválida' });
  
  static minValue = (value, message) => ({ type: 'minValue', value, message });
  
  static maxValue = (value, message) => ({ type: 'maxValue', value, message });
}

// Validador específico para estudiantes
class StudentFormValidator {
  static validateStudent(data) {
    const errors = {};

    // Validaciones de datos personales
    if (data.first_name) {
      errors.first_name = FormValidator.validate(data.first_name, [
        FormValidator.required,
        FormValidator.minLength(2),
        FormValidator.maxLength(50)
      ]);
    }

    if (data.paternal_surname) {
      errors.paternal_surname = FormValidator.validate(data.paternal_surname, [
        FormValidator.required,
        FormValidator.minLength(2),
        FormValidator.maxLength(50)
      ]);
    }

    if (data.dni) {
      errors.dni = FormValidator.validate(data.dni, [
        FormValidator.required,
        FormValidator.dni()
      ]);
    }

    if (data.birth_date) {
      errors.birth_date = FormValidator.validate(data.birth_date, [
        FormValidator.required,
        FormValidator.date()
      ]);
    }

    if (data.emergency_contact_phone) {
      errors.emergency_contact_phone = FormValidator.validate(data.emergency_contact_phone, [
        FormValidator.phone()
      ]);
    }

    if (data.pediatrician_phone) {
      errors.pediatrician_phone = FormValidator.validate(data.pediatrician_phone, [
        FormValidator.phone()
      ]);
    }

    if (data.dni) {
      errors.dni = FormValidator.validate(data.dni, [
        FormValidator.required,
        FormValidator.dni()
      ]);
    }

    // Filtrar campos sin errores
    const result = {};
    Object.keys(errors).forEach(key => {
      if (errors[key].length > 0) {
        result[key] = errors[key];
      }
    });

    return result;
  }
}

export { FormValidator, StudentFormValidator };
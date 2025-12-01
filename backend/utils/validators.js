// utils/validators.js
class Validators {
  // Validate email format
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate DNI format (assuming it's numeric and has specific length)
  static validateDNI(dni) {
    // Assuming DNI is numeric and has between 7-8 digits
    const dniRegex = /^\d{7,8}$/;
    return dniRegex.test(dni);
  }

  // Validate phone number format
  static validatePhone(phone) {
    // Allow digits, spaces, hyphens, and parentheses
    const phoneRegex = /^[\d\s\-\+\(\)]{7,15}$/;
    return phoneRegex.test(phone);
  }

  // Validate date format (YYYY-MM-DD)
  static validateDateFormat(dateString) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
      return false;
    }

    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date) && dateString === date.toISOString().split('T')[0];
  }

  // Validate time format (HH:MM or HH:MM:SS)
  static validateTimeFormat(timeString) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;
    return timeRegex.test(timeString);
  }

  // Validate if a value is in an array of allowed values
  static validateInArray(value, allowedValues) {
    return allowedValues.includes(value);
  }

  // Validate string length
  static validateStringLength(value, minLength, maxLength) {
    if (typeof value !== 'string') return false;
    return value.length >= minLength && value.length <= maxLength;
  }

  // Validate if a value is numeric
  static validateNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  // Validate if a value is an integer
  static validateInteger(value) {
    return Number.isInteger(Number(value));
  }

  // Validate boolean value
  static validateBoolean(value) {
    return typeof value === 'boolean' || value === 'true' || value === 'false' || value === '1' || value === '0';
  }

  // Validate required field
  static validateRequired(value) {
    if (value === undefined || value === null) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    return true;
  }

  // Validate URL format
  static validateURL(url) {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }

  // Validate UUID format
  static validateUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  // Validate if value is a valid enum value
  static validateEnum(value, enumValues) {
    return enumValues.includes(value);
  }

  // Validate if value is a positive number
  static validatePositiveNumber(value) {
    return this.validateNumeric(value) && parseFloat(value) > 0;
  }

  // Validate if value is a non-negative number
  static validateNonNegativeNumber(value) {
    return this.validateNumeric(value) && parseFloat(value) >= 0;
  }

  // Validate if value is a valid percentage (0-100)
  static validatePercentage(value) {
    return this.validateNumeric(value) && 
           parseFloat(value) >= 0 && 
           parseFloat(value) <= 100;
  }

  // Validate array of items against a validation function
  static validateArray(items, validateFn) {
    if (!Array.isArray(items)) return false;
    return items.every(item => validateFn(item));
  }

  // Validate if object has required properties
  static validateRequiredProperties(obj, requiredProps) {
    if (typeof obj !== 'object' || obj === null) return false;
    
    return requiredProps.every(prop => 
      obj.hasOwnProperty(prop) && this.validateRequired(obj[prop])
    );
  }

  // Validate object against a schema
  static validateSchema(obj, schema) {
    if (typeof obj !== 'object' || obj === null) return false;
    
    for (const [key, rules] of Object.entries(schema)) {
      const value = obj[key];
      
      if (rules.required && !this.validateRequired(value)) {
        return { valid: false, error: `Field '${key}' is required` };
      }
      
      if (value !== undefined && value !== null) {
        if (rules.type && typeof value !== rules.type) {
          return { valid: false, error: `Field '${key}' should be of type ${rules.type}` };
        }
        
        if (rules.minLength && !this.validateStringLength(value, rules.minLength, Infinity)) {
          return { valid: false, error: `Field '${key}' should be at least ${rules.minLength} characters long` };
        }
        
        if (rules.maxLength && !this.validateStringLength(value, 0, rules.maxLength)) {
          return { valid: false, error: `Field '${key}' should be no more than ${rules.maxLength} characters long` };
        }
        
        if (rules.email && !this.validateEmail(value)) {
          return { valid: false, error: `Field '${key}' should be a valid email` };
        }
        
        if (rules.numeric && !this.validateNumeric(value)) {
          return { valid: false, error: `Field '${key}' should be numeric` };
        }
        
        if (rules.enum && !this.validateEnum(value, rules.enum)) {
          return { valid: false, error: `Field '${key}' should be one of: ${rules.enum.join(', ')}` };
        }
      }
    }
    
    return { valid: true };
  }
}

module.exports = Validators;
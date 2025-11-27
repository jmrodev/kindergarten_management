// frontend/src/utils/formValidation.js

import { VALIDATION_PATTERNS, VALIDATION_MESSAGES, MAX_LENGTHS } from './validationPatterns';
import { sanitizeInput } from './sanitization';
import { validateSecurity } from './securityValidation';

/**
 * Hook personalizado para validación de formularios
 * Combina sanitización, validación de patrones y seguridad
 */

/**
 * Valida un campo individual
 * @param {string} value - Valor del campo
 * @param {Object} rules - Reglas de validación
 * @returns {Object} - { isValid: boolean, error: string, sanitizedValue: string }
 */
export const validateField = (value, rules = {}) => {
    const {
        required = false,
        pattern = null,
        patternType = null,
        maxLength = null,
        minLength = null,
        custom = null
    } = rules;
    
    // Sanitizar primero
    const sanitized = sanitizeInput(value, maxLength || 500);
    
    // Verificar requerido
    if (required && !sanitized) {
        return {
            isValid: false,
            error: VALIDATION_MESSAGES.required,
            sanitizedValue: sanitized
        };
    }
    
    // Si está vacío y no es requerido, es válido
    if (!sanitized && !required) {
        return {
            isValid: true,
            error: null,
            sanitizedValue: sanitized
        };
    }
    
    // Validación de seguridad
    const securityValidation = validateSecurity(sanitized, pattern);
    if (!securityValidation.isValid) {
        return {
            isValid: false,
            error: securityValidation.error,
            sanitizedValue: sanitized
        };
    }
    
    // Validación de longitud mínima
    if (minLength && sanitized.length < minLength) {
        return {
            isValid: false,
            error: `Mínimo ${minLength} caracteres`,
            sanitizedValue: sanitized
        };
    }
    
    // Validación de longitud máxima
    if (maxLength && sanitized.length > maxLength) {
        return {
            isValid: false,
            error: `Máximo ${maxLength} caracteres`,
            sanitizedValue: sanitized
        };
    }
    
    // Validación con patrón predefinido
    if (patternType && VALIDATION_PATTERNS[patternType]) {
        const regex = VALIDATION_PATTERNS[patternType];
        if (!regex.test(sanitized)) {
            return {
                isValid: false,
                error: VALIDATION_MESSAGES[patternType],
                sanitizedValue: sanitized
            };
        }
    }
    
    // Validación con patrón personalizado
    if (pattern && !pattern.test(sanitized)) {
        return {
            isValid: false,
            error: VALIDATION_MESSAGES.unsafe,
            sanitizedValue: sanitized
        };
    }
    
    // Validación personalizada
    if (custom && typeof custom === 'function') {
        const customResult = custom(sanitized);
        if (customResult !== true) {
            return {
                isValid: false,
                error: customResult,
                sanitizedValue: sanitized
            };
        }
    }
    
    return {
        isValid: true,
        error: null,
        sanitizedValue: sanitized
    };
};

/**
 * Valida un formulario completo
 * @param {Object} formData - Datos del formulario
 * @param {Object} validationRules - Reglas de validación por campo
 * @returns {Object} - { isValid: boolean, errors: {}, sanitizedData: {} }
 */
export const validateForm = (formData, validationRules) => {
    const errors = {};
    const sanitizedData = {};
    let isValid = true;
    
    for (const [fieldName, rules] of Object.entries(validationRules)) {
        const value = formData[fieldName];
        const validation = validateField(value, rules);
        
        if (!validation.isValid) {
            errors[fieldName] = validation.error;
            isValid = false;
        }
        
        sanitizedData[fieldName] = validation.sanitizedValue;
    }
    
    return { isValid, errors, sanitizedData };
};

/**
 * Reglas de validación predefinidas para campos comunes
 */
export const COMMON_VALIDATION_RULES = {
    name: {
        required: true,
        patternType: 'name',
        maxLength: MAX_LENGTHS.name
    },
    surname: {
        required: true,
        patternType: 'name',
        maxLength: MAX_LENGTHS.surname
    },
    alias: {
        required: false,
        patternType: 'name',
        maxLength: MAX_LENGTHS.alias
    },
    email: {
        required: false,
        patternType: 'email',
        maxLength: MAX_LENGTHS.email
    },
    phone: {
        required: true,
        patternType: 'phone',
        maxLength: MAX_LENGTHS.phone
    },
    address: {
        required: true,
        patternType: 'address',
        maxLength: MAX_LENGTHS.street
    },
    city: {
        required: true,
        patternType: 'name',
        maxLength: MAX_LENGTHS.city
    },
    postalCode: {
        required: false,
        patternType: 'postalCode',
        maxLength: MAX_LENGTHS.postalCode
    }
};

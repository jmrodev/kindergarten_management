// frontend/src/utils/index.js

/**
 * Exportación centralizada de todas las utilidades
 */

// Patrones y configuración
export {
    VALIDATION_PATTERNS,
    VALIDATION_MESSAGES,
    MAX_LENGTHS
} from './validationPatterns';

// Funciones de sanitización
export {
    sanitizeInput,
    sanitizeObject,
    escapeHtml,
    trimSpaces,
    normalizeText
} from './sanitization';

// Validaciones de seguridad
export {
    isSafeFromSQLInjection,
    isSafeFromPathTraversal,
    isSafeFromXSS,
    validateSecurity,
    validateFormSecurity
} from './securityValidation';

// Validación de formularios
export {
    validateField,
    validateForm,
    COMMON_VALIDATION_RULES
} from './formValidation';

// Conversiones de datos
export {
    formatDateForInput,
    formatDateForBackend,
    formatDateForDisplay,
    calculateAge,
    formatFullName,
    formatShortName,
    getInitials,
    formatAddress,
    formatShortAddress,
    formatPhone,
    studentFromBackend,
    studentToBackend,
    convertBigIntToNumber,
    stringifyWithBigInt
} from './dataConverters';

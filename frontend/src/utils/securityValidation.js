// frontend/src/utils/securityValidation.js

/**
 * Validaciones de seguridad para prevenir SQL Injection y otros ataques
 */

/**
 * Patrones SQL peligrosos
 */
const SQL_PATTERNS = [
    // Comandos SQL
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|TRUNCATE|REPLACE)\b)/gi,
    // Comentarios SQL
    /(--|\*|\/\*|\*\/)/g,
    // Operadores SQL sospechosos
    /(UNION|OR|AND)\s+[\d\w']/gi
];

/**
 * Patrones de Path Traversal
 */
const PATH_TRAVERSAL_PATTERNS = [
    /\.\.\//g,
    /\.\.\\/g,
    /%2e%2e%2f/gi,
    /%252e%252e%252f/gi
];

/**
 * Verifica si una entrada es segura contra SQL Injection
 * @param {string} value - Valor a validar
 * @returns {boolean} - true si es seguro
 */
export const isSafeFromSQLInjection = (value) => {
    if (!value || typeof value !== 'string') return true;
    
    const str = String(value);
    
    for (let pattern of SQL_PATTERNS) {
        if (pattern.test(str)) {
            console.warn('Posible intento de SQL Injection detectado:', str);
            return false;
        }
    }
    
    return true;
};

/**
 * Verifica si una entrada es segura contra Path Traversal
 * @param {string} value - Valor a validar
 * @returns {boolean} - true si es seguro
 */
export const isSafeFromPathTraversal = (value) => {
    if (!value || typeof value !== 'string') return true;
    
    const str = String(value);
    
    for (let pattern of PATH_TRAVERSAL_PATTERNS) {
        if (pattern.test(str)) {
            console.warn('Posible intento de Path Traversal detectado:', str);
            return false;
        }
    }
    
    return true;
};

/**
 * Verifica si una entrada es segura contra XSS
 * @param {string} value - Valor a validar
 * @returns {boolean} - true si es seguro
 */
export const isSafeFromXSS = (value) => {
    if (!value || typeof value !== 'string') return true;
    
    const str = String(value);
    
    // Detectar tags HTML peligrosos
    const dangerousTags = /<(script|iframe|object|embed|applet|meta|link|style)/gi;
    if (dangerousTags.test(str)) {
        console.warn('Posible intento de XSS detectado:', str);
        return false;
    }
    
    // Detectar atributos de eventos
    const eventAttributes = /on\w+\s*=/gi;
    if (eventAttributes.test(str)) {
        console.warn('Atributos de eventos detectados:', str);
        return false;
    }
    
    // Detectar javascript: en URLs
    if (/javascript:/gi.test(str)) {
        console.warn('javascript: protocol detectado:', str);
        return false;
    }
    
    return true;
};

/**
 * Validación general de seguridad
 * @param {string} value - Valor a validar
 * @param {RegExp} pattern - Patrón regex opcional
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateSecurity = (value, pattern = null) => {
    if (!value) {
        return { isValid: true, error: null };
    }
    
    // Verificar SQL Injection
    if (!isSafeFromSQLInjection(value)) {
        return { 
            isValid: false, 
            error: 'Entrada no válida. Contiene caracteres no permitidos.' 
        };
    }
    
    // Verificar XSS
    if (!isSafeFromXSS(value)) {
        return { 
            isValid: false, 
            error: 'Entrada no válida. Contiene código peligroso.' 
        };
    }
    
    // Verificar Path Traversal
    if (!isSafeFromPathTraversal(value)) {
        return { 
            isValid: false, 
            error: 'Entrada no válida. Contiene ruta no permitida.' 
        };
    }
    
    // Validar con patrón específico
    if (pattern && !pattern.test(value)) {
        return { 
            isValid: false, 
            error: 'Formato inválido.' 
        };
    }
    
    return { isValid: true, error: null };
};

/**
 * Valida múltiples campos de un formulario
 * @param {Object} fields - Objeto con campos a validar { fieldName: { value, pattern } }
 * @returns {Object} - Objeto con errores { fieldName: errorMessage }
 */
export const validateFormSecurity = (fields) => {
    const errors = {};
    
    for (const [fieldName, fieldData] of Object.entries(fields)) {
        const { value, pattern } = fieldData;
        const validation = validateSecurity(value, pattern);
        
        if (!validation.isValid) {
            errors[fieldName] = validation.error;
        }
    }
    
    return errors;
};

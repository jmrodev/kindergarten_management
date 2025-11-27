// frontend/src/utils/sanitization.js

/**
 * Utilidades de sanitización para prevenir XSS y otros ataques
 */

/**
 * Sanitiza entrada de texto removiendo tags HTML y scripts
 * @param {string} value - Valor a sanitizar
 * @param {number} maxLength - Longitud máxima permitida (default: 500)
 * @returns {string} - Valor sanitizado
 */
export const sanitizeInput = (value, maxLength = 500) => {
    if (typeof value !== 'string') return value;
    
    // Remover tags HTML y scripts
    let sanitized = value
        // Remover scripts completos
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        // Remover iframes
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        // Remover todos los tags HTML
        .replace(/<[^>]*>/g, '')
        // Remover javascript: en URLs
        .replace(/javascript:/gi, '')
        // Remover atributos de eventos (onclick, onerror, etc)
        .replace(/on\w+\s*=/gi, '');
    
    // Limitar longitud
    return sanitized.slice(0, maxLength);
};

/**
 * Sanitiza un objeto completo recursivamente
 * @param {Object} obj - Objeto a sanitizar
 * @param {number} maxLength - Longitud máxima por campo
 * @returns {Object} - Objeto sanitizado
 */
export const sanitizeObject = (obj, maxLength = 500) => {
    if (typeof obj !== 'object' || obj === null) {
        return sanitizeInput(obj, maxLength);
    }
    
    const sanitized = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                sanitized[key] = sanitizeObject(obj[key], maxLength);
            } else {
                sanitized[key] = sanitizeInput(obj[key], maxLength);
            }
        }
    }
    return sanitized;
};

/**
 * Escapa caracteres HTML especiales
 * @param {string} str - String a escapar
 * @returns {string} - String escapado
 */
export const escapeHtml = (str) => {
    if (typeof str !== 'string') return str;
    
    const htmlEscapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
    };
    
    return str.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char]);
};

/**
 * Limpia espacios en blanco extras
 * @param {string} str - String a limpiar
 * @returns {string} - String limpio
 */
export const trimSpaces = (str) => {
    if (typeof str !== 'string') return str;
    return str.trim().replace(/\s+/g, ' ');
};

/**
 * Normaliza texto eliminando acentos (útil para búsquedas)
 * @param {string} str - String a normalizar
 * @returns {string} - String normalizado
 */
export const normalizeText = (str) => {
    if (typeof str !== 'string') return str;
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
};

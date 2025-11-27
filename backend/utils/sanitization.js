// backend/utils/sanitization.js

/**
 * Utilidades de sanitización para prevenir inyecciones
 * Complementa las validaciones del frontend
 */

/**
 * Escapa caracteres HTML peligrosos
 * @param {string} str - Cadena a escapar
 * @returns {string} Cadena escapada
 */
const escapeHtml = (str) => {
    if (typeof str !== 'string') return str;
    const htmlEscapes = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
    };
    return str.replace(/[&<>"'\/]/g, (char) => htmlEscapes[char]);
};

/**
 * Elimina caracteres potencialmente peligrosos para SQL
 * (Nota: Usar prepared statements es la mejor defensa)
 * @param {string} str - Cadena a limpiar
 * @returns {string} Cadena sanitizada
 */
const sanitizeSql = (str) => {
    if (typeof str !== 'string') return str;
    // Elimina comillas simples dobles, punto y coma aislados, y comentarios SQL
    return str
        .replace(/'/g, "''") // Escapa comillas simples
        .replace(/;/g, '') // Elimina punto y coma
        .replace(/--/g, '') // Elimina comentarios de línea
        .replace(/\/\*/g, '') // Elimina inicio de comentarios de bloque
        .replace(/\*\//g, ''); // Elimina fin de comentarios de bloque
};

/**
 * Limpia caracteres de control y espacios múltiples
 * @param {string} str - Cadena a limpiar
 * @returns {string} Cadena limpia
 */
const sanitizeWhitespace = (str) => {
    if (typeof str !== 'string') return str;
    return str
        .replace(/[\x00-\x1F\x7F]/g, '') // Elimina caracteres de control
        .replace(/\s+/g, ' ') // Reemplaza múltiples espacios por uno
        .trim();
};

/**
 * Sanitiza un objeto completo recursivamente
 * @param {any} obj - Objeto a sanitizar
 * @param {Function} sanitizer - Función de sanitización
 * @returns {any} Objeto sanitizado
 */
const sanitizeObject = (obj, sanitizer = sanitizeWhitespace) => {
    if (typeof obj === 'string') {
        return sanitizer(obj);
    }
    
    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item, sanitizer));
    }
    
    if (obj !== null && typeof obj === 'object') {
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
            sanitized[key] = sanitizeObject(value, sanitizer);
        }
        return sanitized;
    }
    
    return obj;
};

module.exports = {
    escapeHtml,
    sanitizeSql,
    sanitizeWhitespace,
    sanitizeObject
};

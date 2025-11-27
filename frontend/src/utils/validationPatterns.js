// frontend/src/utils/validationPatterns.js

/**
 * Patrones de validación con expresiones regulares
 * Reutilizables en toda la aplicación
 */

export const VALIDATION_PATTERNS = {
    // Solo letras, espacios, tildes y ñ (nombres en español)
    name: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
    
    // Letras, números, espacios, guiones, puntos y comas (direcciones)
    address: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s,.#º\-]+$/,
    
    // Solo números y algunos caracteres especiales permitidos (teléfonos)
    phone: /^[\d\s()\-]+$/,
    
    // HTML5 pattern attribute (no soporta flags, sin barras) - CORREGIDO
    phoneHtml: '[0-9\\s()\\-]+',
    // Para usar en pattern attribute directamente
    phonePattern: '\\d[\\d\\s()\\-]*',
    
    // Código postal (números y letras)
    postalCode: /^[a-zA-Z0-9\s\-]+$/,
    
    // Email básico
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    
    // Solo números
    numeric: /^\d+$/,
    
    // Alfanumérico
    alphanumeric: /^[a-zA-Z0-9]+$/,
    
    // Fecha formato YYYY-MM-DD
    date: /^\d{4}-\d{2}-\d{2}$/,
    
    // URL básica
    url: /^https?:\/\/.+/
};

/**
 * Mensajes de error por patrón
 */
export const VALIDATION_MESSAGES = {
    name: 'Solo se permiten letras y espacios',
    address: 'Solo se permiten letras, números y caracteres básicos (#, º, -, .)',
    phone: 'Solo se permiten números, espacios, guiones y paréntesis',
    postalCode: 'Solo se permiten números, letras y guiones',
    email: 'Formato de email inválido',
    numeric: 'Solo se permiten números',
    alphanumeric: 'Solo se permiten letras y números',
    date: 'Formato de fecha inválido (YYYY-MM-DD)',
    url: 'Formato de URL inválido',
    required: 'Este campo es obligatorio',
    maxLength: 'Ha excedido el límite de caracteres',
    unsafe: 'Entrada no válida. Solo se permiten caracteres seguros.'
};

/**
 * Límites de longitud por tipo de campo
 */
export const MAX_LENGTHS = {
    name: 100,
    surname: 100,
    alias: 50,
    street: 200,
    streetNumber: 20,
    city: 100,
    province: 100,
    postalCode: 20,
    phone: 20,
    email: 100,
    relation: 50,
    description: 500,
    comment: 1000
};

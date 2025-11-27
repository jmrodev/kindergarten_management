/**
 * Utilidades para convertir y transformar datos entre backend y frontend
 * @module dataConverters
 */

// ============================================================================
// CONVERSIONES DE FECHAS
// ============================================================================

/**
 * Convierte una fecha ISO a formato yyyy-MM-dd para inputs de tipo date
 * @param {string|Date} dateString - Fecha en formato ISO o objeto Date
 * @returns {string} Fecha en formato yyyy-MM-dd
 * @example
 * formatDateForInput('2019-03-15T03:00:00.000Z') // '2019-03-15'
 */
export const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    try {
        // Si es un string en formato ISO, extraer la fecha directamente
        if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}/)) {
            return dateString.split('T')[0];
        }
        
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        
        // Usar UTC para evitar problemas de zona horaria
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
};

/**
 * Convierte una fecha de input (yyyy-MM-dd) a formato ISO para el backend
 * @param {string} dateString - Fecha en formato yyyy-MM-dd
 * @returns {string} Fecha en formato ISO
 * @example
 * formatDateForBackend('2019-03-15') // '2019-03-15T00:00:00.000Z'
 */
export const formatDateForBackend = (dateString) => {
    if (!dateString) return null;
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return null;
        
        return date.toISOString();
    } catch (error) {
        console.error('Error formatting date for backend:', error);
        return null;
    }
};

/**
 * Formatea una fecha para mostrar en español
 * @param {string|Date} dateString - Fecha en formato ISO o objeto Date
 * @param {boolean} includeTime - Si incluir la hora
 * @returns {string} Fecha formateada
 * @example
 * formatDateForDisplay('2019-03-15T03:00:00.000Z') // '15/03/2019'
 */
export const formatDateForDisplay = (dateString, includeTime = false) => {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        let formatted = `${day}/${month}/${year}`;
        
        if (includeTime) {
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            formatted += ` ${hours}:${minutes}`;
        }
        
        return formatted;
    } catch (error) {
        console.error('Error formatting date for display:', error);
        return '';
    }
};

/**
 * Calcula la edad a partir de una fecha de nacimiento
 * @param {string|Date} birthDate - Fecha de nacimiento
 * @returns {number} Edad en años
 * @example
 * calculateAge('2019-03-15') // 5 (aproximadamente)
 */
export const calculateAge = (birthDate) => {
    if (!birthDate) return 0;
    
    try {
        const birth = new Date(birthDate);
        const today = new Date();
        
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    } catch (error) {
        console.error('Error calculating age:', error);
        return 0;
    }
};

// ============================================================================
// CONVERSIONES DE NOMBRES
// ============================================================================

/**
 * Formatea un nombre completo a partir de sus partes
 * @param {Object} data - Objeto con los datos del nombre
 * @param {string} data.nombre - Primer nombre
 * @param {string} data.segundoNombre - Segundo nombre (opcional)
 * @param {string} data.tercerNombre - Tercer nombre (opcional)
 * @param {string} data.apellidoPaterno - Apellido paterno
 * @param {string} data.apellidoMaterno - Apellido materno (opcional)
 * @returns {string} Nombre completo formateado
 * @example
 * formatFullName({ nombre: 'Juan', apellidoPaterno: 'Pérez' }) // 'Juan Pérez'
 */
export const formatFullName = (data) => {
    const parts = [
        data.nombre,
        data.segundoNombre,
        data.tercerNombre,
        data.apellidoPaterno,
        data.apellidoMaterno
    ].filter(Boolean);
    
    return parts.join(' ').trim();
};

/**
 * Formatea un nombre corto (solo primer nombre y apellido paterno)
 * @param {Object} data - Objeto con los datos del nombre
 * @returns {string} Nombre corto
 * @example
 * formatShortName({ nombre: 'Juan', apellidoPaterno: 'Pérez' }) // 'Juan Pérez'
 */
export const formatShortName = (data) => {
    const parts = [data.nombre, data.apellidoPaterno].filter(Boolean);
    return parts.join(' ').trim();
};

/**
 * Obtiene las iniciales de un nombre
 * @param {Object} data - Objeto con los datos del nombre
 * @returns {string} Iniciales
 * @example
 * getInitials({ nombre: 'Juan', apellidoPaterno: 'Pérez' }) // 'JP'
 */
export const getInitials = (data) => {
    const firstName = data.nombre || '';
    const lastName = data.apellidoPaterno || '';
    
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    
    return `${firstInitial}${lastInitial}`;
};

// ============================================================================
// CONVERSIONES DE DIRECCIONES
// ============================================================================

/**
 * Formatea una dirección completa
 * @param {Object} direccion - Objeto con los datos de la dirección
 * @returns {string} Dirección formateada
 * @example
 * formatAddress({ calle: 'San Martín', numero: '123', ciudad: 'Tandil' })
 * // 'San Martín 123, Tandil'
 */
export const formatAddress = (direccion) => {
    if (!direccion) return '';
    
    const parts = [];
    
    if (direccion.calle && direccion.numero) {
        parts.push(`${direccion.calle} ${direccion.numero}`);
    } else if (direccion.calle) {
        parts.push(direccion.calle);
    }
    
    if (direccion.ciudad) {
        parts.push(direccion.ciudad);
    }
    
    if (direccion.provincia) {
        parts.push(direccion.provincia);
    }
    
    if (direccion.codigoPostal) {
        parts.push(`(${direccion.codigoPostal})`);
    }
    
    return parts.join(', ');
};

/**
 * Formatea una dirección corta (calle y número)
 * @param {Object} direccion - Objeto con los datos de la dirección
 * @returns {string} Dirección corta
 */
export const formatShortAddress = (direccion) => {
    if (!direccion) return '';
    
    if (direccion.calle && direccion.numero) {
        return `${direccion.calle} ${direccion.numero}`;
    }
    
    return direccion.calle || '';
};

// ============================================================================
// CONVERSIONES DE TELÉFONOS
// ============================================================================

/**
 * Formatea un número de teléfono argentino
 * @param {string} phone - Número de teléfono
 * @returns {string} Teléfono formateado
 * @example
 * formatPhone('02494523129') // '(02494) 523-129'
 */
export const formatPhone = (phone) => {
    if (!phone) return '';
    
    // Remover caracteres no numéricos
    const cleaned = phone.replace(/\D/g, '');
    
    // Formato argentino: (código de área) número
    if (cleaned.length === 11) {
        return `(${cleaned.slice(0, 5)}) ${cleaned.slice(5, 8)}-${cleaned.slice(8)}`;
    }
    
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    
    // Devolver sin formato si no coincide con patrones conocidos
    return phone;
};

// ============================================================================
// CONVERSIONES DE OBJETOS (BACKEND ↔ FRONTEND)
// ============================================================================

/**
 * Convierte un alumno del formato backend al formato frontend
 * @param {Object} student - Alumno en formato backend
 * @returns {Object} Alumno en formato frontend
 */
export const studentFromBackend = (student) => {
    if (!student) return null;
    
    return {
        id: student.id,
        nombre: student.first_name || student.nombre || '',
        segundoNombre: student.middle_name_optional || student.segundoNombre || '',
        tercerNombre: student.third_name_optional || student.tercerNombre || '',
        apellidoPaterno: student.paternal_surname || student.apellidoPaterno || '',
        apellidoMaterno: student.maternal_surname || student.apellidoMaterno || '',
        alias: student.nickname_optional || student.alias || '',
        fechaNacimiento: student.birth_date || student.fechaNacimiento || '',
        turno: student.shift || student.turno || '',
        direccion: student.address || student.direccion || null,
        contactoEmergencia: student.emergency_contact || student.contactoEmergencia || null,
        sala: student.classroom || student.sala || null
    };
};

/**
 * Convierte un alumno del formato frontend al formato backend
 * @param {Object} student - Alumno en formato frontend
 * @returns {Object} Alumno en formato backend
 */
export const studentToBackend = (student) => {
    if (!student) return null;
    
    const data = {
        first_name: student.nombre,
        middle_name_optional: student.segundoNombre || null,
        third_name_optional: student.tercerNombre || null,
        paternal_surname: student.apellidoPaterno,
        maternal_surname: student.apellidoMaterno,
        nickname_optional: student.alias || null,
        birth_date: student.fechaNacimiento,
        shift: student.turno,
        address: student.direccion,
        emergency_contact: student.contactoEmergencia,
        classroom_id: student.sala?.id || null
    };
    
    if (student.id) {
        data.id = student.id;
    }
    
    return data;
};

// ============================================================================
// UTILIDADES DE BIGINT
// ============================================================================

/**
 * Convierte BigInt a número normal para JSON
 * Se usa cuando el backend devuelve BigInt que no puede serializarse
 * @param {Object} obj - Objeto con posibles BigInt
 * @returns {Object} Objeto con BigInt convertidos a números
 */
export const convertBigIntToNumber = (obj) => {
    if (obj === null || obj === undefined) return obj;
    
    if (typeof obj === 'bigint') {
        return Number(obj);
    }
    
    if (Array.isArray(obj)) {
        return obj.map(convertBigIntToNumber);
    }
    
    if (typeof obj === 'object') {
        const converted = {};
        for (const [key, value] of Object.entries(obj)) {
            converted[key] = convertBigIntToNumber(value);
        }
        return converted;
    }
    
    return obj;
};

/**
 * Serializa un objeto que puede contener BigInt a JSON
 * @param {Object} obj - Objeto a serializar
 * @returns {string} JSON string
 */
export const stringifyWithBigInt = (obj) => {
    return JSON.stringify(obj, (key, value) =>
        typeof value === 'bigint' ? Number(value) : value
    );
};

// ============================================================================
// EXPORT POR DEFECTO
// ============================================================================

export default {
    // Fechas
    formatDateForInput,
    formatDateForBackend,
    formatDateForDisplay,
    calculateAge,
    
    // Nombres
    formatFullName,
    formatShortName,
    getInitials,
    
    // Direcciones
    formatAddress,
    formatShortAddress,
    
    // Teléfonos
    formatPhone,
    
    // Conversiones backend/frontend
    studentFromBackend,
    studentToBackend,
    
    // BigInt
    convertBigIntToNumber,
    stringifyWithBigInt
};

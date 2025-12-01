// backend/utils/serialization.js

/**
 * Utilidades para serialización de datos
 * Especialmente para manejar BigInt de MariaDB/MySQL
 */

/**
 * Convierte BigInt a Number y maneja fechas en objetos para serialización JSON
 * @param {any} obj - Objeto a serializar
 * @returns {any} Objeto con BigInt convertidos a Number y fechas formateadas
 */
const serializeBigInt = (obj) => {
    // Función auxiliar para clonar profundamente y convertir tipos
    const deepCloneAndConvert = (item) => {
        if (item === null || item === undefined) {
            return item;
        }

        // Convertir BigInt a Number
        if (typeof item === 'bigint') {
            return Number(item);
        }

        // Convertir objetos Date a cadenas ISO
        if (item instanceof Date) {
            return item.toISOString().split('T')[0]; // Solo la parte de la fecha
        }

        // Verificar si es un objeto (no array ni Date)
        if (typeof item === 'object') {
            if (Array.isArray(item)) {
                return item.map(deepCloneAndConvert);
            } else {
                const cloned = {};
                for (const key in item) {
                    if (item.hasOwnProperty(key)) {
                        const value = item[key];
                        // Convertir undefined a null para evitar problemas de serialización
                        cloned[key] = value === undefined ? null : deepCloneAndConvert(value);
                    }
                }
                return cloned;
            }
        }

        return item;
    };

    try {
        return deepCloneAndConvert(obj);
    } catch (error) {
        // Si hay un error en la serialización, devolver el objeto original
        console.warn('Serialization error, returning original object:', error.message);
        return obj;
    }
};

/**
 * Middleware para serializar respuestas JSON automáticamente
 * Maneja BigInt y otros tipos especiales
 */
const jsonSerializer = (req, res, next) => {
    const originalJson = res.json.bind(res);
    
    res.json = function(data) {
        const serialized = serializeBigInt(data);
        return originalJson(serialized);
    };
    
    next();
};

module.exports = {
    serializeBigInt,
    jsonSerializer
};

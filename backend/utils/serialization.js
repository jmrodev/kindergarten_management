// backend/utils/serialization.js

/**
 * Utilidades para serialización de datos
 * Especialmente para manejar BigInt de MariaDB/MySQL
 */

/**
 * Convierte BigInt a Number en objetos para serialización JSON
 * @param {any} obj - Objeto a serializar
 * @returns {any} Objeto con BigInt convertidos a Number
 */
const serializeBigInt = (obj) => {
    return JSON.parse(JSON.stringify(obj, (key, value) =>
        typeof value === 'bigint' ? Number(value) : value
    ));
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

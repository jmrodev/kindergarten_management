require('dotenv').config(); // Load environment variables from .env file

const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'kindergarten_user',
    password: process.env.DB_PASSWORD || 'kindergarten_password',
    database: process.env.DB_NAME || 'kindergarten_db',
    connectionLimit: 10, // Aumentado para mejor rendimiento
    acquireTimeout: 60000, // Tiempo de espera para adquirir conexión (60 segundos)
    timeout: 60000, // Tiempo de espera general (60 segundos)
    reconnect: true // Permitir reconexión automática
});

async function getConnection() {
    try {
        const conn = await pool.getConnection();
        return conn;
    } catch (err) {
        console.error("Error getting database connection:", err);
        throw err;
    }
}

module.exports = {
    getConnection,
    pool
};

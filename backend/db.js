require('dotenv').config(); // Load environment variables from .env file

const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'kindergarten_user',
    password: process.env.DB_PASSWORD || 'kindergarten_password',
    database: process.env.DB_NAME || 'kindergarten_db',
    connectionLimit: 5 // Adjust as needed
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

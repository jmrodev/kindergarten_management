// backend/db.js
const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root', // Replaced with provided username
    password: 'jmro1975', // Replaced with provided password
    database: 'kindergarten_db',
    connectionLimit: 5,
    bigIntAsNumber: true
});

async function getConnection() {
    try {
        const conn = await pool.getConnection();
        console.log("Connected to MariaDB!");
        return conn;
    } catch (err) {
        console.error("Error connecting to MariaDB:", err);
        throw err;
    }
}

module.exports = {
    getConnection,
    pool
};

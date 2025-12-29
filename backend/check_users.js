require('dotenv').config();
const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5
});

async function checkUsers() {
    let conn;
    try {
        console.log("Connecting to DB...");
        conn = await pool.getConnection();
        const users = await conn.query("SELECT id, email, role, first_name, password FROM users");
        console.log("Users found:", users);
    } catch (err) {
        console.error("Error:", err);
    } finally {
        if (conn) conn.release();
        process.exit(0);
    }
}

checkUsers();

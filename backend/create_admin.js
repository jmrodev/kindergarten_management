require('dotenv').config();
const mariadb = require('mariadb');
const bcrypt = require('bcryptjs');

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5
});

async function createAdmin() {
    let conn;
    try {
        console.log("Connecting to DB...");
        conn = await pool.getConnection();

        // 1. Ensure Roles Exist
        const accessLevl = await conn.query("INSERT IGNORE INTO access_level (access_name, description) VALUES ('Admin', 'Full Access')");
        const accessLevelId = (await conn.query("SELECT id FROM access_level WHERE access_name='Admin'"))[0].id;

        await conn.query("INSERT IGNORE INTO role (role_name, access_level_id) VALUES ('Administrator', ?)", [accessLevelId]);

        const roleRows = await conn.query("SELECT id FROM role WHERE role_name = 'Administrator'");
        const roleId = roleRows[0].id;

        // 2. Create Admin User
        const email = 'admin@kindergarten.com';
        const password = 'admin123'; // User requested this password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if exists
        const existing = await conn.query("SELECT id FROM staff WHERE email = ?", [email]);

        if (existing.length > 0) {
            console.log("Admin user exists. Updating password...");
            await conn.query("UPDATE staff SET password_hash = ? WHERE email = ?", [hashedPassword, email]);
        } else {
            console.log("Creating new admin user...");
            await conn.query(`
                INSERT INTO staff (first_name, paternal_surname, email, password_hash, role_id, is_active)
                VALUES ('Admin', 'System', ?, ?, ?, TRUE)
            `, [email, hashedPassword, roleId]);
        }

        console.log(`Admin user ready: ${email} / ${password}`);

    } catch (err) {
        console.error("Error:", err);
    } finally {
        if (conn) conn.release();
        process.exit(0);
    }
}

createAdmin();

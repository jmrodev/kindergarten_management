const mariadb = require('mariadb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = mariadb.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'kindergarten_db'
});

async function checkAndFixUser() {
    let conn;
    try {
        conn = await pool.getConnection();
        const email = 'juanmarcelo.rodrigueztandil@gmail.com';
        const password = 'juan1975'; // The password user is trying

        console.log(`Checking user: ${email}`);

        const rows = await conn.query('SELECT * FROM parent_portal_users WHERE email = ?', [email]);

        if (rows.length === 0) {
            console.log('User not found!');
        } else {
            console.log('User found. Checking password...');
            const user = rows[0];
            const isMatch = await bcrypt.compare(password, user.password_hash);

            if (isMatch) {
                console.log('Password matches current hash. Credentials ARE valid.');
            } else {
                console.log('Password does NOT match. Updating hash...');
                const newHash = await bcrypt.hash(password, 10);
                await conn.query('UPDATE parent_portal_users SET password_hash = ? WHERE id = ?', [newHash, user.id]);
                console.log('Password updated successfully.');
            }
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        if (conn) conn.release();
        process.exit();
    }
}

checkAndFixUser();

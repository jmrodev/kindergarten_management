const mariadb = require('mariadb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function debugPersistence() {
    let conn;
    try {
        const pool = mariadb.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            connectionLimit: 5
        });

        conn = await pool.getConnection();
        console.log('Connected to database');

        // 1. Check Parent Portal User
        const userId = 2; // From logs
        const user = await conn.query('SELECT * FROM parent_portal_users WHERE id = ?', [userId]);
        console.log('Parent User:', user);

        // 2. Check Guardians linked to this user
        const guardians = await conn.query('SELECT * FROM guardian WHERE parent_portal_user_id = ?', [userId]);
        console.log('Guardians linked to user:', guardians);

        if (guardians.length > 0) {
            for (const g of guardians) {
                // 3. Check Student-Guardian links
                const sg = await conn.query('SELECT * FROM student_guardian WHERE guardian_id = ?', [g.id]);
                console.log(`Student-Guardian links for Guardian ${g.id}:`, sg);

                for (const link of sg) {
                    // 4. Check Students
                    const student = await conn.query('SELECT * FROM student WHERE id = ?', [link.student_id]);
                    console.log(`Student ${link.student_id}:`, student);
                }
            }
        } else {
            console.log('!! No guardians found for this parent user !!');

            // Search for guardians with similar name just in case
            if (user.length > 0) {
                const similar = await conn.query('SELECT * FROM guardian WHERE email = ?', [user[0].email]);
                console.log('Guardians with same email (but maybe not linked):', similar);
            }
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        if (conn) conn.end();
        process.exit(0);
    }
}

debugPersistence();

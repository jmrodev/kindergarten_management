// backend/init_db_full_schema.js
const mariadb = require('mariadb');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs'); // For hashing admin password

const DB_NAME = 'kindergarten_db';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // Default admin password
const ADMIN_FIRST_NAME = 'Admin';
const ADMIN_LAST_NAME = 'User';

// Connection pool for administrative tasks (without specifying a database initially)
const adminPool = mariadb.createPool({
    host: 'localhost',
    user: 'root', // Or a user with CREATE/DROP DATABASE privileges
    password: 'jmro1975', // Replace with your root password
    connectionLimit: 1
});

// Connection pool for the application (with the specific database)
const appPool = mariadb.createPool({
    host: 'localhost',
    user: 'root', // Or a user with privileges on kindergarten_db
    password: 'jmro1975', // Replace with your root password
    database: DB_NAME,
    connectionLimit: 5
});

async function executeSqlFile(conn, filePath) {
    const sql = await fs.readFile(filePath, 'utf8');
    // Split by semicolon, but be careful with semicolons inside comments or strings
    const statements = sql.split(/;\s*$/m).filter(s => s.trim().length > 0);
    for (const statement of statements) {
        if (statement.trim().length > 0) {
            await conn.query(statement);
        }
    }
}

async function initDatabaseFullSchema() {
    let conn;
    try {
        console.log("Starting full database schema initialization...");

        // 1. Connect as admin to drop/create database
        conn = await adminPool.getConnection();
        console.log("Connected to MariaDB as admin.");

        console.log(`Dropping database ${DB_NAME} if it exists...`);
        await conn.query(`DROP DATABASE IF EXISTS ${DB_NAME}`);
        console.log(`Database ${DB_NAME} dropped.`);

        console.log(`Creating database ${DB_NAME}...`);
        await conn.query(`CREATE DATABASE ${DB_NAME}`);
        console.log(`Database ${DB_NAME} created.`);

        conn.release(); // Release admin connection
        conn = null;

        // 2. Connect to the newly created database for schema and data
        console.log(`Connecting to ${DB_NAME} for schema and admin user insertion...`);
        conn = await appPool.getConnection();
        console.log(`Connected to ${DB_NAME}.`);

        // Execute base schema
        console.log("Executing db/schema.sql...");
        await executeSqlFile(conn, path.join(__dirname, '../db/schema.sql'));
        console.log("db/schema.sql executed successfully.");

        // Execute parent portal schema
        console.log("Executing db/parent_portal_schema.sql...");
        await executeSqlFile(conn, path.join(__dirname, '../db/parent_portal_schema.sql'));
        console.log("db/parent_portal_schema.sql executed successfully.");

        // Execute migration for complete inscriptions (includes staff password_hash)
        console.log("Executing db/migration_inscripciones_completas.sql...");
        await executeSqlFile(conn, path.join(__dirname, '../db/migration_inscripciones_completas.sql'));
        console.log("db/migration_inscripciones_completas.sql executed successfully.");

        // 3. Create Admin User
        console.log("Creating default admin user...");

        // Ensure access_level 'Admin' exists
        await conn.query("INSERT IGNORE INTO access_level (access_name, description) VALUES (?, ?)", ['Admin', 'Full access to all features']);
        const adminAccessId = (await conn.query("SELECT id FROM access_level WHERE access_name = 'Admin'"))[0].id;

        // Ensure role 'Administrator' exists
        await conn.query("INSERT IGNORE INTO role (role_name, access_level_id) VALUES (?, ?)", ['Administrator', adminAccessId]);
        const adminRoleId = (await conn.query("SELECT id FROM role WHERE role_name = 'Administrator'"))[0].id;

        // Hash admin password
        const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

        // Insert admin staff user
        await conn.query(
            `INSERT INTO staff (first_name, paternal_surname, email, password_hash, role_id, is_active)
             VALUES (?, ?, ?, ?, ?, TRUE)
             ON DUPLICATE KEY UPDATE
                first_name = VALUES(first_name),
                paternal_surname = VALUES(paternal_surname),
                password_hash = VALUES(password_hash),
                role_id = VALUES(role_id),
                is_active = VALUES(is_active)`,
            [ADMIN_FIRST_NAME, ADMIN_LAST_NAME, ADMIN_EMAIL, passwordHash, adminRoleId]
        );
        console.log(`Default admin user created/updated: ${ADMIN_EMAIL}`);

        console.log("Full database schema initialization complete!");
    } catch (error) {
        console.error("Error during full database schema initialization:", error);
        process.exit(1);
    } finally {
        if (conn) conn.release();
        adminPool.end();
        appPool.end();
    }
}

initDatabaseFullSchema();

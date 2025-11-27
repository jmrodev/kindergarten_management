// backend/init_db.js
const mariadb = require('mariadb');
const fs = require('fs').promises;
const path = require('path');

const DB_NAME = 'kindergarten_db';

// Connection pool for administrative tasks (without specifying a database initially)
const adminPool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'jmro1975',
    connectionLimit: 1 // Only need one connection for admin tasks
});

// Connection pool for the application (with the specific database)
const appPool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'jmro1975',
    database: DB_NAME,
    connectionLimit: 5
});

async function executeQuery(pool, sql, params = []) {
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.query(sql, params);
        return res;
    } finally {
        if (conn) conn.release();
    }
}

async function initDatabase() {
    let conn;
    try {
        console.log("Starting database initialization...");

        // 1. Connect as admin to drop/create database
        conn = await adminPool.getConnection();
        console.log("Connected to MariaDB as admin.");

        // Drop database if it exists
        console.log(`Dropping database ${DB_NAME} if it exists...`);
        await conn.query(`DROP DATABASE IF EXISTS ${DB_NAME}`);
        console.log(`Database ${DB_NAME} dropped.`);

        // Create database
        console.log(`Creating database ${DB_NAME}...`);
        await conn.query(`CREATE DATABASE ${DB_NAME}`);
        console.log(`Database ${DB_NAME} created.`);

        // Release admin connection
        conn.release();
        conn = null; // Ensure conn is null before next getConnection

        // 2. Connect to the newly created database for schema and data
        console.log(`Connecting to ${DB_NAME} for schema and data insertion...`);
        conn = await appPool.getConnection();
        console.log(`Connected to ${DB_NAME}.`);

        // Execute schema.sql
        console.log("Executing schema.sql...");
        const schemaSql = await fs.readFile(path.join(__dirname, '../db/schema.sql'), 'utf8');
        // Split by semicolon, but be careful with semicolons inside comments or strings
        const statements = schemaSql.split(/;\s*$/m).filter(s => s.trim().length > 0);
        for (const statement of statements) {
            await conn.query(statement);
        }
        console.log("Schema executed successfully.");

        // Populate with sample data
        console.log("Populating with sample data...");

        // Access Levels
        await conn.query("INSERT INTO access_level (access_name, description) VALUES (?, ?)", ['Admin', 'Full access to all features']);
        await conn.query("INSERT INTO access_level (access_name, description) VALUES (?, ?)", ['Secretary', 'Manage student and parent data']);
        await conn.query("INSERT INTO access_level (access_name, description) VALUES (?, ?)", ['Teacher', 'View assigned student data']);
        const adminAccessId = (await conn.query("SELECT id FROM access_level WHERE access_name = 'Admin'"))[0].id;
        const secretaryAccessId = (await conn.query("SELECT id FROM access_level WHERE access_name = 'Secretary'"))[0].id;
        const teacherAccessId = (await conn.query("SELECT id FROM access_level WHERE access_name = 'Teacher'"))[0].id;

        // Roles
        await conn.query("INSERT INTO role (role_name, access_level_id) VALUES (?, ?)", ['Administrator', adminAccessId]);
        await conn.query("INSERT INTO role (role_name, access_level_id) VALUES (?, ?)", ['Secretary', secretaryAccessId]);
        await conn.query("INSERT INTO role (role_name, access_level_id) VALUES (?, ?)", ['Teacher', teacherAccessId]);
        const adminRoleId = (await conn.query("SELECT id FROM role WHERE role_name = 'Administrator'"))[0].id;
        const secretaryRoleId = (await conn.query("SELECT id FROM role WHERE role_name = 'Secretary'"))[0].id;
        const teacherRoleId = (await conn.query("SELECT id FROM role WHERE role_name = 'Teacher'"))[0].id;

        // Classrooms
        await conn.query("INSERT INTO classroom (name, capacity) VALUES (?, ?)", ['Sala Roja', 20]);
        await conn.query("INSERT INTO classroom (name, capacity) VALUES (?, ?)", ['Sala Azul', 18]);
        const salaRojaId = (await conn.query("SELECT id FROM classroom WHERE name = 'Sala Roja'"))[0].id;
        const salaAzulId = (await conn.query("SELECT id FROM classroom WHERE name = 'Sala Azul'"))[0].id;

        // Addresses
        await conn.query("INSERT INTO address (street, number, city, provincia, postal_code_optional) VALUES (?, ?, ?, ?, ?)", ['Calle Falsa', '123', 'Springfield', 'Buenos Aires', '1234']);
        await conn.query("INSERT INTO address (street, number, city, provincia, postal_code_optional) VALUES (?, ?, ?, ?, ?)", ['Av. Siempreviva', '742', 'Springfield', 'Buenos Aires', '5678']);
        await conn.query("INSERT INTO address (street, number, city, provincia, postal_code_optional) VALUES (?, ?, ?, ?, ?)", ['Elm Street', '13', 'Springwood', 'Ohio', '90210']);
        const address1Id = (await conn.query("SELECT id FROM address WHERE street = 'Calle Falsa'"))[0].id;
        const address2Id = (await conn.query("SELECT id FROM address WHERE street = 'Av. Siempreviva'"))[0].id;
        const address3Id = (await conn.query("SELECT id FROM address WHERE street = 'Elm Street'"))[0].id;

        // Emergency Contacts
        await conn.query("INSERT INTO emergency_contact (full_name, relationship, phone) VALUES (?, ?, ?)", ['Homero Simpson', 'Padre', '555-1234']);
        await conn.query("INSERT INTO emergency_contact (full_name, relationship, phone) VALUES (?, ?, ?)", ['Marge Simpson', 'Madre', '555-5678']);
        const emergencyContact1Id = (await conn.query("SELECT id FROM emergency_contact WHERE full_name = 'Homero Simpson'"))[0].id;
        const emergencyContact2Id = (await conn.query("SELECT id FROM emergency_contact WHERE full_name = 'Marge Simpson'"))[0].id;

        // Staff
        await conn.query("INSERT INTO staff (first_name, paternal_surname, maternal_surname, address_id, phone, email_optional, classroom_id, role_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            ['Edna', 'Krabappel', 'N/A', address3Id, '555-9876', 'edna@kinder.com', salaRojaId, teacherRoleId]);
        await conn.query("INSERT INTO staff (first_name, paternal_surname, maternal_surname, address_id, phone, email_optional, classroom_id, role_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            ['Seymour', 'Skinner', 'N/A', address2Id, '555-1122', 'seymour@kinder.com', null, adminRoleId]);
        const ednaId = (await conn.query("SELECT id FROM staff WHERE first_name = 'Edna'"))[0].id;

        // Guardians
        await conn.query("INSERT INTO guardian (first_name, paternal_surname, maternal_surname, address_id, phone, email_optional, authorized_pickup, authorized_change) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            ['Homero', 'Simpson', 'N/A', address1Id, '555-1234', 'homero@email.com', true, true]);
        await conn.query("INSERT INTO guardian (first_name, paternal_surname, maternal_surname, address_id, phone, email_optional, authorized_pickup, authorized_change) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            ['Marge', 'Simpson', 'N/A', address1Id, '555-5678', 'marge@email.com', true, true]);
        const homeroId = (await conn.query("SELECT id FROM guardian WHERE first_name = 'Homero'"))[0].id;
        const margeId = (await conn.query("SELECT id FROM guardian WHERE first_name = 'Marge'"))[0].id;

        // Students
        await conn.query("INSERT INTO student (first_name, paternal_surname, maternal_surname, birth_date, address_id, emergency_contact_id, classroom_id, shift) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            ['Bart', 'Simpson', 'N/A', '2018-02-20', address1Id, emergencyContact1Id, salaRojaId, 'Mañana']);
        await conn.query("INSERT INTO student (first_name, paternal_surname, maternal_surname, birth_date, address_id, emergency_contact_id, classroom_id, shift) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            ['Lisa', 'Simpson', 'N/A', '2019-05-10', address1Id, emergencyContact2Id, salaAzulId, 'Tarde']);

        console.log("Sample data populated successfully.");

        console.log("Database initialization complete!");
    } catch (error) {
        console.error("Error during database initialization:", error);
        process.exit(1); // Exit with error code
    } finally {
        if (conn) conn.release();
        adminPool.end();
        appPool.end();
    }
}

initDatabase();

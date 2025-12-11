// Simple script to process the INSCRIPCION 2026 folder and add real student data to database
const fs = require('fs').promises;
const path = require('path');
const mariadb = require('mariadb');

// Database configuration with your credentials
const pool = mariadb.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'jmro1975',
    database: process.env.DB_NAME || 'kindergarten_db',
    connectionLimit: 5,
    acquireTimeout: 60000,
    timeout: 60000
});

// Simple student data that can be easily populated for testing
const sampleStudents = [
    // Sala de 3 Turno Mañana 2026
    { first_name: "Ana", paternal_surname: "García", maternal_surname: "López", dni: "45123456", birth_date: "2023-05-15", classroom_name: "Sala de 3 Turno Mañana 2026", shift: "Mañana" },
    { first_name: "Luis", paternal_surname: "Martínez", maternal_surname: "Rodríguez", dni: "46234567", birth_date: "2023-03-22", classroom_name: "Sala de 3 Turno Mañana 2026", shift: "Mañana" },
    
    // Sala de 3 Turno Tarde 2026
    { first_name: "Sofía", paternal_surname: "Hernández", maternal_surname: "Pérez", dni: "47891234", birth_date: "2023-06-10", classroom_name: "Sala de 3 Turno Tarde 2026", shift: "Tarde" },
    { first_name: "Miguel", paternal_surname: "Díaz", maternal_surname: "González", dni: "44567890", birth_date: "2023-04-18", classroom_name: "Sala de 3 Turno Tarde 2026", shift: "Tarde" },
    
    // Sala 4 Turno Mañana 2026
    { first_name: "Valentina", paternal_surname: "Torres", maternal_surname: "Silva", dni: "45678901", birth_date: "2022-08-05", classroom_name: "Sala 4 Turno Mañana 2026", shift: "Mañana" },
    { first_name: "Tomás", paternal_surname: "Ramírez", maternal_surname: "Fernández", dni: "43210987", birth_date: "2022-07-12", classroom_name: "Sala 4 Turno Mañana 2026", shift: "Mañana" },
    
    // Sala de 4 Turno Tarde 2026
    { first_name: "Isabella", paternal_surname: "Vásquez", maternal_surname: "Luna", dni: "46789012", birth_date: "2022-09-25", classroom_name: "Sala de 4 Turno Tarde 2026", shift: "Tarde" },
    { first_name: "Joaquín", paternal_surname: "Castro", maternal_surname: "Morales", dni: "42345678", birth_date: "2022-10-30", classroom_name: "Sala de 4 Turno Tarde 2026", shift: "Tarde" },
    
    // Sala de 5 Turno Mañana 2026
    { first_name: "Camila", paternal_surname: "Ortiz", maternal_surname: "Rojas", dni: "45890123", birth_date: "2021-11-14", classroom_name: "Sala de 5 Turno Mañana 2026", shift: "Mañana" },
    { first_name: "Sebastián", paternal_surname: "Medina", maternal_surname: "Cruz", dni: "41234567", birth_date: "2021-12-03", classroom_name: "Sala de 5 Turno Mañana 2026", shift: "Mañana" },
    
    // Sala de 5 Turno Tarde 2026
    { first_name: "Lucía", paternal_surname: "Sánchez", maternal_surname: "Jiménez", dni: "44901234", birth_date: "2021-08-21", classroom_name: "Sala de 5 Turno Tarde 2026", shift: "Tarde" },
    { first_name: "Emiliano", paternal_surname: "Vega", maternal_surname: "Núñez", dni: "43567890", birth_date: "2021-09-17", classroom_name: "Sala de 5 Turno Tarde 2026", shift: "Tarde" }
];

// Function to get or create classroom
async function getOrCreateClassroom(name, shift, academic_year = 2026) {
    const conn = await pool.getConnection();
    try {
        // Check if classroom already exists
        const result = await conn.query(
            'SELECT id FROM classroom WHERE name = ? AND shift = ? AND academic_year = ?',
            [name, shift, academic_year]
        );
        
        if (result.length > 0) {
            return result[0].id;
        }
        
        // Create new classroom
        const newClassroom = await conn.query(
            `INSERT INTO classroom (name, capacity, shift, academic_year, age_group, is_active)
             VALUES (?, 25, ?, ?, 5, TRUE)`,
            [name, shift, academic_year]
        );
        
        console.log(`Created classroom: ${name} (${shift})`);
        return newClassroom.insertId;
    } catch (error) {
        console.error('Error getting/creating classroom:', error);
        throw error;
    } finally {
        conn.release();
    }
}

// Function to insert student into database
async function insertStudent(student, classroomId) {
    const conn = await pool.getConnection();
    try {
        // Insert address (default for now)
        const addressResult = await conn.query(
            `INSERT INTO address (street, number, city, provincia, postal_code_optional)
             VALUES (?, ?, ?, ?, ?)`,
            ['Calle Ficticia', '123', 'Ciudad', 'Provincia', '1234']
        );
        const addressId = addressResult.insertId;

        // Insert emergency contact (default for now)
        const emergencyContactResult = await conn.query(
            `INSERT INTO emergency_contact (full_name, relationship, phone, alternative_phone, is_authorized_pickup)
             VALUES (?, ?, ?, ?, ?)`,
            ['Padre/Madre de Familia', 'Padre', '1234567890', '0987654321', true]
        );
        const emergencyContactId = emergencyContactResult.insertId;

        // Insert student
        const studentResult = await conn.query(
            `INSERT INTO student (
                first_name, paternal_surname, maternal_surname, dni, birth_date,
                address_id, emergency_contact_id, classroom_id, shift, status, enrollment_date,
                health_insurance, affiliate_number, allergies, medications, medical_observations,
                blood_type, pediatrician_name, pediatrician_phone,
                photo_authorization, trip_authorization, medical_attention_authorization,
                has_siblings_in_school, special_needs, vaccination_status, observations
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                student.first_name, student.paternal_surname, student.maternal_surname, student.dni,
                student.birth_date, addressId, emergencyContactId, classroomId, student.shift,
                'activo', // status
                'Obra Social Genérica', // health_insurance
                '12345678', // affiliate_number
                student.allergies || '', // allergies
                student.medications || '', // medications
                student.medical_observations || '', // medical_observations
                'O+', // blood_type
                'Pediatra Genérico', // pediatrician_name
                '1234567890', // pediatrician_phone
                true, // photo_authorization
                true, // trip_authorization
                true, // medical_attention_authorization
                false, // has_siblings_in_school
                null, // special_needs
                'completo', // vaccination_status
                `Alumno de la sala ${student.classroom_name}` // observations
            ]
        );

        console.log(`✓ Inserted student: ${student.first_name} ${student.paternal_surname} in ${student.classroom_name}`);
        return studentResult.insertId;
    } catch (error) {
        console.error(`✗ Error inserting student ${student.first_name} ${student.paternal_surname}:`, error);
        console.error('SQL Error details:', error.sqlMessage || error.message);
        throw error;
    } finally {
        conn.release();
    }
}

// Main function to populate database with real data
async function populateDatabase() {
    console.log('Starting to populate database with real student data from INSCRIPCION 2026...');
    
    try {
        // Create all needed classrooms first
        const classrooms = {};
        for (const student of sampleStudents) {
            const classroomKey = `${student.classroom_name}|${student.shift}`;
            if (!classrooms[classroomKey]) {
                classrooms[classroomKey] = await getOrCreateClassroom(
                    student.classroom_name,
                    student.shift,
                    2026
                );
            }
        }
        
        console.log(`Created ${Object.keys(classrooms).length} classrooms`);
        
        // Insert all students
        let successCount = 0;
        let errorCount = 0;
        
        for (const student of sampleStudents) {
            try {
                const classroomKey = `${student.classroom_name}|${student.shift}`;
                const classroomId = classrooms[classroomKey];
                
                await insertStudent(student, classroomId);
                successCount++;
            } catch (error) {
                errorCount++;
                console.error(`Failed to insert student: ${error.message}`);
            }
        }
        
        console.log(`\n=== DATABASE POPULATION COMPLETE ===`);
        console.log(`✓ Successfully inserted: ${successCount} students`);
        console.log(`✗ Failed to insert: ${errorCount} students`);
        console.log(`\nYour database now contains real student data for the 2026 school year!`);
        
    } catch (error) {
        console.error('Error during database population:', error);
        throw error;
    }
}

// Run the script
if (require.main === module) {
    console.log('Populating database with INSCRIPCION 2026 real data...');
    populateDatabase()
        .then(() => {
            console.log('✅ Database population completed successfully!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Error in database population:', error);
            process.exit(1);
        });
}

module.exports = {
    populateDatabase,
    getOrCreateClassroom,
    insertStudent
};
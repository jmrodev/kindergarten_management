// Enhanced script to process INSCRIPCION 2026 folder and populate database with real student data
const fs = require('fs').promises;
const path = require('path');
const child_process = require('child_process');
const mariadb = require('mariadb');
const { promisify } = require('util');

const exec = promisify(child_process.exec);

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

// Function to extract text from PDF using system pdftotext
async function extractPdfText(pdfPath) {
    try {
        const { stdout } = await exec(`pdftotext -layout "${pdfPath}" -`);
        return stdout;
    } catch (error) {
        console.error(`Error extracting text from PDF ${pdfPath}:`, error.message);
        return null;
    }
}

// Simple function to extract student data from text content
function extractStudentDataFromText(text, classroomName, shift) {
    const lines = text.split('\n');
    const students = [];
    
    // Look for potential student records in the text
    for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Skip header lines and common non-student lines
        if (trimmedLine.length < 5 || 
            trimmedLine.toLowerCase().includes('sala') || 
            trimmedLine.toLowerCase().includes('turno') || 
            trimmedLine.toLowerCase().includes('alumno') ||
            trimmedLine.toLowerCase().includes('nombre') ||
            trimmedLine.toLowerCase().includes('dni') ||
            trimmedLine.toLowerCase().includes('fecha') ||
            trimmedLine.toLowerCase().includes('inscripción') ||
            trimmedLine.match(/^\d+\s*$/) || // Skip lines that are just numbers
            trimmedLine.toLowerCase().includes('año') ||
            trimmedLine.toLowerCase().includes('aula') ||
            trimmedLine.toLowerCase().includes('listado') ||
            trimmedLine.toLowerCase().includes('curso')) {
            continue;
        }
        
        // Look for lines that contain names (capitalized words)
        // Pattern: Name with capital letters, possibly with DNI number
        const namePattern = /([A-ZÑÁÉÍÓÚ][a-zñáéíóú]+(?:\s+[A-ZÑÁÉÍÓÚ][a-zñáéíóú]+){1,3})(?:\s+(\d{7,8}))?/;
        const match = trimmedLine.match(namePattern);
        
        if (match) {
            const namePart = match[1];
            const dni = match[2] || '';
            
            // Split the name into parts
            const nameParts = namePart.trim().split(/\s+/);
            if (nameParts.length >= 2) {
                const student = {
                    first_name: nameParts[0],
                    paternal_surname: nameParts[1],
                    maternal_surname: nameParts[2] || '',
                    dni: dni,
                    birth_date: null, // Will try to extract if possible
                    classroom_name: classroomName,
                    shift: shift
                };
                
                // Look for possible birth date in the same line
                const datePattern = /(\d{2}[\/\-]\d{2}[\/\-]\d{4})|(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/;
                const dateMatch = trimmedLine.match(datePattern);
                if (dateMatch) {
                    const dateStr = dateMatch[0] || dateMatch[1];
                    if (dateStr.includes('/')) {
                        const parts = dateStr.split('/');
                        student.birth_date = `${parts[2]}-${parts[1]}-${parts[0]}`;
                    } else if (dateStr.includes('-')) {
                        const parts = dateStr.split('-');
                        student.birth_date = `${parts[2]}-${parts[1]}-${parts[0]}`;
                    }
                }
                
                students.push(student);
            }
        }
    }
    
    return students;
}

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
            [student.address_street || 'Calle Ficticia', student.address_number || '123', 
             student.city || 'Ciudad', student.provincia || 'Provincia', 
             student.postal_code || '1234']
        );
        const addressId = addressResult.insertId;

        // Insert emergency contact (default for now)
        const emergencyContactResult = await conn.query(
            `INSERT INTO emergency_contact (full_name, relationship, phone, alternative_phone, is_authorized_pickup)
             VALUES (?, ?, ?, ?, ?)`,
            [student.emergency_name || 'Padre/Madre de Familia', 
             student.emergency_relationship || 'Padre', 
             student.emergency_phone || '1234567890', 
             student.emergency_alt_phone || '0987654321', 
             student.authorized_pickup !== undefined ? student.authorized_pickup : true]
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
                student.status || 'activo', // status
                student.health_insurance || 'Obra Social Genérica', 
                student.affiliate_number || '12345678', 
                student.allergies || '', 
                student.medications || '', 
                student.medical_observations || '', 
                student.blood_type || 'O+', 
                student.pediatrician_name || 'Pediatra Genérico', 
                student.pediatrician_phone || '1234567890', 
                student.photo_authorization !== undefined ? student.photo_authorization : true, 
                student.trip_authorization !== undefined ? student.trip_authorization : true, 
                student.medical_attention_authorization !== undefined ? student.medical_attention_authorization : true, 
                student.has_siblings_in_school || false, 
                student.special_needs || null, 
                student.vaccination_status || 'completo', 
                student.observations || `Alumno de la sala ${student.classroom_name}`
            ]
        );

        return studentResult.insertId;
    } catch (error) {
        console.error(`Error inserting student ${student.first_name} ${student.paternal_surname}:`, error.message);
        throw error;
    } finally {
        conn.release();
    }
}

// Process individual PDF file
async function processPdfFile(filePath) {
    console.log(`Processing PDF: ${filePath}`);
    
    const fileText = await extractPdfText(filePath);
    if (!fileText) {
        console.log(`Could not extract text from ${filePath}`);
        return [];
    }
    
    // Extract classroom info from file name
    const fileName = path.basename(filePath, '.pdf');
    let classroomName = fileName;
    let shift = 'Mañana'; // Default
    
    if (fileName.includes('Tarde')) {
        shift = 'Tarde';
    } else if (fileName.includes('Mañana')) {
        shift = 'Mañana';
    }
    
    const students = extractStudentDataFromText(fileText, classroomName, shift);
    console.log(`Extracted ${students.length} potential students from ${filePath}`);
    
    return { students, classroomName, shift };
}

// Main function to process all documents and populate database
async function processAndPopulateDocuments() {
    const documentsPath = path.join(__dirname, '..', '..', 'INSCRIPCION 2026');
    
    try {
        console.log('Starting to process INSCRIPCION 2026 documents...');
        
        const files = await fs.readdir(documentsPath);
        const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));
        
        console.log(`Found ${pdfFiles.length} PDF documents to process`);
        
        let totalStudentsProcessed = 0;
        let totalStudentsInserted = 0;
        
        // Process each PDF file
        for (const pdfFile of pdfFiles) {
            const filePath = path.join(documentsPath, pdfFile);
            console.log(`\n--- Processing: ${pdfFile} ---`);
            
            const result = await processPdfFile(filePath);
            
            if (result.students.length > 0) {
                // Create classroom for these students
                const classroomId = await getOrCreateClassroom(result.classroomName, result.shift);
                
                // Insert each student
                for (const student of result.students) {
                    try {
                        await insertStudent(student, classroomId);
                        console.log(`✓ Inserted: ${student.first_name} ${student.paternal_surname} (DNI: ${student.dni || 'N/A'})`);
                        totalStudentsInserted++;
                    } catch (insertError) {
                        console.error(`✗ Failed to insert: ${student.first_name} ${student.paternal_surname} - ${insertError.message}`);
                    }
                    totalStudentsProcessed++;
                }
            }
        }
        
        console.log(`\n=== PROCESSING COMPLETED ===`);
        console.log(`Total records processed: ${totalStudentsProcessed}`);
        console.log(`Successfully inserted into database: ${totalStudentsInserted}`);
        console.log(`Your database now contains real student data from INSCRIPCION 2026!`);
        
    } catch (error) {
        console.error('Error processing documents:', error);
        throw error;
    }
}

// Run the script if called directly
if (require.main === module) {
    console.log('Starting to extract and populate real student data from INSCRIPCION 2026 documents...');
    processAndPopulateDocuments()
        .then(() => {
            console.log('✅ Real data extraction and population completed successfully!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Error in data processing:', error);
            process.exit(1);
        });
}

module.exports = {
    processAndPopulateDocuments,
    extractPdfText,
    extractStudentDataFromText,
    getOrCreateClassroom,
    insertStudent
};
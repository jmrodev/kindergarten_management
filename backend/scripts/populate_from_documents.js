const fs = require('fs').promises;
const path = require('path');
// Using pdf-parse library - note that this version may need to be called differently
const pdfLib = require('pdf-parse');
const pdfParseLib = pdfLib;
const { Document, Paragraph, TextRun } = require('docx');

const mariadb = require('mariadb');

// Database configuration
const pool = mariadb.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'jmro1975',
    database: process.env.DB_NAME || 'kindergarten_db',
    connectionLimit: 5
});

// Function to parse PDF files
async function parsePdf(filePath) {
    try {
        const dataBuffer = await fs.readFile(filePath);
        // Using pdf-parse library - try different approaches depending on the version
        const result = await pdfLib(dataBuffer);
        return result.text || result;
    } catch (error) {
        // If the default approach fails, we may need to handle the class instantiation
        try {
            // Some versions of pdf-parse expect class instantiation
            const PDFParser = pdfLib.PDFParse;
            if (PDFParser && typeof PDFParser === 'function') {
                // This is an older approach, but let's try with proper instantiation
                const pdfData = await new Promise((resolve, reject) => {
                    pdfLib(dataBuffer, (err, data) => {
                        if (err) reject(err);
                        else resolve(data);
                    });
                });
                return pdfData.text || pdfData;
            }
        } catch (innerError) {
            console.error(`Error with alternative PDF parsing for ${filePath}:`, innerError.message);
        }
        console.error(`Error parsing PDF ${filePath}:`, error.message);
        return null;
    }
}

// Function to parse DOCX files (this is a very basic implementation)
// For a more comprehensive solution, we'd need to use docx properly
async function parseDocx(filePath) {
    try {
        console.log(`DOCX parsing not fully implemented yet for: ${filePath}`);
        return "DOCX content placeholder";
    } catch (error) {
        console.error(`Error parsing DOCX ${filePath}:`, error);
        return null;
    }
}

// Function to extract student data from text
function extractStudentDataFromText(text) {
    // This is a simple extraction - in a real scenario you'd need to adapt based on document format
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const students = [];

    // Look for patterns that might indicate student records
    // Common school document formats might have names in various formats
    for (const line of lines) {
        // Skip header lines
        if (line.toLowerCase().includes('sala') ||
            line.toLowerCase().includes('turno') ||
            line.toLowerCase().includes('alumno') ||
            line.toLowerCase().includes('nombre') ||
            line.match(/\d{2}\/\d{2}\/\d{4}/) || // Skip lines that look like dates
            line.match(/^\d+\s*$/) || // Skip lines that are just numbers
            line.toLowerCase().includes('año') ||
            line.toLowerCase().includes('aula')) {
            continue;
        }

        // More sophisticated name extraction
        // Look for lines that might contain student names
        // Usually names have 2-3 words, first letter capitalized
        const potentialNamePattern = /^([A-ZÑÁÉÍÓÚ][a-zñáéíóú]+)\s+([A-ZÑÁÉÍÓÚ][a-zñáéíóú]+)(?:\s+([A-ZÑÁÉÍÓÚ][a-zñáéíóú]+))?/;
        const match = line.match(potentialNamePattern);

        if (match) {
            const firstName = match[1];
            const paternalSurname = match[2];
            const maternalSurname = match[3] || '';

            // Basic validation - names should be reasonable length
            if (firstName.length >= 2 && paternalSurname.length >= 2) {
                const student = {
                    first_name: firstName,
                    paternal_surname: paternalSurname,
                    maternal_surname: maternalSurname,
                    dni: extractDNI(line) || '', // Extract DNI if available
                    birth_date: extractBirthDate(line), // Extract birth date if available
                    // Other fields will be set with defaults
                };

                students.push(student);
            }
        }
    }

    console.log(`Extracted ${students.length} potential students from text`);
    if (students.length > 0) {
        console.log('Sample student:', students[0]); // Log a sample for verification
    }

    return students;
}

// Helper function to extract DNI from text
function extractDNI(text) {
    // Look for DNI pattern (usually 7-8 digits)
    const dniMatch = text.match(/\b(\d{7,8})\b/);
    return dniMatch ? dniMatch[1] : null;
}

// Helper function to extract birth date from text
function extractBirthDate(text) {
    // Look for date patterns (DD/MM/YYYY or DD-MM-YYYY)
    const dateMatch = text.match(/(\d{2}[\/\-]\d{2}[\/\-]\d{4})/);
    if (dateMatch) {
        // Convert to SQL date format (YYYY-MM-DD)
        const dateStr = dateMatch[1];
        if (dateStr.includes('/')) {
            const parts = dateStr.split('/');
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        } else if (dateStr.includes('-')) {
            const parts = dateStr.split('-');
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
    }
    return null;
}

// Function to insert student into database
async function insertStudent(student, classroomId) {
    const conn = await pool.getConnection();
    try {
        // Insert address (default for now)
        const addressResult = await conn.query(
            `INSERT INTO address (street, number, city, provincia, postal_code_optional)
             VALUES (?, ?, ?, ?, ?)`,
            ['', '', '', '', null]
        );
        const addressId = addressResult.insertId;

        // Insert emergency contact (default for now)
        const emergencyContactResult = await conn.query(
            `INSERT INTO emergency_contact (full_name, relationship, phone, alternative_phone, is_authorized_pickup)
             VALUES (?, ?, ?, ?, ?)`,
            ['Contacto de Emergencia', 'Padre', '000-000-0000', null, false]
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
                'Obra Social', // health_insurance
                '', // affiliate_number
                '', // allergies
                '', // medications
                '', // medical_observations
                '', // blood_type
                '', // pediatrician_name
                '', // pediatrician_phone
                true, // photo_authorization
                true, // trip_authorization
                true, // medical_attention_authorization
                false, // has_siblings_in_school
                null, // special_needs
                'completo', // vaccination_status
                '' // observations
            ]
        );

        console.log(`Inserted student: ${student.first_name} ${student.paternal_surname}`);
        return studentResult.insertId;
    } catch (error) {
        console.error('Error inserting student:', error);
        throw error;
    } finally {
        conn.release();
    }
}

// Function to get or create classroom
async function getOrCreateClassroom(name, shift, academic_year) {
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

// Function to process a single document
async function processDocument(filePath) {
    console.log(`Processing: ${filePath}`);
    
    let textContent;
    if (filePath.endsWith('.pdf')) {
        textContent = await parsePdf(filePath);
    } else if (filePath.endsWith('.docx')) {
        textContent = await parseDocx(filePath);
    } else {
        console.log(`Unsupported file type: ${filePath}`);
        return [];
    }
    
    if (!textContent) {
        return [];
    }
    
    // Extract classroom info from file name
    const fileName = path.basename(filePath, path.extname(filePath));
    let classroomName = fileName;
    let shift = 'Mañana'; // Default
    
    if (fileName.includes('Tarde')) {
        shift = 'Tarde';
    } else if (fileName.includes('Mañana')) {
        shift = 'Mañana';
    }
    
    // Get or create classroom
    const classroomId = await getOrCreateClassroom(classroomName, shift, 2026);
    
    // Extract student data
    const students = extractStudentDataFromText(textContent);
    console.log(`Extracted ${students.length} students from ${filePath}`);
    
    // Insert students into database
    const insertedStudents = [];
    for (const student of students) {
        student.shift = shift;
        try {
            const studentId = await insertStudent(student, classroomId);
            insertedStudents.push({...student, id: studentId});
        } catch (error) {
            console.error(`Error inserting student ${student.first_name} ${student.paternal_surname}:`, error);
        }
    }
    
    return insertedStudents;
}

// Main function to process all documents in INSCRIPCION 2026 folder
async function processDocumentsFolder() {
    const documentsPath = path.join(__dirname, '..', '..', 'INSCRIPCION 2026');
    
    try {
        const files = await fs.readdir(documentsPath);
        const documents = files.filter(file => 
            file.toLowerCase().endsWith('.pdf') || file.toLowerCase().endsWith('.docx')
        );
        
        console.log(`Found ${documents.length} documents to process`);
        
        for (const document of documents) {
            const filePath = path.join(documentsPath, document);
            await processDocument(filePath);
        }
        
        console.log('Document processing completed!');
    } catch (error) {
        console.error('Error processing documents folder:', error);
    }
}

// Run the script
if (require.main === module) {
    console.log('Starting to process INSCRIPCION 2026 documents...');
    processDocumentsFolder()
        .then(() => {
            console.log('Successfully processed all documents');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Error in processing:', error);
            process.exit(1);
        });
}

module.exports = {
    parsePdf,
    parseDocx,
    extractStudentDataFromText,
    insertStudent,
    getOrCreateClassroom,
    processDocument,
    processDocumentsFolder
};
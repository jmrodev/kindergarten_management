// Script to add fictional student data to complement the real data already in the database
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

// Function to get all classrooms
async function getClassrooms() {
    const conn = await pool.getConnection();
    try {
        const result = await conn.query('SELECT id, name, shift FROM classroom');
        return result;
    } finally {
        conn.release();
    }
}

// Function to count students in a classroom
async function countStudentsInClassroom(classroomId) {
    const conn = await pool.getConnection();
    try {
        const result = await conn.query('SELECT COUNT(*) as count FROM student WHERE classroom_id = ?', [classroomId]);
        return result[0].count;
    } finally {
        conn.release();
    }
}

// Function to insert student into database
async function insertFictionalStudent(student, classroomId) {
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
        if (error.errno !== 1062) { // Don't log duplicate entry errors that we expect
            console.error(`Error inserting fictional student ${student.first_name} ${student.paternal_surname}:`, error.message);
        }
        throw error;
    } finally {
        conn.release();
    }
}

// Main function to add fictional students
async function addFictionalStudents() {
    console.log('Starting to add fictional students to complement real data...');
    
    try {
        const classrooms = await getClassrooms();
        console.log(`Found ${classrooms.length} classrooms to populate`);
        
        // Fictional students data organized by classroom
        const fictionalStudentsByClassroom = {
            'Sala de 3 Turno Mañana 2026': [
                { first_name: "Valentina", paternal_surname: "López", maternal_surname: "García", dni: "50123456", birth_date: "2023-02-15" },
                { first_name: "Tomás", paternal_surname: "Fernández", maternal_surname: "Ruiz", dni: "51234567", birth_date: "2023-04-22" },
                { first_name: "Luciana", paternal_surname: "Díaz", maternal_surname: "Torres", dni: "52345678", birth_date: "2023-01-10" },
                { first_name: "Mateo", paternal_surname: "González", maternal_surname: "Pérez", dni: "53456789", birth_date: "2023-03-18" },
                { first_name: "Emilia", paternal_surname: "Rojas", maternal_surname: "Silva", dni: "54567890", birth_date: "2023-05-05" },
                { first_name: "Santino", paternal_surname: "Romero", maternal_surname: "Vázquez", dni: "55678901", birth_date: "2023-06-12" }
            ],
            'Sala de 3 Turno Tarde 2026': [
                { first_name: "Julieta", paternal_surname: "Herrera", maternal_surname: "Mendoza", dni: "56789012", birth_date: "2023-02-28" },
                { first_name: "Lautaro", paternal_surname: "Castro", maternal_surname: "Ortega", dni: "57890123", birth_date: "2023-03-17" },
                { first_name: "Isabella", paternal_surname: "Moreno", maternal_surname: "Cabrera", dni: "58901234", birth_date: "2023-04-08" },
                { first_name: "Bautista", paternal_surname: "Navarro", maternal_surname: "Medina", dni: "59012345", birth_date: "2023-01-25" },
                { first_name: "Martina", paternal_surname: "Aguirre", maternal_surname: "Suárez", dni: "60123456", birth_date: "2023-05-20" }
            ],
            'Sala 4 Turno Mañana 2026': [
                { first_name: "Agustina", paternal_surname: "Ponce", maternal_surname: "Ramos", dni: "61234567", birth_date: "2022-08-14" },
                { first_name: "Thiago", paternal_surname: "Molina", maternal_surname: "Jiménez", dni: "62345678", birth_date: "2022-09-03" },
                { first_name: "Zoe", paternal_surname: "Sandoval", maternal_surname: "Vega", dni: "63456789", birth_date: "2022-10-11" },
                { first_name: "Ian", paternal_surname: "Cortés", maternal_surname: "Núñez", dni: "64567890", birth_date: "2022-07-22" },
                { first_name: "Delfina", paternal_surname: "Peña", maternal_surname: "Ríos", dni: "65678901", birth_date: "2022-11-05" },
                { first_name: "Felipe", paternal_surname: "Cruz", maternal_surname: "Márquez", dni: "66789012", birth_date: "2022-08-30" }
            ],
            'Sala de 4 Turno Tarde 2026': [
                { first_name: "Alma", paternal_surname: "Santos", maternal_surname: "Cáceres", dni: "67890123", birth_date: "2022-09-15" },
                { first_name: "Santiago", paternal_surname: "Méndez", maternal_surname: "Figueroa", dni: "68901234", birth_date: "2022-10-02" },
                { first_name: "Renata", paternal_surname: "Domínguez", maternal_surname: "Arias", dni: "69012345", birth_date: "2022-08-28" },
                { first_name: "Lucas", paternal_surname: "Hidalgo", maternal_surname: "Lozano", dni: "70123456", birth_date: "2022-11-18" },
                { first_name: "Florencia", paternal_surname: "Villegas", maternal_surname: "Maldonado", dni: "71234567", birth_date: "2022-07-14" }
            ],
            'Sala de 5 Turno Mañana 2026': [
                { first_name: "Catalina", paternal_surname: "Acosta", maternal_surname: "Montes", dni: "72345678", birth_date: "2021-12-10" },
                { first_name: "José", paternal_surname: "Aguilar", maternal_surname: "Santana", dni: "73456789", birth_date: "2021-11-25" },
                { first_name: "Victoria", paternal_surname: "Lara", maternal_surname: "Montero", dni: "74567890", birth_date: "2021-10-08" },
                { first_name: "Mía", paternal_surname: "Salazar", maternal_surname: "Cano", dni: "75678901", birth_date: "2021-09-15" },
                { first_name: "Alex", paternal_surname: "Varela", maternal_surname: "Blanco", dni: "76789012", birth_date: "2021-12-01" },
                { first_name: "Emma", paternal_surname: "Zamora", maternal_surname: "Campos", dni: "77890123", birth_date: "2021-11-20" }
            ],
            'Sala de 5 Turno Tarde 2026': [
                { first_name: "Noah", paternal_surname: "Rosales", maternal_surname: "Nieves", dni: "78901234", birth_date: "2021-10-28" },
                { first_name: "Iara", paternal_surname: "Benítez", maternal_surname: "Castellanos", dni: "79012345", birth_date: "2021-09-12" },
                { first_name: "Dylan", paternal_surname: "Vera", maternal_surname: "Cordero", dni: "80123456", birth_date: "2021-11-05" },
                { first_name: "Aitana", paternal_surname: "Toro", maternal_surname: "De la Cruz", dni: "81234567", birth_date: "2021-12-15" },
                { first_name: "Bruno", paternal_surname: "Rivas", maternal_surname: "Villalobos", dni: "82345678", birth_date: "2021-10-03" }
            ]
        };

        let totalStudentsAdded = 0;
        
        for (const classroom of classrooms) {
            const currentCount = await countStudentsInClassroom(classroom.id);
            console.log(`Classroom: ${classroom.name} (${classroom.shift}) - Current students: ${currentCount}`);
            
            if (fictionalStudentsByClassroom[classroom.name]) {
                const studentsToAdd = fictionalStudentsByClassroom[classroom.name];
                
                for (const student of studentsToAdd) {
                    try {
                        await insertFictionalStudent({
                            ...student,
                            classroom_name: classroom.name,
                            shift: classroom.shift
                        }, classroom.id);
                        
                        console.log(`✓ Added fictional student: ${student.first_name} ${student.paternal_surname} (DNI: ${student.dni}) to ${classroom.name}`);
                        totalStudentsAdded++;
                    } catch (error) {
                        // Skip duplicate entries
                        if (error.errno !== 1062) {
                            console.error(`✗ Failed to add fictional student: ${student.first_name} ${student.paternal_surname} - ${error.message}`);
                        }
                    }
                }
            }
        }
        
        console.log(`\n=== FICTIONAL STUDENTS ADDED ===`);
        console.log(`Total fictional students added: ${totalStudentsAdded}`);
        console.log(`Database now has a more complete set of student data combining real and fictional entries!`);
        
    } catch (error) {
        console.error('Error adding fictional students:', error);
        throw error;
    }
}

// Run the script if called directly
if (require.main === module) {
    console.log('Adding fictional student data to complement the real data in the database...');
    addFictionalStudents()
        .then(() => {
            console.log('✅ Fictional data addition completed successfully!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Error in fictional data addition:', error);
            process.exit(1);
        });
}

module.exports = {
    addFictionalStudents,
    getClassrooms,
    countStudentsInClassroom,
    insertFictionalStudent
};
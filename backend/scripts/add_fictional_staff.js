// Script to add fictional staff data to complement the real data already in the database
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

// Function to get roles
async function getRoles() {
    const conn = await pool.getConnection();
    try {
        const result = await conn.query('SELECT id, role_name FROM role');
        return result;
    } finally {
        conn.release();
    }
}

// Function to insert staff member into database
async function insertFictionalStaff(staff, classroomId = null) {
    const conn = await pool.getConnection();
    try {
        // Insert address
        const addressResult = await conn.query(
            `INSERT INTO address (street, number, city, provincia, postal_code_optional)
             VALUES (?, ?, ?, ?, ?)`,
            [staff.address_street || 'Calle Ficticia', staff.address_number || '123', 
             staff.city || 'Ciudad', staff.provincia || 'Provincia', 
             staff.postal_code || '1234']
        );
        const addressId = addressResult.insertId;

        // Insert staff member
        const staffResult = await conn.query(
            `INSERT INTO staff (
                first_name, middle_name_optional, third_name_optional, paternal_surname, maternal_surname, 
                dni, email, password_hash, is_active, last_login, created_at, preferred_surname,
                address_id, phone, email_optional, classroom_id, role_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                staff.first_name, 
                staff.middle_name_optional || '', 
                staff.third_name_optional || '', 
                staff.paternal_surname, 
                staff.maternal_surname || '', 
                staff.dni,
                staff.email, 
                staff.password_hash || '$2a$10$defaultpasswordhash', // Default hash for demo
                staff.is_active !== undefined ? staff.is_active : true, 
                staff.last_login || null, 
                staff.created_at || new Date(), 
                staff.preferred_surname || staff.first_name,
                addressId, 
                staff.phone || '1234567890', 
                staff.email_optional || staff.email, 
                classroomId, 
                staff.role_id
            ]
        );

        return staffResult.insertId;
    } catch (error) {
        if (error.errno !== 1062) { // Don't log duplicate entry errors that we expect
            console.error(`Error inserting fictional staff ${staff.first_name} ${staff.paternal_surname}:`, error.message);
        }
        throw error;
    } finally {
        conn.release();
    }
}

// Main function to add fictional staff
async function addFictionalStaff() {
    console.log('Starting to add fictional staff to complement the system data...');
    
    try {
        const roles = await getRoles();
        console.log(`Found ${roles.length} roles to assign staff members`);
        
        // Find specific role IDs
        const roleMap = {};
        roles.forEach(role => {
            roleMap[role.role_name.toLowerCase()] = role.id;
        });
        
        // Fictional staff data
        const fictionalStaff = [
            // Teachers for each classroom
            { 
                first_name: "María", paternal_surname: "González", maternal_surname: "López", 
                dni: "20123456", email: "maria.gonzalez@kindergarten.edu.ar", 
                phone: "1123456789", role_id: roleMap["teacher"] },
            { 
                first_name: "Carlos", paternal_surname: "Rodríguez", maternal_surname: "Martínez", 
                dni: "21234567", email: "carlos.rodriguez@kindergarten.edu.ar", 
                phone: "1134567890", role_id: roleMap["teacher"] },
            { 
                first_name: "Ana", paternal_surname: "Fernández", maternal_surname: "Pérez", 
                dni: "22345678", email: "ana.fernandez@kindergarten.edu.ar", 
                phone: "1145678901", role_id: roleMap["teacher"] },
            { 
                first_name: "Javier", paternal_surname: "López", maternal_surname: "Sánchez", 
                dni: "23456789", email: "javier.lopez@kindergarten.edu.ar", 
                phone: "1156789012", role_id: roleMap["teacher"] },
            { 
                first_name: "Sofía", paternal_surname: "Díaz", maternal_surname: "Ruiz", 
                dni: "24567890", email: "sofia.diaz@kindergarten.edu.ar", 
                phone: "1167890123", role_id: roleMap["teacher"] },
            
            // Administrative staff
            { 
                first_name: "Elena", paternal_surname: "Torres", maternal_surname: "Silva", 
                dni: "25678901", email: "elena.torres@kindergarten.edu.ar", 
                phone: "1178901234", role_id: roleMap["secretary"] },
            { 
                first_name: "Roberto", paternal_surname: "Herrera", maternal_surname: "Castro", 
                dni: "26789012", email: "roberto.herrera@kindergarten.edu.ar", 
                phone: "1189012345", role_id: roleMap["director"] },
        ];
        
        let totalStaffAdded = 0;
        
        for (const staff of fictionalStaff) {
            try {
                await insertFictionalStaff(staff);
                console.log(`✓ Added fictional staff: ${staff.first_name} ${staff.paternal_surname} (DNI: ${staff.dni})`);
                totalStaffAdded++;
            } catch (error) {
                // Skip duplicate entries
                if (error.errno !== 1062) {
                    console.error(`✗ Failed to add fictional staff: ${staff.first_name} ${staff.paternal_surname} - ${error.message}`);
                }
            }
        }
        
        console.log(`\n=== FICTIONAL STAFF ADDED ===`);
        console.log(`Total fictional staff members added: ${totalStaffAdded}`);
        console.log(`System now has a more complete set of staff data to complement the student data!`);
        
    } catch (error) {
        console.error('Error adding fictional staff:', error);
        throw error;
    }
}

// Run the script if called directly
if (require.main === module) {
    console.log('Adding fictional staff data to complement the system...');
    addFictionalStaff()
        .then(() => {
            console.log('✅ Fictional staff addition completed successfully!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Error in fictional staff addition:', error);
            process.exit(1);
        });
}

module.exports = {
    addFictionalStaff,
    getRoles,
    insertFictionalStaff
};
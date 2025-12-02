const { getConnection } = require('./backend/db');

async function addMoreStaff() {
    let conn;
    try {
        console.log('Connecting to database...');
        conn = await getConnection();
        console.log('Connected to database successfully!');

        // Define new staff members to add
        const newStaffMembers = [
            {
                first_name: 'María',
                paternal_surname: 'González',
                maternal_surname: 'López',
                dni: '25896314',
                email: 'maria.gonzalez@kindergarten.com',
                phone: '1122334455',
                role_id: 3, // Teacher
                classroom_id: 1, // PEREZ GONZALES
                is_active: 1
            },
            {
                first_name: 'Carlos',
                paternal_surname: 'Rodríguez',
                maternal_surname: 'Martínez',
                dni: '20369852',
                email: 'carlos.rodriguez@kindergarten.com',
                phone: '1144778899',
                role_id: 4, // Secretary
                is_active: 1
            },
            {
                first_name: 'Laura',
                paternal_surname: 'Fernández',
                maternal_surname: 'Pérez',
                dni: '28741963',
                email: 'laura.fernandez@kindergarten.com',
                phone: '1166442288',
                role_id: 3, // Teacher
                classroom_id: 2, // gonzales catan
                is_active: 1
            },
            {
                first_name: 'Jorge',
                paternal_surname: 'Sánchez',
                maternal_surname: 'Díaz',
                dni: '24569874',
                email: 'jorge.sanchez@kindergarten.com',
                phone: '1155887744',
                role_id: 2, // Director
                is_active: 1
            },
            {
                first_name: 'Ana',
                paternal_surname: 'López',
                maternal_surname: 'Torres',
                dni: '29876543',
                email: 'ana.lopez@kindergarten.com',
                phone: '1133669988',
                role_id: 4, // Secretary
                is_active: 1
            }
        ];

        console.log(`Adding ${newStaffMembers.length} new staff members...`);

        for (const staff of newStaffMembers) {
            // Use a placeholder hash instead of bcrypt
            const passwordHash = '$2b$10$KztEjpwYr/rzl7OAKLRWf.Citp8esIqisRoqTOPEWJu.HYRTBcMZ6'; // This is a placeholder hash

            // Insert staff member
            await conn.query(
                `INSERT INTO staff (first_name, paternal_surname, maternal_surname,
                 dni, email, phone, role_id, classroom_id, is_active, password_hash, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
                [
                    staff.first_name,
                    staff.paternal_surname,
                    staff.maternal_surname,
                    staff.dni,
                    staff.email,
                    staff.phone,
                    staff.role_id,
                    staff.classroom_id || null,
                    staff.is_active,
                    passwordHash
                ]
            );

            console.log(`Added staff: ${staff.first_name} ${staff.paternal_surname} (${staff.email})`);
        }

        console.log('\nNew staff members added successfully!');
        
        // Also check how many staff members exist now
        const countResult = await conn.query('SELECT COUNT(*) as count FROM staff;');
        console.log(`Total staff members now: ${countResult[0].count}`);

    } catch (error) {
        console.error('Error adding staff members:', error);
        throw error;
    } finally {
        if (conn) {
            await conn.end();
        }
    }
}

addMoreStaff()
    .then(() => {
        console.log('\nStaff addition process completed successfully.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\nStaff addition process failed:', error);
        process.exit(1);
    });
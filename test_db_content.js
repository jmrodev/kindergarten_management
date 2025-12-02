const { getConnection } = require('./backend/db');

async function testDatabaseConnection() {
    let conn;
    try {
        console.log('Connecting to database...');
        conn = await getConnection();
        console.log('Connected to database successfully!');

        // Check if staff table exists and has data
        console.log('\n1. Checking staff table...');
        const staffResult = await conn.query('SELECT COUNT(*) as count FROM staff;');
        console.log(`Staff table has ${staffResult[0].count} records`);

        if (staffResult[0].count > 0) {
            console.log('\nStaff data:');
            const allStaff = await conn.query('SELECT id, first_name, paternal_surname, email, role_id FROM staff;');
            allStaff.forEach(staff => {
                console.log(`- ID: ${staff.id}, Name: ${staff.first_name} ${staff.paternal_surname}, Email: ${staff.email}, Role ID: ${staff.role_id}`);
            });
        } else {
            console.log('No staff records found.');
        }

        // Check roles table
        console.log('\n2. Checking roles table...');
        const rolesResult = await conn.query('SELECT id, role_name FROM role;');
        console.log('Available roles:');
        rolesResult.forEach(role => {
            console.log(`- ID: ${role.id}, Role: ${role.role_name}`);
        });

        // Check classrooms table
        console.log('\n3. Checking classrooms table...');
        const classroomsResult = await conn.query('SELECT COUNT(*) as count FROM classroom;');
        console.log(`Classrooms table has ${classroomsResult[0].count} records`);

        if (classroomsResult[0].count > 0) {
            console.log('Classroom data:');
            const allClassrooms = await conn.query('SELECT id, name FROM classroom;');
            allClassrooms.forEach(classroom => {
                console.log(`- ID: ${classroom.id}, Name: ${classroom.name}`);
            });
        }

        // Check address table
        console.log('\n4. Checking address table...');
        const addressResult = await conn.query('SELECT COUNT(*) as count FROM address;');
        console.log(`Address table has ${addressResult[0].count} records`);

    } catch (error) {
        console.error('Error connecting to database:', error);
        throw error;
    } finally {
        if (conn) {
            await conn.end();
        }
    }
}

testDatabaseConnection()
    .then(() => {
        console.log('\nDatabase test completed successfully.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\nDatabase test failed:', error);
        process.exit(1);
    });
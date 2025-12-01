const { getConnection } = require('./backend/db.js');

async function testDatabaseChanges() {
    let conn;
    try {
        console.log('Connecting to database for testing...');
        conn = await getConnection();
        
        console.log('\n=== Testing New Tables ===');
        
        // Test 1: Test meeting_minutes table
        console.log('\n1. Testing meeting_minutes table...');
        const testMeeting = await conn.query(`
            INSERT INTO meeting_minutes (meeting_type, meeting_date, meeting_time, participants, purpose, conclusions, created_by) 
            VALUES ('directivos_familia', '2024-01-15', '10:00:00', 'Directivos y Padres', 'Reunión de inicio de ciclo lectivo', 'Se acordó calendario de actividades', 1)
        `);
        console.log('   ✓ Successfully inserted a meeting record with ID:', testMeeting.insertId);
        
        // Test 2: Test vaccination_records table
        console.log('\n2. Testing vaccination_records table...');
        // First, let's get an existing student to link the vaccination to
        const students = await conn.query('SELECT id FROM student LIMIT 1');
        if (students.length > 0) {
            const testVaccination = await conn.query(`
                INSERT INTO vaccination_records (student_id, vaccine_name, vaccine_date, status) 
                VALUES (?, 'Vacuna contra el Sarampión', '2023-05-20', 'completo')
            `, [students[0].id]);
            console.log('   ✓ Successfully inserted a vaccination record with ID:', testVaccination.insertId);
        } else {
            console.log('   - No students found to test vaccination records');
        }
        
        // Test 3: Test document_review table
        console.log('\n3. Testing document_review table...');
        const testReview = await conn.query(`
            INSERT INTO document_review (document_type, document_id, reviewer_id, status, notes) 
            VALUES ('alumno', 1, 1, 'pendiente', 'Documento necesita revisión adicional')
        `);
        console.log('   ✓ Successfully inserted a document review record with ID:', testReview.insertId);
        
        console.log('\n=== Testing Updated Tables ===');
        
        // Test 4: Test updated attendance table with staff_id
        console.log('\n4. Testing attendance table with staff_id...');
        const staff = await conn.query('SELECT id FROM staff LIMIT 1');
        if (staff.length > 0) {
            const testAttendance = await conn.query(`
                INSERT INTO attendance (date, status, staff_id) 
                VALUES ('2024-01-15', 'presente', ?)
            `, [staff[0].id]);
            console.log('   ✓ Successfully inserted staff attendance record with ID:', testAttendance.insertId);
        } else {
            console.log('   - No staff found to test staff attendance');
        }
        
        // Test 5: Test updated activity table with classroom_id
        console.log('\n5. Testing activity table with classroom_id...');
        const classrooms = await conn.query('SELECT id FROM classroom LIMIT 1');
        if (classrooms.length > 0) {
            const testActivity = await conn.query(`
                INSERT INTO activity (name, teacher_id, classroom_id) 
                VALUES ('Clase de Música', 1, ?)
            `, [classrooms[0].id]);
            console.log('   ✓ Successfully inserted classroom activity record with ID:', testActivity.insertId);
        } else {
            console.log('   - No classrooms found to test classroom activities');
        }
        
        // Test 6: Test updated calendar table with staff_id and new event_type values
        console.log('\n6. Testing calendar table with new features...');
        const testCalendar = await conn.query(`
            INSERT INTO calendar (date, description, event_type, classroom_id, staff_id) 
            VALUES ('2024-02-15', 'Reunión con familias', 'reunion_directivos_familia', 1, 1)
        `);
        console.log('   ✓ Successfully inserted calendar event with new event_type and staff_id:', testCalendar.insertId);
        
        console.log('\n=== Testing Views ===');
        
        // Test 7: Test updated views
        console.log('\n7. Testing updated views...');
        const lotteryView = await conn.query('SELECT * FROM v_lottery_list_simple LIMIT 1');
        console.log('   ✓ Successfully queried v_lottery_list_simple view');
        
        const preinscriptosView = await conn.query('SELECT * FROM v_preinscriptos_with_pending_docs LIMIT 1');
        console.log('   ✓ Successfully queried v_preinscriptos_with_pending_docs view');
        
        const pendingDocsView = await conn.query('SELECT * FROM v_students_with_pending_docs LIMIT 1');
        console.log('   ✓ Successfully queried v_students_with_pending_docs view');
        
        console.log('\n=== All Tests Passed Successfully! ===');
        console.log('All database changes have been verified and are working correctly.');
        
    } catch (error) {
        console.error('Error during testing:', error);
        throw error;
    } finally {
        if (conn) {
            conn.end();
            console.log('\nDatabase connection closed.');
        }
    }
}

// Run the test function
testDatabaseChanges()
    .then(() => {
        console.log('\nDatabase testing completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\nDatabase testing failed:', error);
        process.exit(1);
    });
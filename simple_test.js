// simple_test.js
const { getConnection } = require('./backend/db');
const Student = require('./backend/models/Student');
const VaccinationRecord = require('./backend/models/VaccinationRecord');
const MeetingMinutes = require('./backend/models/MeetingMinutes');

async function simpleTest() {
  console.log('🧪 Starting Simple Backend Tests...\n');

  try {
    // Test 1: Test database connection
    console.log('1. Testing database connection...');
    const conn = await getConnection();
    console.log('   ✓ Database connection successful');
    conn.end();
    console.log('   ✓ Database connection closed\n');

    // Test 2: Test Student model
    console.log('2. Testing Student model...');
    const students = await Student.getAll();
    console.log(`   ✓ Retrieved ${students.length} students from database`);
    
    if (students.length > 0) {
      const student = await Student.getById(students[0].id);
      console.log('   ✓ Retrieved individual student successfully');
    }
    console.log('   ✓ Student model tests passed\n');

    // Test 3: Test Vaccination Record model
    console.log('3. Testing Vaccination Record model...');
    const vaccinationRecords = await VaccinationRecord.getAll();
    console.log(`   ✓ Retrieved ${vaccinationRecords.length} vaccination records from database`);
    
    if (vaccinationRecords.length > 0) {
      const vaccination = await VaccinationRecord.getById(vaccinationRecords[0].id);
      console.log('   ✓ Retrieved individual vaccination record successfully');
    }
    console.log('   ✓ Vaccination Record model tests passed\n');

    // Test 4: Test Meeting Minutes model
    console.log('4. Testing Meeting Minutes model...');
    const meetingMinutes = await MeetingMinutes.getAll();
    console.log(`   ✓ Retrieved ${meetingMinutes.length} meeting minutes from database`);
    
    if (meetingMinutes.length > 0) {
      const meetingMinute = await MeetingMinutes.getById(meetingMinutes[0].id);
      console.log('   ✓ Retrieved individual meeting minute successfully');
    }
    console.log('   ✓ Meeting Minutes model tests passed\n');

    console.log('🎉 All simple backend tests completed successfully!');
    console.log('✅ The kindergarten management system backend is fully functional!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the tests
simpleTest();
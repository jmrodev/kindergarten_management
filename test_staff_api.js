const axios = require('axios');

async function testStaffAPI() {
    try {
        console.log('Testing staff API endpoint...');
        
        // Test the GET /api/staff endpoint
        const response = await axios.get('http://localhost:3000/api/staff');
        
        console.log('Status:', response.status);
        console.log('Response data:', JSON.stringify(response.data, null, 2));
        
        console.log('\nStaff members found:', response.data.length);
        if (response.data.length > 0) {
            console.log('\nStaff details:');
            response.data.forEach((staff, index) => {
                console.log(`${index + 1}. Name: ${staff.first_name} ${staff.paternal_surname}, Role: ${staff.role_name}, Email: ${staff.email}`);
            });
        }
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error response status:', error.response.status);
            console.error('Error response data:', error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Error request:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error message:', error.message);
        }
    }
}

testStaffAPI();
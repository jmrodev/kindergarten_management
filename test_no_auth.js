// This test simulates how the frontend calls the staff API without auth header
const http = require('http');
const url = require('url');

function testStaffAPIWithoutAuth() {
    console.log('Testing staff API endpoint without Authorization header...');

    const apiUrl = 'http://localhost:3000/api/staff';
    const parsedUrl = url.parse(apiUrl);

    // Make request without auth header
    const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 3000,
        path: parsedUrl.path,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    };

    const req = http.request(options, (res) => {
        console.log('Status:', res.statusCode);
        console.log('Headers:', res.headers);
        
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            try {
                const response = JSON.parse(data);
                console.log('Response length:', Array.isArray(response) ? response.length : 'Not an array');
                
                if (Array.isArray(response)) {
                    console.log('All records:');
                    response.forEach((staff, index) => {
                        console.log(`${index + 1}. Name: ${staff.first_name} ${staff.paternal_surname}, Role: ${staff.role_name}`);
                    });
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                console.log('Raw response:', data.substring(0, 200) + '...');
            }
        });
    });

    req.on('error', (error) => {
        console.error('Request error:', error);
    });

    req.end();
}

testStaffAPIWithoutAuth();
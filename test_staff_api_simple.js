const https = require('https');
const http = require('http');
const url = require('url');

function testStaffAPI() {
    console.log('Testing staff API endpoint...');

    const apiUrl = 'http://localhost:3000/api/staff';
    const parsedUrl = url.parse(apiUrl);

    const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 3000,
        path: parsedUrl.path,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const req = http.request(options, (res) => {
        console.log('Status:', res.statusCode);
        
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            try {
                const response = JSON.parse(data);
                console.log('Response data:', JSON.stringify(response, null, 2));
                
                console.log('\nStaff members found:', Array.isArray(response) ? response.length : 'Not an array');
                if (Array.isArray(response)) {
                    console.log('\nStaff details:');
                    response.forEach((staff, index) => {
                        console.log(`${index + 1}. Name: ${staff.first_name} ${staff.paternal_surname}, Role: ${staff.role_name}, Email: ${staff.email}`);
                    });
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                console.log('Raw response:', data);
            }
        });
    });

    req.on('error', (error) => {
        console.error('Request error:', error);
    });

    req.end();
}

testStaffAPI();
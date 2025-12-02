// This test simulates how the frontend calls the staff API
const https = require('https');
const http = require('http');
const url = require('url');

function testFrontendStaffAPI() {
    console.log('Testing staff API endpoint as the frontend would...');

    const apiUrl = 'http://localhost:3000/api/staff';
    const parsedUrl = url.parse(apiUrl);

    // Simulate the exact request that the frontend would make
    const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 3000,
        path: parsedUrl.path,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            // Simulate a browser request
            'User-Agent': 'Mozilla/5.0 (compatible; StaffListComponent)',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
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
                    console.log('First few records:');
                    response.slice(0, 3).forEach((staff, index) => {
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

testFrontendStaffAPI();
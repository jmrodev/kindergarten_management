// Este script verifica la estructura exacta de la respuesta del API
const http = require('http');
const url = require('url');

function testStaffAPIResponseStructure() {
    console.log('Testing staff API response structure...');

    const apiUrl = 'http://localhost:3000/api/staff';
    const parsedUrl = url.parse(apiUrl);

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
        
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            try {
                const response = JSON.parse(data);
                console.log('Response type:', typeof response);
                console.log('Is array?', Array.isArray(response));
                
                // Simular el código frontend
                const frontendResult = response.data?.data || [];
                console.log('Frontend result (response.data.data || []):', frontendResult.length);
                
                // Resultado correcto
                const correctResult = response || [];
                console.log('Correct result (response || []):', correctResult.length);
                
                if (Array.isArray(response)) {
                    console.log('The API returns an array directly, not { data: { data: [] } }');
                    console.log('This is the issue - frontend expects response.data.data but gets response directly');
                } else {
                    console.log('The API returns an object, checking for data property...');
                    console.log('Has data property?', 'data' in response);
                    if ('data' in response) {
                        console.log('response.data type:', typeof response.data);
                        console.log('Is response.data an array?', Array.isArray(response.data));
                    }
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        });
    });

    req.on('error', (error) => {
        console.error('Request error:', error);
    });

    req.end();
}

testStaffAPIResponseStructure();
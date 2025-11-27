// backend/test_serialization.js
// Script de prueba para verificar la serialización BigInt

const { serializeBigInt } = require('./utils/serialization');

console.log('=== Test de Serialización BigInt ===\n');

// Test 1: Objeto simple con BigInt
const test1 = {
    id: BigInt(123456789012345),
    nombre: 'Juan Pérez',
    edad: 5
};

console.log('Test 1 - Objeto con BigInt:');
console.log('Original:', test1);
console.log('Serializado:', serializeBigInt(test1));
console.log('JSON:', JSON.stringify(serializeBigInt(test1)));
console.log('');

// Test 2: Objeto anidado con múltiples BigInt
const test2 = {
    alumno: {
        id: BigInt(1),
        nombre: 'María González'
    },
    direccion: {
        id: BigInt(100),
        calle: 'San Martín 123'
    },
    sala: {
        id: BigInt(5),
        capacidad: 20
    }
};

console.log('Test 2 - Objeto anidado:');
console.log('Original:', test2);
console.log('Serializado:', serializeBigInt(test2));
console.log('JSON:', JSON.stringify(serializeBigInt(test2)));
console.log('');

// Test 3: Array de objetos con BigInt
const test3 = [
    { id: BigInt(1), nombre: 'Alumno 1' },
    { id: BigInt(2), nombre: 'Alumno 2' },
    { id: BigInt(3), nombre: 'Alumno 3' }
];

console.log('Test 3 - Array de objetos:');
console.log('Original:', test3);
console.log('Serializado:', serializeBigInt(test3));
console.log('JSON:', JSON.stringify(serializeBigInt(test3)));
console.log('');

console.log('✅ Todos los tests completados sin errores');

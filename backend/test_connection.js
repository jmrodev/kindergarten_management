require('dotenv').config();
const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'kindergarten_user',
    password: process.env.DB_PASSWORD || 'kindergarten_password',
    database: process.env.DB_NAME || 'kindergarten_db',
    connectionLimit: 5
});

async function testConnection() {
    let conn;
    try {
        console.log('Intentando conectar a la base de datos...');
        conn = await pool.getConnection();
        console.log('Conexión exitosa a la base de datos');
        
        // Verificar si existe la tabla staff y el usuario admin
        const result = await conn.query('SELECT id, first_name, paternal_surname, email, is_active FROM staff WHERE email = ?', ['admin@kindergarten.com']);
        
        if (result.length > 0) {
            console.log('Usuario admin encontrado:', result[0]);
        } else {
            console.log('No se encontró el usuario admin@kindergarten.com en la base de datos');
        }
        
        // Verificar todas las tablas existentes
        const tables = await conn.query('SHOW TABLES');
        console.log('Tablas en la base de datos:', tables);
        
    } catch (err) {
        console.error('Error en la conexión o consulta:', err);
    } finally {
        if (conn) conn.release();
    }
}

testConnection().then(() => {
    console.log('Prueba completada');
    process.exit(0);
});
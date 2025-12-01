require('dotenv').config();
const bcrypt = require('bcryptjs');

// Hash de la contraseña por defecto '12345678'
const defaultPassword = '12345678';

// Hash almacenado en la base de datos
const storedHash = '$2b$10$KztEjpwYr/rzl7OAKLRWf.Citp8esIqisRoqTOPEWJu.HYRTBcMZ6';

// Comparar la contraseña con el hash
bcrypt.compare(defaultPassword, storedHash)
  .then(match => {
    console.log('¿La contraseña coincide con el hash?', match);
    console.log('Contraseña por defecto:', defaultPassword);
    console.log('Hash almacenado:', storedHash);
    
    // Si no coincide, generamos un nuevo hash para probar
    if (!match) {
      bcrypt.hash(defaultPassword, 10)
        .then(hash => {
          console.log('Nuevo hash generado:', hash);
          // Comparar con el nuevo hash
          return bcrypt.compare(defaultPassword, hash);
        })
        .then(result => {
          console.log('¿Nueva contraseña coincide con nuevo hash?', result);
        });
    }
  })
  .catch(err => {
    console.error('Error comparando contraseñas:', err);
  });
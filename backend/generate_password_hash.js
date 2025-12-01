#!/usr/bin/env node

// Script para generar un hash bcrypt para la contraseña de administrador
const bcrypt = require('bcryptjs');

// Contraseña nueva para el administrador
const nuevaPassword = 'admin123';  // Puedes cambiar esta contraseña según necesites

// Número de rondas para el hash bcrypt (10 es un valor estándar)
const saltRounds = 10;

// Generar el hash
bcrypt.hash(nuevaPassword, saltRounds)
  .then(hash => {
    console.log('Contraseña original:', nuevaPassword);
    console.log('Hash bcrypt:', hash);

    // Comando SQL para actualizar la contraseña en la base de datos
    console.log('\nPara actualizar la contraseña en la base de datos, usa este comando SQL:');
    console.log(`UPDATE staff SET password_hash = '${hash}' WHERE email = 'admin@kindergarten.com';`);
  })
  .catch(error => {
    console.error('Error al generar el hash:', error);
  });
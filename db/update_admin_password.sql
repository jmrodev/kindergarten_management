-- Script SQL para actualizar la contraseña de administrador
-- Fecha: 1 de diciembre de 2025
-- Nuevo password: admin123
-- Hash generado: $2b$10$9Wbi.el7OD9JiiS7JX.USOdyB6mSJlHZwkTH47rIFjDpeUlgDsPki

USE kindergarten_db;

-- Actualizar la contraseña del usuario administrador
UPDATE staff
SET password_hash = '$2b$10$9Wbi.el7OD9JiiS7JX.USOdyB6mSJlHZwkTH47rIFjDpeUlgDsPki'
WHERE email = 'admin@kindergarten.com';

-- Verificar que la actualización se haya realizado correctamente
SELECT
    id,
    first_name,
    paternal_surname,
    email,
    is_active
FROM staff
WHERE email = 'admin@kindergarten.com';

-- Fin del script
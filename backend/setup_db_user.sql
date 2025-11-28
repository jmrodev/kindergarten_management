-- Script para crear usuario de base de datos seguro
-- Ejecuta esto en MariaDB como root

-- Crear usuario para la aplicación
CREATE USER IF NOT EXISTS 'kindergarten_user'@'localhost' IDENTIFIED BY 'kindergarten_password';

-- Dar permisos solo a la base de datos específica
GRANT ALL PRIVILEGES ON kindergarten_db.* TO 'kindergarten_user'@'localhost';

-- Aplicar cambios
FLUSH PRIVILEGES;

-- Verificar permisos
SHOW GRANTS FOR 'kindergarten_user'@'localhost';

SELECT 'Usuario creado exitosamente!' AS resultado;

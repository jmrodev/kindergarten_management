-- Safe Migration: Add authentication fields to staff table (checks if exists)
-- Date: 2024-11-27

-- Add email if not exists
SET @exist_email := (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'kindergarten_db' AND TABLE_NAME = 'staff' AND COLUMN_NAME = 'email');
SET @sqlstmt := IF(@exist_email = 0, 
    'ALTER TABLE staff ADD COLUMN email VARCHAR(255) UNIQUE AFTER phone', 
    'SELECT "email column already exists" AS Info');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;

-- Add password_hash if not exists
SET @exist_pass := (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'kindergarten_db' AND TABLE_NAME = 'staff' AND COLUMN_NAME = 'password_hash');
SET @sqlstmt := IF(@exist_pass = 0, 
    'ALTER TABLE staff ADD COLUMN password_hash VARCHAR(255) AFTER email', 
    'SELECT "password_hash column already exists" AS Info');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;

-- Add is_active if not exists
SET @exist_active := (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'kindergarten_db' AND TABLE_NAME = 'staff' AND COLUMN_NAME = 'is_active');
SET @sqlstmt := IF(@exist_active = 0, 
    'ALTER TABLE staff ADD COLUMN is_active BOOLEAN DEFAULT TRUE AFTER password_hash', 
    'SELECT "is_active column already exists" AS Info');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;

-- Add created_at if not exists
SET @exist_created := (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'kindergarten_db' AND TABLE_NAME = 'staff' AND COLUMN_NAME = 'created_at');
SET @sqlstmt := IF(@exist_created = 0, 
    'ALTER TABLE staff ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP', 
    'SELECT "created_at column already exists" AS Info');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;

-- Add last_login if not exists
SET @exist_login := (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'kindergarten_db' AND TABLE_NAME = 'staff' AND COLUMN_NAME = 'last_login');
SET @sqlstmt := IF(@exist_login = 0, 
    'ALTER TABLE staff ADD COLUMN last_login TIMESTAMP NULL', 
    'SELECT "last_login column already exists" AS Info');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;

-- Create index for faster email lookup if not exists
SET @exist_idx := (SELECT COUNT(*) FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = 'kindergarten_db' AND TABLE_NAME = 'staff' AND INDEX_NAME = 'idx_staff_email');
SET @sqlstmt := IF(@exist_idx = 0, 
    'CREATE INDEX idx_staff_email ON staff(email)', 
    'SELECT "idx_staff_email already exists" AS Info');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;

-- Insert roles if not exist
INSERT INTO role (role_name, access_level_id) 
VALUES ('admin', 1), ('secretaria', 2), ('maestro', 3)
ON DUPLICATE KEY UPDATE role_name=role_name;

-- Insert admin user if not exists (password: admin123)
INSERT INTO staff (
    first_name, 
    paternal_surname, 
    maternal_surname,
    phone, 
    email, 
    password_hash,
    role_id,
    is_active
)
SELECT 
    'Administrador',
    'Sistema',
    'Principal',
    '123456789',
    'admin@jardin.com',
    '$2a$10$K7L/l0VBZ7mFVKlYXqKp1O7YhX1rYrE3LxqJGQj8rHj5xBM4KvF1e',
    (SELECT id FROM role WHERE role_name = 'admin' LIMIT 1),
    TRUE
WHERE NOT EXISTS (SELECT 1 FROM staff WHERE email = 'admin@jardin.com');

SELECT 'Migration completed successfully!' AS Result;

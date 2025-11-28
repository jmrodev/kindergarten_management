-- Migration: Add authentication fields to staff table
-- Date: 2024-11-27
-- Description: Add email and password fields for authentication

ALTER TABLE staff 
ADD COLUMN email VARCHAR(255) UNIQUE AFTER phone,
ADD COLUMN password_hash VARCHAR(255) AFTER email,
ADD COLUMN is_active BOOLEAN DEFAULT TRUE AFTER password_hash,
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN last_login TIMESTAMP NULL;

-- Create index for faster email lookup
CREATE INDEX idx_staff_email ON staff(email);

-- Insert default admin user (password: admin123)
-- Password hash is bcrypt of 'admin123'
INSERT INTO role (role_name, access_level_id) 
VALUES ('admin', 1), ('secretaria', 2), ('maestro', 3)
ON DUPLICATE KEY UPDATE role_name=role_name;

INSERT INTO staff (
    first_name, 
    paternal_surname, 
    maternal_surname,
    phone, 
    email, 
    password_hash,
    role_id
) VALUES (
    'Administrador',
    'Sistema',
    'Principal',
    '123456789',
    'admin@jardin.com',
    '$2a$10$K7L/l0VBZ7mFVKlYXqKp1O7YhX1rYrE3LxqJGQj8rHj5xBM4KvF1e',
    (SELECT id FROM role WHERE role_name = 'admin' LIMIT 1)
);

// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { generateToken, protect } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler'); // Import AppError
const { sanitizeObject, sanitizeWhitespace } = require('../utils/sanitization'); // Import sanitization utilities

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
    const pool = req.app.get('pool');
    const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);
    const { email, password } = sanitizedBody;

    if (!email || !password) {
        return next(new AppError('Email y contraseña son requeridos', 400));
    }

    try {
        // Buscar usuario por email
        const rows = await pool.query(
            `SELECT s.*, r.role_name as role 
             FROM staff s
             LEFT JOIN role r ON s.role_id = r.id
             WHERE s.email = ? AND s.is_active = TRUE`,
            [email]
        );

        if (rows.length === 0) {
            return next(new AppError('Credenciales inválidas', 401));
        }

        const user = rows[0];

        // Verificar que el usuario tenga password_hash
        if (!user.password_hash) {
            return next(new AppError('Usuario no configurado para acceso', 401));
        }

        // Verificar contraseña
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return next(new AppError('Credenciales inválidas', 401));
        }

        // Actualizar último login
        await pool.query(
            'UPDATE staff SET last_login = NOW() WHERE id = ?',
            [user.id]
        );

        // Generar token
        const token = generateToken(user);

        console.log('[Login] User object sent to frontend:', {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.paternal_surname,
            role: user.role
        });

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.paternal_surname,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error in login:', error);
        next(new AppError('Error al iniciar sesión', 500));
    }
});

// GET /api/auth/me - Obtener usuario actual
router.get('/me', protect, async (req, res, next) => {
    const pool = req.app.get('pool');

    try {
        const rows = await pool.query(
            `SELECT s.id, s.first_name, s.middle_name_optional, 
                    s.paternal_surname, s.maternal_surname, s.email, 
                    s.phone, s.last_login, r.role_name as role
             FROM staff s
             LEFT JOIN role r ON s.role_id = r.id
             WHERE s.id = ?`,
            [req.user.id]
        );

        if (rows.length === 0) {
            return next(new AppError('Usuario no encontrado', 404));
        }

        const user = rows[0];
        res.json({
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            middleName: user.middle_name_optional,
            paternalSurname: user.paternal_surname,
            maternalSurname: user.maternal_surname,
            phone: user.phone,
            role: user.role,
            lastLogin: user.last_login
        });
    } catch (error) {
        console.error('Error in /me:', error);
        next(new AppError('Error al obtener datos del usuario', 500));
    }
});

// POST /api/auth/register - Registrar nuevo usuario (solo admin)
router.post('/register', protect, async (req, res, next) => {
    const pool = req.app.get('pool');
    
    // Solo admin puede registrar usuarios
    if (req.user.role !== 'Administrator') { // Changed from 'admin' to 'Administrator' for consistency with role_name
        return next(new AppError('Solo administradores pueden registrar usuarios', 403));
    }

    const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);
    const { 
        firstName, 
        paternalSurname, 
        maternalSurname, 
        email, 
        password, 
        phone,
        roleName 
    } = sanitizedBody;

    if (!firstName || !paternalSurname || !email || !password) {
        return next(new AppError('Faltan campos requeridos', 400));
    }

    if (password.length < 6) {
        return next(new AppError('La contraseña debe tener al menos 6 caracteres', 400));
    }

    try {
        // Verificar si el email ya existe
        const existing = await pool.query('SELECT id FROM staff WHERE email = ?', [email]);
        if (existing.length > 0) {
            return next(new AppError('El email ya está registrado', 400));
        }

        // Hash de la contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        // Obtener role_id
        const roleRows = await pool.query('SELECT id FROM role WHERE role_name = ?', [roleName || 'Secretary']); // Default to 'Secretary'
        const roleId = roleRows.length > 0 ? roleRows[0].id : null;

        // Insertar usuario
        const result = await pool.query(
            `INSERT INTO staff (first_name, paternal_surname, maternal_surname, email, password_hash, phone, role_id, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)`,
            [firstName, paternalSurname, maternalSurname || '', email, passwordHash, phone || '', roleId]
        );

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            userId: result.insertId
        });
    } catch (error) {
        console.error('Error in register:', error);
        next(new AppError('Error al registrar usuario', 500));
    }
});

// POST /api/auth/change-password - Cambiar contraseña
router.post('/change-password', protect, async (req, res, next) => {
    const pool = req.app.get('pool');
    const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);
    const { currentPassword, newPassword } = sanitizedBody;

    if (!currentPassword || !newPassword) {
        return next(new AppError('Se requieren ambas contraseñas', 400));
    }

    if (newPassword.length < 6) {
        return next(new AppError('La nueva contraseña debe tener al menos 6 caracteres', 400));
    }

    try {
        // Obtener contraseña actual
        const rows = await pool.query('SELECT password_hash FROM staff WHERE id = ?', [req.user.id]);
        
        if (rows.length === 0) {
            return next(new AppError('Usuario no encontrado', 404));
        }

        // Verificar contraseña actual
        const validPassword = await bcrypt.compare(currentPassword, rows[0].password_hash);
        if (!validPassword) {
            return next(new AppError('Contraseña actual incorrecta', 401));
        }

        // Hash de la nueva contraseña
        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        // Actualizar contraseña
        await pool.query('UPDATE staff SET password_hash = ? WHERE id = ?', [newPasswordHash, req.user.id]);

        res.json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        console.error('Error in change-password:', error);
        next(new AppError('Error al cambiar la contraseña', 500));
    }
});

module.exports = router;

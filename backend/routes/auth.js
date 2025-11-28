// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { generateToken, authenticateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const pool = req.app.get('pool');
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
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
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const user = rows[0];

        // Verificar que el usuario tenga password_hash
        if (!user.password_hash) {
            return res.status(401).json({ error: 'Usuario no configurado para acceso' });
        }

        // Verificar contraseña
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Actualizar último login
        await pool.query(
            'UPDATE staff SET last_login = NOW() WHERE id = ?',
            [user.id]
        );

        // Generar token
        const token = generateToken(user);

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
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// GET /api/auth/me - Obtener usuario actual
router.get('/me', authenticateToken, async (req, res) => {
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
            return res.status(404).json({ error: 'Usuario no encontrado' });
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
        res.status(500).json({ error: 'Error al obtener datos del usuario' });
    }
});

// POST /api/auth/register - Registrar nuevo usuario (solo admin)
router.post('/register', authenticateToken, async (req, res) => {
    const pool = req.app.get('pool');
    
    // Solo admin puede registrar usuarios
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Solo administradores pueden registrar usuarios' });
    }

    const { 
        firstName, 
        paternalSurname, 
        maternalSurname, 
        email, 
        password, 
        phone,
        roleName 
    } = req.body;

    if (!firstName || !paternalSurname || !email || !password) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    try {
        // Verificar si el email ya existe
        const existing = await pool.query('SELECT id FROM staff WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        // Hash de la contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        // Obtener role_id
        const roleRows = await pool.query('SELECT id FROM role WHERE role_name = ?', [roleName || 'secretaria']);
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
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

// POST /api/auth/change-password - Cambiar contraseña
router.post('/change-password', authenticateToken, async (req, res) => {
    const pool = req.app.get('pool');
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Se requieren ambas contraseñas' });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' });
    }

    try {
        // Obtener contraseña actual
        const rows = await pool.query('SELECT password_hash FROM staff WHERE id = ?', [req.user.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verificar contraseña actual
        const validPassword = await bcrypt.compare(currentPassword, rows[0].password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Contraseña actual incorrecta' });
        }

        // Hash de la nueva contraseña
        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        // Actualizar contraseña
        await pool.query('UPDATE staff SET password_hash = ? WHERE id = ?', [newPasswordHash, req.user.id]);

        res.json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        console.error('Error in change-password:', error);
        res.status(500).json({ error: 'Error al cambiar la contraseña' });
    }
});

module.exports = router;

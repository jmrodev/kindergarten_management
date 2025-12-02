// const { pool } = require('../db'); // This is incorrect, pool is not exported directly.
const StudentRepository = require('../repositories/StudentRepository');
const Student = require('../models/Student');
const Address = require('../models/Address');
const EmergencyContact = require('../models/EmergencyContact');
const Guardian = require('../models/Guardian');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { sanitizeObject, sanitizeWhitespace } = require('../utils/sanitization'); // Import sanitization utilities

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads/documents');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos JPG, PNG o PDF'));
        }
    }
});

class ParentPortalController {
    ensureAuthenticated(req, res, next) {
        // Para JWT, la autenticación se maneja en el middleware 'protect'
        // Este método es mantenido para compatibilidad, pero no se usará con JWT
        // ya que la verificación se hace con el middleware 'protect' importado en las rutas
        if (req.user) {
            return next();
        }
        res.status(401).json({ error: 'Not authenticated' });
    }

    async checkAuth(req, res) {
        try {
            // Para JWT opcional, req.user puede ser null si no hay token o es inválido
            if (req.user) {
                res.json({
                    authenticated: true,
                    user: {
                        id: req.user.id,
                        email: req.user.email,
                        name: req.user.name,
                        google_user: req.user.google_user
                    }
                });
            } else {
                res.json({ authenticated: false });
            }
        } catch (error) {
            console.error('Check auth error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    async getDraftByUserId(req, res) {
        let conn;
        try {
            const pool = req.app.get('pool');
            const userId = req.params.userId; // Permitir obtener el borrador de un usuario específico

            // Verificar que el usuario esté autenticado y que el ID coincida o tenga permisos adecuados
            if (req.user.id != userId) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            conn = await pool.getConnection();
            const rows = await conn.query(
                'SELECT * FROM parent_registration_drafts WHERE user_id = ?',
                [userId]
            );

            if (rows.length > 0) {
                let formData;
                try {
                    // Intentar parsear el JSON
                    formData = typeof rows[0].form_data === 'string'
                        ? JSON.parse(rows[0].form_data)
                        : rows[0].form_data;
                } catch (parseError) {
                    console.error('Error parsing draft data:', parseError);
                    formData = {};
                }

                res.json({
                    data: {
                        data: formData,
                        currentStep: rows[0].current_step,
                        updatedAt: rows[0].updated_at
                    }
                });
            } else {
                res.json({ data: null });
            }
        } catch (error) {
            console.error('Get draft error:', error);
            res.status(500).json({ error: 'Error loading draft' });
        } finally {
            if (conn) conn.release();
        }
    }

    async getDraft(req, res) {
        // Este método ahora se usará para obtener el borrador del usuario actual
        this.getDraftByUserId(req, res);
    }

    async saveDraft(req, res) {
        let conn;
        try {
            const pool = req.app.get('pool');
            const userId = req.user.id;
            const { data, currentStep } = req.body;

            // Sanitize data before saving as draft
            const sanitizedData = sanitizeObject(data, sanitizeWhitespace);

            conn = await pool.getConnection();
            await conn.query(
                `INSERT INTO parent_registration_drafts (user_id, form_data, current_step, updated_at)
                 VALUES (?, ?, ?, NOW())
                 ON DUPLICATE KEY UPDATE form_data = ?, current_step = ?, updated_at = NOW()`,
                [userId, JSON.stringify(sanitizedData), currentStep, JSON.stringify(sanitizedData), currentStep]
            );

            res.json({ success: true, message: 'Draft saved' });
        } catch (error) {
            console.error('Save draft error:', error);
            res.status(500).json({ error: 'Error saving draft' });
        } finally {
            if (conn) conn.release();
        }
    }

    async deleteDraftByUserId(req, res) {
        let conn;
        try {
            const pool = req.app.get('pool');
            const userId = req.params.userId; // Permitir obtener el borrador de un usuario específico

            // Verificar que el usuario esté autenticado y que el ID coincida o tenga permisos adecuados
            if (req.user.id != userId) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            conn = await pool.getConnection();
            await conn.query('DELETE FROM parent_registration_drafts WHERE user_id = ?', [userId]);
            res.json({ success: true });
        } catch (error) {
            console.error('Delete draft error:', error);
            res.status(500).json({ error: 'Error deleting draft' });
        } finally {
            if (conn) conn.release();
        }
    }

    async deleteDraft(req, res) {
        // Este método ahora se usará para eliminar el borrador del usuario actual
        this.deleteDraftByUserId(req, res);
    }

    async submitRegistration(req, res) {
        const pool = req.app.get('pool');
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            // Get Tutor role ID
            const tutorRole = await conn.query("SELECT id FROM role WHERE role_name = 'Tutor'");
            if (tutorRole.length === 0) {
                throw new Error("Tutor role not found. Please initialize the database correctly.");
            }
            const tutorRoleId = tutorRole[0].id;

            // Sanitize all string inputs from req.body
            const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);

            const {
                // Datos alumno (using the new form structure from RegisterChildForm.jsx)
                first_name, middle_name_optional, third_name_optional, nickname_optional,
                paternal_surname, maternal_surname, dni, birth_date,
                // Address
                street, number, city, provincia, postal_code_optional,
                // Emergency contact
                emergency_contact_full_name, emergency_contact_relationship,
                emergency_contact_phone, emergency_contact_alternative_phone,
                emergency_contact_authorized_pickup,
                // Medical info
                health_insurance, affiliate_number, allergies, medications,
                medical_observations, blood_type, pediatrician_name, pediatrician_phone,
                vaccination_status, special_needs,
                // Authorizations
                photo_authorization, trip_authorization, medical_attention_authorization,
                // Additional info
                has_siblings_in_school, observations,
                // School info
                classroom_id, shift, status, enrollment_date
            } = sanitizedBody;

            // 1. Crear dirección
            const addressResult = await conn.query(
                `INSERT INTO address (street, number, city, provincia, postal_code_optional)
                 VALUES (?, ?, ?, ?, ?)`,
                [street || null, number || null, city || null, provincia || null, postal_code_optional || null]
            );
            const addressId = addressResult.insertId;

            // 2. Crear contacto de emergencia
            const emergencyResult = await conn.query(
                `INSERT INTO emergency_contact (full_name, relationship, phone, alternative_phone, is_authorized_pickup)
                 VALUES (?, ?, ?, ?, ?)`,
                [emergency_contact_full_name || null, emergency_contact_relationship || null,
                 emergency_contact_phone || null, emergency_contact_alternative_phone || null,
                 emergency_contact_authorized_pickup || false]
            );
            const emergencyContactId = emergencyResult.insertId;

            // 3. Crear alumno con TODOS los campos desde el formulario de inscripción
            const studentResult = await conn.query(
                `INSERT INTO student (
                    first_name, middle_name_optional, third_name_optional, nickname_optional,
                    paternal_surname, maternal_surname, dni, birth_date, address_id,
                    emergency_contact_id, classroom_id, shift, status, enrollment_date,
                    health_insurance, affiliate_number, allergies, medications,
                    medical_observations, blood_type, pediatrician_name, pediatrician_phone,
                    photo_authorization, trip_authorization, medical_attention_authorization,
                    has_siblings_in_school, special_needs, vaccination_status, observations
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    first_name || null, middle_name_optional || null, third_name_optional || null, nickname_optional || null,
                    paternal_surname || null, maternal_surname || null, dni || null, birth_date || null, addressId,
                    emergencyContactId, classroom_id || null, shift || null, status || 'preinscripto', enrollment_date || new Date(),
                    health_insurance || null, affiliate_number || null, allergies || null, medications || null,
                    medical_observations || null, blood_type || null, pediatrician_name || null, pediatrician_phone || null,
                    photo_authorization || false, trip_authorization || false, medical_attention_authorization || false,
                    has_siblings_in_school || false, special_needs || null, vaccination_status || 'no_informado', observations || null
                ]
            );
            const studentId = studentResult.insertId;

            // 4. Crear o asociar tutor/responsable (el padre que está registrando)
            // Primero verificar si ya existe un guardian para este usuario del portal de padres
            const existingGuardianQuery = await conn.query(
                `SELECT id FROM guardian WHERE parent_portal_user_id = ?`,
                [req.user.id]
            );

            let guardianId;
            if (existingGuardianQuery.length > 0) {
                // Si ya existe un guardian para este usuario del portal, usamos ese
                guardianId = existingGuardianQuery[0].id;
            } else {
                // Si no existe, creamos uno nuevo con información mínima
                const guardianResult = await conn.query(
                    `INSERT INTO guardian (
                        first_name, paternal_surname, dni, parent_portal_user_id, role_id
                    ) VALUES (?, ?, ?, ?, ?)`,
                    [req.user.name || 'Nombre', 'Apellido', 'SIN_DNI', req.user.id, tutorRoleId]
                );
                guardianId = guardianResult.insertId;
            }

            // 5. Relacionar tutor con alumno
            await conn.query(
                `INSERT INTO student_guardian (
                    student_id, guardian_id, relationship_type, is_primary
                ) VALUES (?, ?, 'padre', TRUE)`,
                [studentId, guardianId]
            );

            // 6. Registrar el envío con estado pending_review
            await conn.query(
                `INSERT INTO parent_portal_submissions (user_id, student_id, submitted_at, status)
                 VALUES (?, ?, NOW(), 'pending_review')`,
                [req.user.id, studentId]
            );

            await conn.commit();
            res.json({
                success: true,
                message: 'Registro completado exitosamente',
                studentId
            });
        } catch (error) {
            await conn.rollback();
            console.error('Submit registration error:', error);
            res.status(500).json({
                error: 'Error al procesar el registro',
                details: error.message
            });
        } finally {
            conn.release();
        }
    }

    async getParentUser(req, res) {
        let conn;
        try {
            const pool = req.app.get('pool');
            const parentId = req.params.id;
            conn = await pool.getConnection();

            const rows = await conn.query(
                'SELECT * FROM parent_portal_users WHERE id = ?',
                [parentId]
            );

            if (rows.length > 0) {
                res.json({
                    data: {
                        id: rows[0].id,
                        email: rows[0].email,
                        name: rows[0].name,
                        created_at: rows[0].created_at
                    }
                });
            } else {
                res.status(404).json({ error: 'Parent user not found' });
            }
        } catch (error) {
            console.error('Get parent user error:', error);
            res.status(500).json({ error: 'Error getting parent user' });
        } finally {
            if (conn) conn.release();
        }
    }

    async getStudentsByParent(req, res) {
        let conn;
        try {
            const pool = req.app.get('pool');
            const parentId = req.params.parentId;
            conn = await pool.getConnection();

            // Consulta para obtener los alumnos asociados a un padre a través de la tabla student_guardian
            const rows = await conn.query(
                `SELECT s.*, c.name as classroom_name
                 FROM student s
                 LEFT JOIN classroom c ON s.classroom_id = c.id
                 JOIN student_guardian sg ON s.id = sg.student_id
                 JOIN guardian g ON sg.guardian_id = g.id
                 WHERE g.parent_portal_user_id = ?`,
                [parentId]
            );

            res.json({
                data: rows
            });
        } catch (error) {
            console.error('Get students by parent error:', error);
            res.status(500).json({ error: 'Error getting students for parent' });
        } finally {
            if (conn) conn.release();
        }
    }

    async getEnrollmentStatus(req, res) {
        let conn;
        try {
            const pool = req.app.get('pool');
            conn = await pool.getConnection();

            // Find Tutor role ID
            const tutorRole = await conn.query("SELECT id FROM role WHERE role_name = 'Tutor'");
            if (tutorRole.length === 0) {
                return res.json({ enrollmentOpen: false, message: 'Tutor role not found. System configuration error.' });
            }
            const tutorRoleId = tutorRole[0].id;

            // Check if Tutor role has 'crear' permission for 'alumnos' module
            const permissions = await conn.query(
                `SELECT rp.is_granted
                 FROM role_permission rp
                 JOIN system_module sm ON rp.module_id = sm.id
                 JOIN permission_action pa ON rp.action_id = pa.id
                 WHERE rp.role_id = ? AND sm.module_key = 'alumnos' AND pa.action_key = 'crear'`,
                [tutorRoleId]
            );

            const enrollmentOpen = permissions.length > 0 && permissions[0].is_granted;
            res.json({ enrollmentOpen });

        } catch (error) {
            console.error('Error getting enrollment status:', error);
            res.status(500).json({ error: 'Error getting enrollment status', details: error.message });
        } finally {
            if (conn) conn.release();
        }
    }

    // Método para subir un documento
    uploadDocument(req, res) {
        return upload.single('document')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }

            if (!req.file) {
                return res.status(400).json({ error: 'No se subió ningún archivo' });
            }

            res.json({
                success: true,
                filePath: `/uploads/documents/${req.file.filename}`,
                fileName: req.file.originalname
            });
        });
    }
}

module.exports = new ParentPortalController();

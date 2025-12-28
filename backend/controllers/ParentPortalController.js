const StudentRepository = require('../repositories/StudentRepository');

const HealthInsuranceRepository = require('../repositories/HealthInsuranceRepository');
const PediatricianRepository = require('../repositories/PediatricianRepository');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/auth');
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
    async login(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son requeridos' });
        }

        let conn;
        try {
            const pool = req.app.get('pool');
            conn = await pool.getConnection();

            const rows = await conn.query('SELECT * FROM parent_portal_users WHERE email = ?', [email]);
            if (rows.length === 0) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            const user = rows[0];

            if (!user.password_hash) {
                return res.status(400).json({ error: 'Usuario registrado sin contraseña. Por favor contacte soporte.' });
            }

            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            const tokenUser = {
                id: user.id,
                email: user.email,
                name: user.name,
                google_id: user.google_id,
                role_id: user.role_id,
                role: 'Parent',
                parent_portal_user: true
            };

            const token = generateToken(tokenUser);

            res.json({
                success: true,
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role_id: user.role_id,
                    role: 'Parent'
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Error en el servidor: ' + error.message });
        } finally {
            if (conn) conn.release();
        }
    }

    async register(req, res) {
        console.log('[ParentPortalController] Register Request Body:', req.body);
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
        }

        let conn;
        try {
            const pool = req.app.get('pool');
            conn = await pool.getConnection();

            // Get Parent Role ID
            console.log('[ParentPortalController] Fetching Parent role id...');
            const roleQuery = await conn.query('SELECT id FROM role WHERE role_name = "Parent" LIMIT 1');
            const roleId = roleQuery.length > 0 ? roleQuery[0].id : null;
            console.log('[ParentPortalController] Role ID found:', roleId);

            const existing = await conn.query('SELECT id FROM parent_portal_users WHERE email = ?', [email]);
            if (existing.length > 0) {
                console.log('[ParentPortalController] Email already exists:', email);
                return res.status(400).json({ error: 'El email ya está registrado' });
            }

            const passwordHash = await bcrypt.hash(password, 10);

            console.log('[ParentPortalController] Inserting new user...');
            const result = await conn.query(
                'INSERT INTO parent_portal_users (email, password_hash, name, role_id, created_at) VALUES (?, ?, ?, ?, NOW())',
                [email, passwordHash, name, roleId]
            );
            console.log('[ParentPortalController] User inserted, ID:', result.insertId);

            const tokenUser = {
                id: result.insertId,
                email: email,
                name: name,
                role_id: roleId,
                role: 'Parent',
                parent_portal_user: true
            };

            const token = generateToken(tokenUser);

            res.status(201).json({
                success: true,
                message: 'Registro exitoso',
                token,
                user: {
                    id: result.insertId,
                    email: email,
                    name: name
                }
            });

        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({ error: 'Error al registrar usuario: ' + String(error.message || error) });
        } finally {
            if (conn) conn.release();
        }
    }

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

            // Registrar obra social si es nueva
            if (req.body.health_insurance) {
                const existing = await HealthInsuranceRepository.findByName(req.body.health_insurance);
                if (!existing) {
                    await conn.query("INSERT INTO health_insurance_providers (name) VALUES (?)", [req.body.health_insurance]);
                }
            }

            // Registrar/Actualizar pediatra si es nuevo o cambió teléfono
            if (req.body.pediatrician_name) {
                const existingPed = await PediatricianRepository.findByName(req.body.pediatrician_name);
                if (!existingPed) {
                    await conn.query("INSERT INTO pediatricians (full_name, phone) VALUES (?, ?)", [req.body.pediatrician_name, req.body.pediatrician_phone]);
                } else if (req.body.pediatrician_phone && existingPed.phone !== req.body.pediatrician_phone) {
                    await conn.query("UPDATE pediatricians SET phone = ? WHERE full_name = ?", [req.body.pediatrician_phone, req.body.pediatrician_name]);
                }
            }

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

            // 3. Crear alumno (sin emergency_contact_id)
            const studentResult = await conn.query(
                `INSERT INTO student (
                    first_name, middle_name_optional, third_name_optional, nickname_optional,
                    paternal_surname, maternal_surname, dni, birth_date, address_id,
                    classroom_id, shift, status, enrollment_date,
                    health_insurance, affiliate_number, allergies, medications,
                    medical_observations, blood_type, pediatrician_name, pediatrician_phone,
                    photo_authorization, trip_authorization, medical_attention_authorization,
                    has_siblings_in_school, special_needs, vaccination_status, observations, gender
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    first_name || null, middle_name_optional || null, third_name_optional || null, nickname_optional || null,
                    paternal_surname || null, maternal_surname || null, dni || null, birth_date || null, addressId,
                    classroom_id || null, shift || null, status || 'preinscripto', enrollment_date || new Date(),
                    health_insurance || null, affiliate_number || null, allergies || null, medications || null,
                    medical_observations || null, blood_type || null, pediatrician_name || null, pediatrician_phone || null,
                    photo_authorization || false, trip_authorization || false, medical_attention_authorization || false,
                    has_siblings_in_school || false, special_needs || null, vaccination_status || 'no_informado', observations || null,
                    req.body.gender || null
                ]
            );
            const studentId = studentResult.insertId;

            // 4. Crear o asociar tutor/responsable (el padre que está registrando)
            const guardiansInput = req.body.guardians || [];
            let primaryGuardianData = guardiansInput.find(g => g.is_primary) || guardiansInput[0];

            // Si no viene info de guardianes, usar info del usuario logueado como fallback (pero evitar SIN_DNI si es posible)
            if (!primaryGuardianData) {
                primaryGuardianData = {
                    first_name: req.user.name || 'Nombre',
                    paternal_surname: 'Apellido',
                    dni: req.user.dni || 'SIN_DNI_' + Date.now(), // Avoid unique constraint violation
                    email: req.user.email,
                    phone: '',
                    relationship: 'Padre/Madre'
                };
            }

            // Primero verificar si ya existe un guardian para este usuario del portal de padres
            const existingGuardianQuery = await conn.query(
                `SELECT id FROM guardian WHERE parent_portal_user_id = ?`,
                [req.user.id]
            );

            let guardianId;
            if (existingGuardianQuery.length > 0) {
                // Si ya existe un guardian para este usuario del portal, usamos ese y actualizamos datos si viene info nueva
                guardianId = existingGuardianQuery[0].id;
                // Opcional: Actualizar datos del guardian existente aquí si se desea
            } else {
                // Verificar si existe un guardian con ese DNI (para no duplicar)
                const existingGuardianByDni = await conn.query(
                    `SELECT id FROM guardian WHERE dni = ?`,
                    [primaryGuardianData.dni]
                );

                if (existingGuardianByDni.length > 0) {
                    guardianId = existingGuardianByDni[0].id;
                    // Asociar este guardian al usuario del portal
                    await conn.query('UPDATE guardian SET parent_portal_user_id = ? WHERE id = ?', [req.user.id, guardianId]);
                } else {
                    // Si no existe, creamos uno nuevo con información completa del formulario
                    const guardianResult = await conn.query(
                        `INSERT INTO guardian (
                            first_name, paternal_surname, dni, phone, email, address_id, parent_portal_user_id, role_id
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            primaryGuardianData.first_name,
                            primaryGuardianData.paternal_surname,
                            primaryGuardianData.dni,
                            primaryGuardianData.phone || null,
                            primaryGuardianData.email || req.user.email,
                            addressId, // Usamos la misma dirección que el alumno por defecto para el tutor principal
                            req.user.id,
                            tutorRoleId
                        ]
                    );
                    guardianId = guardianResult.insertId;
                }
            }

            // 5. Relacionar tutor con alumno
            await conn.query(
                `INSERT INTO student_guardian (
                    student_id, guardian_id, relationship_type, is_primary
                ) VALUES (?, ?, ?, TRUE)`,
                [studentId, guardianId, primaryGuardianData.relationship || 'Padre/Madre']
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

            // Verificar que el usuario esté autenticado y que el ID coincida o tenga permisos adecuados
            if (req.user.id != parentId) {
                return res.status(403).json({ error: 'Forbidden' });
            }

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

    async getMyChildren(req, res) {
        // Wrapper to access getChildrenByParent using authenticated user ID
        req.params.parentId = req.user.id;
        return this.getChildrenByParent(req, res);
    }

    async getChildrenByParent(req, res) {
        let conn;
        try {
            const pool = req.app.get('pool');
            const parentId = req.params.parentId;
            conn = await pool.getConnection();

            // Verificar que solo el padre mismo pueda acceder a sus hijos
            if (req.user.id != parentId) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            // Consulta para obtener los alumnos asociados a un padre a través de la tabla student_guardian
            const rows = await conn.query(
                `SELECT
                    s.id,
                    s.first_name as nombre,
                    s.paternal_surname as apellidoPaterno,
                    s.maternal_surname as apellidoMaterno,
                    s.dni,
                    s.birth_date as fechaNacimiento,
                    s.shift as turno,
                    s.classroom_id,
                    s.status as estado,
                    s.health_insurance as obraSocial,
                    s.blood_type as grupoSanguineo,
                    s.allergies as alergias,
                    s.medications as medicacion,
                    s.medical_observations as observacionesMedicas,
                    c.name as 'sala.nombre'
                 FROM student s
                 LEFT JOIN classroom c ON s.classroom_id = c.id
                 JOIN student_guardian sg ON s.id = sg.student_id
                 JOIN guardian g ON sg.guardian_id = g.id
                 WHERE g.parent_portal_user_id = ?`,
                [parentId]
            );

            // Para cada alumno, calcular la edad y buscar sus responsables
            const children = [];
            for (const child of rows) {
                let age = null;
                if (child.fechaNacimiento) {
                    const birthDate = new Date(child.fechaNacimiento);
                    const today = new Date();
                    age = today.getFullYear() - birthDate.getFullYear();
                    const m = today.getMonth() - birthDate.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }
                }

                // Buscar responsables (guardians) para este alumno
                // Usando await en bucle para evitar problemas de concurrencia en la misma conexión
                let guardians = [];
                try {
                    guardians = await conn.query(
                        `SELECT g.id, g.first_name, g.paternal_surname as last_name, g.dni, g.phone, sg.relationship_type as relationship
                         FROM guardian g
                         JOIN student_guardian sg ON g.id = sg.guardian_id
                         WHERE sg.student_id = ?`,
                        [child.id]
                    );
                } catch (err) {
                    console.error(`Error fetching guardians for student ${child.id}:`, err);
                    // Continue without guardians if error
                }

                children.push({
                    ...child,
                    edad: age,
                    responsables: guardians
                });
            }

            res.json({
                success: true,
                children: children
            });
        } catch (error) {
            console.error('Get children by parent error:', error);
            res.status(500).json({
                success: false,
                error: 'Error getting children for parent',
                details: error.message
            });
        } finally {
            if (conn) conn.release();
        }
    }

    async getAttendanceByChildId(req, res) {
        let conn;
        try {
            const pool = req.app.get('pool');
            const childId = req.params.childId;
            const parentId = req.user.id;
            conn = await pool.getConnection();

            // Verificar que el niño esté asociado al padre
            const associationCheck = await conn.query(
                `SELECT 1
                 FROM student s
                 JOIN student_guardian sg ON s.id = sg.student_id
                 JOIN guardian g ON sg.guardian_id = g.id
                 WHERE s.id = ? AND g.parent_portal_user_id = ?`,
                [childId, parentId]
            );

            if (associationCheck.length === 0) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            // Consulta para obtener la asistencia del niño
            const rows = await conn.query(
                `SELECT
                    a.date,
                    a.status,
                    a.leave_type_optional as observation,
                    a.created_at
                 FROM attendance a
                 WHERE a.student_id = ?
                 ORDER BY a.date DESC
                 LIMIT 30`, // Limitar a los últimos 30 registros
                [childId]
            );

            res.json({
                success: true,
                attendance: rows
            });
        } catch (error) {
            console.error('Get attendance by child error:', error);
            res.status(500).json({
                success: false,
                error: 'Error getting attendance for child',
                details: error.message
            });
        } finally {
            if (conn) conn.release();
        }
    }
}

module.exports = new ParentPortalController();

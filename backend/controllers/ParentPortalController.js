const { pool } = require('../db');
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
        if (req.isAuthenticated()) {
            return next();
        }
        res.status(401).json({ error: 'Not authenticated' });
    }

    async checkAuth(req, res) {
        try {
            if (req.isAuthenticated()) {
                res.json({
                    authenticated: true,
                    user: {
                        id: req.user.id,
                        email: req.user.email,
                        name: req.user.name
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

    async getDraft(req, res) {
        let conn;
        try {
            const userId = req.user.id;
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
                    draft: {
                        data: formData,
                        currentStep: rows[0].current_step,
                        updatedAt: rows[0].updated_at
                    }
                });
            } else {
                res.json({ draft: null });
            }
        } catch (error) {
            console.error('Get draft error:', error);
            res.status(500).json({ error: 'Error loading draft' });
        } finally {
            if (conn) conn.release();
        }
    }

    async saveDraft(req, res) {
        let conn;
        try {
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

    async deleteDraft(req, res) {
        let conn;
        try {
            const userId = req.user.id;
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

    async submitRegistration(req, res) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            // Sanitize all string inputs from req.body
            const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);

            const {
                // Datos alumno
                nombre, segundoNombre, tercerNombre, alias,
                apellidoPaterno, apellidoMaterno, dni, fechaNacimiento, turno,
                salaPreferida, tieneHermanos,
                // Dirección
                calle, numero, ciudad, provincia, codigoPostal,
                // Información médica
                obraSocial, numeroAfiliado, grupoSanguineo, alergias, medicacion,
                observacionesMedicas, pediatraNombre, pediatraTelefono, estadoVacunacion,
                necesidadesEspeciales,
                // Contacto emergencia
                nombreEmergencia, relacionEmergencia, telefonoEmergencia,
                telefonoAlternativoEmergencia, autorizadoRetiroEmergencia,
                // Responsable
                nombrePadre, segundoNombrePadre, apellidoPaternoPadre,
                apellidoMaternoPadre, apellidoPreferidoPadre, dniPadre,
                telefonoPadre, emailPadre, lugarTrabajo, telefonoTrabajo,
                relacionConAlumno, autorizadoRetiro, autorizadoCambio,
                // Autorizaciones
                autorizacionFotos, autorizacionSalidas, autorizacionAtencionMedica,
                // Documentos (rutas ya subidas)
                documents
            } = sanitizedBody;

            // 1. Crear dirección
            const addressResult = await conn.query(
                `INSERT INTO address (street, number, city, provincia, postal_code_optional)
                 VALUES (?, ?, ?, ?, ?)`,
                [calle, numero, ciudad, provincia, codigoPostal || null]
            );
            const addressId = addressResult.insertId;

            // 2. Crear contacto de emergencia
            const emergencyResult = await conn.query(
                `INSERT INTO emergency_contact (full_name, relationship, phone, alternative_phone, is_authorized_pickup)
                 VALUES (?, ?, ?, ?, ?)`,
                [nombreEmergencia, relacionEmergencia, telefonoEmergencia, 
                 telefonoAlternativoEmergencia || null, autorizadoRetiroEmergencia || false]
            );
            const emergencyContactId = emergencyResult.insertId;

            // 3. Crear alumno con TODOS los campos
            const studentResult = await conn.query(
                `INSERT INTO student (
                    first_name, middle_name_optional, third_name_optional, nickname_optional,
                    paternal_surname, maternal_surname, dni, birth_date, address_id, 
                    emergency_contact_id, shift, status, enrollment_date,
                    health_insurance, affiliate_number, allergies, medications, 
                    medical_observations, blood_type, pediatrician_name, pediatrician_phone,
                    photo_authorization, trip_authorization, medical_attention_authorization,
                    has_siblings_in_school, special_needs, vaccination_status, observations
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    nombre, segundoNombre || null, tercerNombre || null, alias || null,
                    apellidoPaterno, apellidoMaterno, dni || null, fechaNacimiento, addressId,
                    emergencyContactId, turno, 'inscripto', new Date(),
                    obraSocial || null, numeroAfiliado || null, alergias || null, medicacion || null,
                    observacionesMedicas || null, grupoSanguineo || null, pediatraNombre || null, 
                    pediatraTelefono || null, autorizacionFotos || false, autorizacionSalidas || false,
                    autorizacionAtencionMedica || false, tieneHermanos || false, necesidadesEspeciales || null,
                    estadoVacunacion || 'no_informado', salaPreferida || null
                ]
            );
            const studentId = studentResult.insertId;

            // 4. Crear tutor/responsable
            const guardianResult = await conn.query(
                `INSERT INTO guardian (
                    first_name, middle_name_optional, paternal_surname, maternal_surname,
                    preferred_surname, dni, address_id, phone, email_optional,
                    workplace, work_phone, authorized_pickup, authorized_change
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    nombrePadre, segundoNombrePadre || null, apellidoPaternoPadre,
                    apellidoMaternoPadre, apellidoPreferidoPadre || null, dniPadre || null,
                    addressId, telefonoPadre, emailPadre || null, lugarTrabajo || null,
                    telefonoTrabajo || null, autorizadoRetiro !== false, autorizadoCambio !== false
                ]
            );
            const guardianId = guardianResult.insertId;

            // 5. Relacionar tutor con alumno
            await conn.query(
                `INSERT INTO student_guardian (
                    student_id, guardian_id, relationship, is_primary, 
                    custody_rights, financial_responsible
                ) VALUES (?, ?, ?, ?, ?, ?)`,
                [studentId, guardianId, relacionConAlumno || 'padre', true, true, true]
            );

            // 6. Guardar documentos si existen
            if (documents && Object.keys(documents).length > 0) {
                const docTypeMap = {
                    dniAlumno: 'dni',
                    dniResponsable: 'dni',
                    certificadoNacimiento: 'certificado_nacimiento',
                    carnetVacunas: 'certificado_vacunas',
                    certificadoMedico: 'certificado_medico',
                    constanciaObraSocial: 'otro'
                };

                for (const [key, filePath] of Object.entries(documents)) {
                    if (filePath) {
                        await conn.query(
                            `INSERT INTO student_documents (
                                student_id, document_type, file_name, file_path, 
                                uploaded_by, upload_date
                            ) VALUES (?, ?, ?, ?, ?, NOW())`,
                            [studentId, docTypeMap[key] || 'otro', 
                             path.basename(filePath), filePath, req.user.id]
                        );
                    }
                }
            }

            // 7. Registrar el envío
            await conn.query(
                `INSERT INTO parent_portal_submissions (user_id, student_id, submitted_at)
                 VALUES (?, ?, NOW())`,
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

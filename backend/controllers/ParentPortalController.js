const pool = require('../db');
const StudentRepository = require('../repositories/StudentRepository');
const Student = require('../models/Student');
const Address = require('../models/Address');
const EmergencyContact = require('../models/EmergencyContact');
const Guardian = require('../models/Guardian');

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
                res.json({
                    draft: {
                        data: JSON.parse(rows[0].form_data),
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

            conn = await pool.getConnection();
            await conn.query(
                `INSERT INTO parent_registration_drafts (user_id, form_data, current_step, updated_at)
                 VALUES (?, ?, ?, NOW())
                 ON DUPLICATE KEY UPDATE form_data = ?, current_step = ?, updated_at = NOW()`,
                [userId, JSON.stringify(data), currentStep, JSON.stringify(data), currentStep]
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

            const {
                nombre, segundoNombre, tercerNombre, alias,
                apellidoPaterno, apellidoMaterno, fechaNacimiento, turno,
                calle, numero, ciudad, provincia, codigoPostal,
                nombreEmergencia, relacionEmergencia, telefonoEmergencia,
                nombrePadre, segundoNombrePadre, apellidoPaternoPadre,
                apellidoMaternoPadre, apellidoPreferidoPadre, telefonoPadre,
                emailPadre, autorizadoRetiro, autorizadoCambio
            } = req.body;

            // Crear dirección
            const addressResult = await conn.query(
                `INSERT INTO address (street, number, city, provincia, postal_code_optional)
                 VALUES (?, ?, ?, ?, ?)`,
                [calle, numero, ciudad, provincia, codigoPostal || null]
            );
            const addressId = addressResult.insertId;

            // Crear contacto de emergencia
            const emergencyResult = await conn.query(
                `INSERT INTO emergency_contact (full_name, relationship, phone)
                 VALUES (?, ?, ?)`,
                [nombreEmergencia, relacionEmergencia, telefonoEmergencia]
            );
            const emergencyContactId = emergencyResult.insertId;

            // Crear tutor/responsable
            const guardianResult = await conn.query(
                `INSERT INTO guardian (first_name, middle_name_optional, paternal_surname, 
                 maternal_surname, preferred_surname, address_id, phone, email_optional, 
                 authorized_pickup, authorized_change)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [nombrePadre, segundoNombrePadre || null, apellidoPaternoPadre,
                 apellidoMaternoPadre, apellidoPreferidoPadre || null, addressId,
                 telefonoPadre, emailPadre || null, autorizadoRetiro, autorizadoCambio]
            );
            const guardianId = guardianResult.insertId;

            // Crear alumno
            const studentResult = await conn.query(
                `INSERT INTO student (first_name, middle_name_optional, third_name_optional,
                 nickname_optional, paternal_surname, maternal_surname, birth_date,
                 address_id, emergency_contact_id, shift)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [nombre, segundoNombre || null, tercerNombre || null, alias || null,
                 apellidoPaterno, apellidoMaterno, fechaNacimiento, addressId,
                 emergencyContactId, turno]
            );
            const studentId = studentResult.insertId;

            // Relacionar tutor con alumno
            await conn.query(
                `INSERT INTO student_guardian (student_id, guardian_id, relationship, is_primary, authorized_pickup, authorized_diaper_change)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [studentId, guardianId, 'Padre/Madre/Tutor', true, autorizadoRetiro, autorizadoCambio]
            );

            // Registrar el envío del usuario
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
            res.status(500).json({ error: 'Error al procesar el registro' });
        } finally {
            conn.release();
        }
    }
}

module.exports = new ParentPortalController();

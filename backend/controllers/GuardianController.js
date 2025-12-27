// backend/controllers/GuardianController.js
const GuardianRepository = require('../repositories/GuardianRepository');
const Guardian = require('../models/Guardian');
const { AppError } = require('../middleware/errorHandler'); // Import AppError
const { sanitizeObject, sanitizeWhitespace } = require('../utils/sanitization'); // Import sanitization utilities

class GuardianController {
    async createGuardian(req, res) {
        try {
            const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);
            const guardianData = Guardian.fromDbRow({
                first_name: sanitizedBody.nombre || sanitizedBody.firstName,
                middle_name_optional: sanitizedBody.segundoNombre || sanitizedBody.middleName,
                paternal_surname: sanitizedBody.apellidoPaterno || sanitizedBody.paternalSurname,
                maternal_surname: sanitizedBody.apellidoMaterno || sanitizedBody.maternalSurname,
                preferred_surname: sanitizedBody.apellidoPreferido || sanitizedBody.preferredSurname,
                address_id: sanitizedBody.direccionId || sanitizedBody.addressId,
                phone: sanitizedBody.telefono || sanitizedBody.phone,
                email_optional: sanitizedBody.email,
                authorized_pickup: sanitizedBody.autorizadoRetiro || sanitizedBody.authorizedPickup,
                authorized_change: sanitizedBody.autorizadoCambio || sanitizedBody.authorizedChange
            });

            if (!guardianData.isValid()) {
                throw new AppError('Invalid guardian data', 400);
            }

            const created = await GuardianRepository.create(guardianData);
            res.status(201).json(created);
        } catch (error) {
            console.error('Error in createGuardian:', error);
            throw new AppError('Error creating guardian', 500);
        }
    }

    async getAllGuardians(req, res) {
        try {
            const sanitizedQuery = sanitizeObject(req.query, sanitizeWhitespace);
            const filters = {};

            if (sanitizedQuery.roleId) filters.roleId = sanitizedQuery.roleId;
            if (sanitizedQuery.dni) filters.dni = sanitizedQuery.dni;

            const guardians = await GuardianRepository.getAll({ filters });
            res.status(200).json(guardians);
        } catch (error) {
            console.error('Error in getAllGuardians:', error);
            throw new AppError('Error fetching guardians', 500);
        }
    }

    async getGuardianById(req, res) {
        try {
            const { id } = req.params;
            const guardian = await GuardianRepository.getById(id);
            if (!guardian) {
                throw new AppError('Guardian not found', 404);
            }
            res.status(200).json(guardian);
        } catch (error) {
            console.error(`Error in getGuardianById for id ${req.params.id}:`, error);
            throw new AppError('Error fetching guardian', 500);
        }
    }

    async getGuardiansByStudent(req, res) {
        try {
            const { studentId } = req.params;
            const guardians = await GuardianRepository.findByStudentId(studentId);
            res.status(200).json(guardians);
        } catch (error) {
            console.error(`Error in getGuardiansByStudent for student ${req.params.studentId}:`, error);
            throw new AppError('Error fetching guardians by student', 500);
        }
    }

    async updateGuardian(req, res) {
        try {
            const { id } = req.params;
            const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);
            const guardianData = Guardian.fromDbRow({
                first_name: sanitizedBody.nombre || sanitizedBody.firstName,
                middle_name_optional: sanitizedBody.segundoNombre || sanitizedBody.middleName,
                paternal_surname: sanitizedBody.apellidoPaterno || sanitizedBody.paternalSurname,
                maternal_surname: sanitizedBody.apellidoMaterno || sanitizedBody.maternalSurname,
                preferred_surname: sanitizedBody.apellidoPreferido || sanitizedBody.preferredSurname,
                address_id: sanitizedBody.direccionId || sanitizedBody.addressId,
                phone: sanitizedBody.telefono || sanitizedBody.phone,
                email_optional: sanitizedBody.email,
                authorized_pickup: sanitizedBody.autorizadoRetiro || sanitizedBody.authorizedPickup,
                authorized_change: sanitizedBody.autorizadoCambio || sanitizedBody.authorizedChange
            });

            if (!guardianData.isValid()) {
                throw new AppError('Invalid guardian data', 400);
            }

            const updated = await GuardianRepository.update(id, guardianData);
            res.status(200).json(updated);
        } catch (error) {
            console.error(`Error in updateGuardian for id ${req.params.id}:`, error);
            throw new AppError('Error updating guardian', 500);
        }
    }

    async deleteGuardian(req, res) {
        try {
            const { id } = req.params;
            const success = await GuardianRepository.delete(id);
            if (!success) {
                throw new AppError('Guardian not found or could not be deleted', 404);
            }
            res.status(204).send();
        } catch (error) {
            console.error(`Error in deleteGuardian for id ${req.params.id}:`, error);
            if (error.message && error.message.includes('Still assigned')) {
                throw new AppError(error.message, 409);
            }
            throw new AppError('Error deleting guardian', 500);
        }
    }

    // Métodos para gestionar relaciones student-guardian
    async getAllRelationships(req, res) {
        try {
            const sanitizedQuery = sanitizeObject(req.query, sanitizeWhitespace);
            const { searchTerm } = sanitizedQuery;
            const relationships = await GuardianRepository.getAllRelationships(searchTerm);
            res.status(200).json(relationships);
        } catch (error) {
            console.error('Error in getAllRelationships:', error);
            throw new AppError('Error fetching relationships', 500);
        }
    }

    async assignGuardianToStudent(req, res) {
        try {
            const { studentId, guardianId } = req.params;
            const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);
            const relationData = {
                relationship: sanitizedBody.relacion || sanitizedBody.relationship,
                isPrimary: sanitizedBody.esPrincipal || sanitizedBody.isPrimary || false,
                authorizedPickup: sanitizedBody.autorizadoRetiro || sanitizedBody.authorizedPickup || false,
                authorizedDiaperChange: sanitizedBody.autorizadoPañales || sanitizedBody.authorizedDiaperChange || false,
                notes: sanitizedBody.notas || sanitizedBody.notes
            };

            const relationId = await GuardianRepository.assignToStudent(studentId, guardianId, relationData);
            res.status(201).json({ success: true, relationId });
        } catch (error) {
            console.error('Error in assignGuardianToStudent:', error);
            throw new AppError('Error assigning guardian to student', 500);
        }
    }

    async updateGuardianRelation(req, res) {
        try {
            const { studentId, guardianId } = req.params;
            const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);
            const relationData = {
                relationship: sanitizedBody.relacion || sanitizedBody.relationship,
                isPrimary: sanitizedBody.esPrincipal || sanitizedBody.isPrimary || false,
                authorizedPickup: sanitizedBody.autorizadoRetiro || sanitizedBody.authorizedPickup || false,
                authorizedDiaperChange: sanitizedBody.autorizadoPañales || sanitizedBody.authorizedDiaperChange || false,
                notes: sanitizedBody.notas || sanitizedBody.notes
            };

            await GuardianRepository.updateRelation(studentId, guardianId, relationData);
            res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error in updateGuardianRelation:', error);
            throw new AppError('Error updating guardian relation', 500);
        }
    }

    async removeGuardianFromStudent(req, res) {
        try {
            const { studentId, guardianId } = req.params;
            const success = await GuardianRepository.removeFromStudent(studentId, guardianId);
            if (!success) {
                throw new AppError('Relación no encontrada', 404);
            }
            res.status(204).send();
        } catch (error) {
            console.error('Error in removeGuardianFromStudent:', error);
            if (error.message && error.message.includes('Cannot remove last guardian')) {
                throw new AppError('No se puede eliminar: es el único responsable del alumno. Cada alumno debe tener al menos un responsable.', 409);
            }
            throw new AppError('Error removing guardian from student', 500);
        }
    }
}

module.exports = new GuardianController();

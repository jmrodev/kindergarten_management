// backend/controllers/GuardianController.js
const GuardianRepository = require('../repositories/GuardianRepository');
const Guardian = require('../models/Guardian');
const { serializeBigInt } = require('../utils/serialization');

class GuardianController {
    async createGuardian(req, res) {
        try {
            const guardianData = Guardian.fromDbRow({
                first_name: req.body.nombre || req.body.firstName,
                middle_name_optional: req.body.segundoNombre || req.body.middleName,
                paternal_surname: req.body.apellidoPaterno || req.body.paternalSurname,
                maternal_surname: req.body.apellidoMaterno || req.body.maternalSurname,
                preferred_surname: req.body.apellidoPreferido || req.body.preferredSurname,
                address_id: req.body.direccionId || req.body.addressId,
                phone: req.body.telefono || req.body.phone,
                email_optional: req.body.email,
                authorized_pickup: req.body.autorizadoRetiro || req.body.authorizedPickup,
                authorized_change: req.body.autorizadoCambio || req.body.authorizedChange
            });

            if (!guardianData.isValid()) {
                return res.status(400).json({ message: 'Invalid guardian data' });
            }

            const created = await GuardianRepository.create(guardianData);
            res.status(201).json(serializeBigInt(created));
        } catch (error) {
            console.error('Error in createGuardian:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getAllGuardians(req, res) {
        try {
            const guardians = await GuardianRepository.findAll();
            res.status(200).json(serializeBigInt(guardians));
        } catch (error) {
            console.error('Error in getAllGuardians:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getGuardianById(req, res) {
        try {
            const { id } = req.params;
            const guardian = await GuardianRepository.findById(id);
            if (!guardian) {
                return res.status(404).json({ message: 'Guardian not found' });
            }
            res.status(200).json(serializeBigInt(guardian));
        } catch (error) {
            console.error(`Error in getGuardianById for id ${req.params.id}:`, error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getGuardiansByStudent(req, res) {
        try {
            const { studentId } = req.params;
            const guardians = await GuardianRepository.findByStudentId(studentId);
            res.status(200).json(serializeBigInt(guardians));
        } catch (error) {
            console.error(`Error in getGuardiansByStudent for student ${req.params.studentId}:`, error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateGuardian(req, res) {
        try {
            const { id } = req.params;
            const guardianData = Guardian.fromDbRow({
                first_name: req.body.nombre || req.body.firstName,
                middle_name_optional: req.body.segundoNombre || req.body.middleName,
                paternal_surname: req.body.apellidoPaterno || req.body.paternalSurname,
                maternal_surname: req.body.apellidoMaterno || req.body.maternalSurname,
                preferred_surname: req.body.apellidoPreferido || req.body.preferredSurname,
                address_id: req.body.direccionId || req.body.addressId,
                phone: req.body.telefono || req.body.phone,
                email_optional: req.body.email,
                authorized_pickup: req.body.autorizadoRetiro || req.body.authorizedPickup,
                authorized_change: req.body.autorizadoCambio || req.body.authorizedChange
            });

            if (!guardianData.isValid()) {
                return res.status(400).json({ message: 'Invalid guardian data' });
            }

            const updated = await GuardianRepository.update(id, guardianData);
            res.status(200).json(serializeBigInt(updated));
        } catch (error) {
            console.error(`Error in updateGuardian for id ${req.params.id}:`, error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async deleteGuardian(req, res) {
        try {
            const { id } = req.params;
            const success = await GuardianRepository.delete(id);
            if (!success) {
                return res.status(404).json({ message: 'Guardian not found or could not be deleted' });
            }
            res.status(204).send();
        } catch (error) {
            console.error(`Error in deleteGuardian for id ${req.params.id}:`, error);
            if (error.message && error.message.includes('Still assigned')) {
                return res.status(409).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Métodos para gestionar relaciones student-guardian
    async getAllRelationships(req, res) {
        try {
            const { searchTerm } = req.query;
            const relationships = await GuardianRepository.getAllRelationships(searchTerm);
            res.status(200).json(serializeBigInt(relationships));
        } catch (error) {
            console.error('Error in getAllRelationships:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async assignGuardianToStudent(req, res) {
        try {
            const { studentId, guardianId } = req.params;
            const relationData = {
                relationship: req.body.relacion || req.body.relationship,
                isPrimary: req.body.esPrincipal || req.body.isPrimary || false,
                authorizedPickup: req.body.autorizadoRetiro || req.body.authorizedPickup || false,
                authorizedDiaperChange: req.body.autorizadoPañales || req.body.authorizedDiaperChange || false,
                notes: req.body.notas || req.body.notes
            };

            const relationId = await GuardianRepository.assignToStudent(studentId, guardianId, relationData);
            res.status(201).json({ success: true, relationId });
        } catch (error) {
            console.error('Error in assignGuardianToStudent:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateGuardianRelation(req, res) {
        try {
            const { studentId, guardianId } = req.params;
            const relationData = {
                relationship: req.body.relacion || req.body.relationship,
                isPrimary: req.body.esPrincipal || req.body.isPrimary || false,
                authorizedPickup: req.body.autorizadoRetiro || req.body.authorizedPickup || false,
                authorizedDiaperChange: req.body.autorizadoPañales || req.body.authorizedDiaperChange || false,
                notes: req.body.notas || req.body.notes
            };

            await GuardianRepository.updateRelation(studentId, guardianId, relationData);
            res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error in updateGuardianRelation:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async removeGuardianFromStudent(req, res) {
        try {
            const { studentId, guardianId } = req.params;
            const success = await GuardianRepository.removeFromStudent(studentId, guardianId);
            if (!success) {
                return res.status(404).json({ message: 'Relación no encontrada' });
            }
            res.status(204).send();
        } catch (error) {
            console.error('Error in removeGuardianFromStudent:', error);
            if (error.message && error.message.includes('Cannot remove last guardian')) {
                return res.status(409).json({ 
                    message: 'No se puede eliminar: es el único responsable del alumno. Cada alumno debe tener al menos un responsable.' 
                });
            }
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
}

module.exports = new GuardianController();

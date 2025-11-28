const StaffRepository = require('../repositories/StaffRepository');
const bcrypt = require('bcryptjs');

const StaffController = {
    async getAllStaff(req, res) {
        try {
            const staff = await StaffRepository.findAll();
            res.json(staff);
        } catch (error) {
            console.error('Error in getAllStaff:', error);
            res.status(500).json({ message: 'Error al obtener personal', error: error.message });
        }
    },

    async getStaffById(req, res) {
        try {
            const staff = await StaffRepository.findById(req.params.id);
            if (!staff) {
                return res.status(404).json({ message: 'Personal no encontrado' });
            }
            res.json(staff);
        } catch (error) {
            console.error('Error in getStaffById:', error);
            res.status(500).json({ message: 'Error al obtener personal', error: error.message });
        }
    },

    async createStaff(req, res) {
        try {
            const staffData = { ...req.body };
            
            if (staffData.dni) {
                const passwordHash = await bcrypt.hash(staffData.dni, 10);
                staffData.password_hash = passwordHash;
            }
            
            const id = await StaffRepository.create(staffData);
            const newStaff = await StaffRepository.findById(id);
            res.status(201).json(newStaff);
        } catch (error) {
            console.error('Error in createStaff:', error);
            res.status(500).json({ message: 'Error al crear personal', error: error.message });
        }
    },

    async updateStaff(req, res) {
        try {
            const staff = await StaffRepository.findById(req.params.id);
            
            if (!staff) {
                return res.status(404).json({ message: 'Personal no encontrado' });
            }
            
            // Proteger cambio de rol para posiciones de dirección (admin y directivo)
            const isDirectionRole = staff.role_name === 'admin' || staff.role_name === 'directivo';
            if (isDirectionRole && req.body.role_id && req.body.role_id !== staff.role_id) {
                return res.status(403).json({ 
                    message: 'No se puede cambiar el rol de usuarios con posiciones de dirección' 
                });
            }
            
            await StaffRepository.update(req.params.id, req.body);
            const updatedStaff = await StaffRepository.findById(req.params.id);
            res.json(updatedStaff);
        } catch (error) {
            console.error('Error in updateStaff:', error);
            res.status(500).json({ message: 'Error al actualizar personal', error: error.message });
        }
    },

    async deleteStaff(req, res) {
        try {
            const staff = await StaffRepository.findById(req.params.id);
            
            if (!staff) {
                return res.status(404).json({ message: 'Personal no encontrado' });
            }
            
            // Proteger roles de dirección (admin y directivo)
            if (staff.role_name === 'admin' || staff.role_name === 'directivo') {
                return res.status(403).json({ 
                    message: 'No se puede eliminar usuarios con roles de dirección (Admin/Directivo)' 
                });
            }
            
            await StaffRepository.delete(req.params.id);
            res.json({ message: 'Personal eliminado correctamente' });
        } catch (error) {
            console.error('Error in deleteStaff:', error);
            res.status(500).json({ message: 'Error al eliminar personal', error: error.message });
        }
    },

    async getRoles(req, res) {
        try {
            const roles = await StaffRepository.getRoles();
            res.json(roles);
        } catch (error) {
            console.error('Error in getRoles:', error);
            res.status(500).json({ message: 'Error al obtener roles', error: error.message });
        }
    }
};

module.exports = StaffController;

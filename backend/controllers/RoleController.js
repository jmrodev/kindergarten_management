const RoleRepository = require('../repositories/RoleRepository');
const { AppError } = require('../middleware/errorHandler');
const { sanitizeObject, sanitizeWhitespace } = require('../utils/sanitization');

const RoleController = {
    async getAllRoles(req, res) {
        try {
            const roles = await RoleRepository.findAll();
            res.json(roles);
        } catch (error) {
            console.error('Error in getAllRoles:', error);
            throw new AppError('Error al obtener roles', 500);
        }
    },

    async getRoleById(req, res) {
        try {
            const role = await RoleRepository.findById(req.params.id);
            if (!role) {
                throw new AppError('Rol no encontrado', 404);
            }
            res.json(role);
        } catch (error) {
            console.error('Error in getRoleById:', error);
            throw new AppError('Error al obtener rol', 500);
        }
    },

    async createRole(req, res) {
        try {
            const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);
            const id = await RoleRepository.create(sanitizedBody);
            const newRole = await RoleRepository.findById(id);
            res.status(201).json(newRole);
        } catch (error) {
            console.error('Error in createRole:', error);
            throw new AppError('Error al crear rol', 500);
        }
    },

    async updateRole(req, res) {
        try {
            const role = await RoleRepository.findById(req.params.id);
            if (!role) {
                throw new AppError('Rol no encontrado', 404);
            }
            const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);
            await RoleRepository.update(req.params.id, sanitizedBody);
            const updatedRole = await RoleRepository.findById(req.params.id);
            res.json(updatedRole);
        } catch (error) {
            console.error('Error in updateRole:', error);
            throw new AppError('Error al actualizar rol', 500);
        }
    },

    async deleteRole(req, res) {
        try {
            const role = await RoleRepository.findById(req.params.id);
            if (!role) {
                throw new AppError('Rol no encontrado', 404);
            }

            // Prevent deletion of the 'Administrator' role
            if (role.role_name === 'Administrator') {
                throw new AppError('No se puede eliminar el rol de Administrador', 403);
            }

            await RoleRepository.delete(req.params.id);
            res.json({ message: 'Rol eliminado correctamente' });
        } catch (error) {
            console.error('Error in deleteRole:', error);
            throw new AppError('Error al eliminar rol', 500);
        }
    },

    async getAllAccessLevels(req, res) {
        try {
            const accessLevels = await RoleRepository.findAllAccessLevels();
            res.json(accessLevels);
        } catch (error) {
            console.error('Error in getAllAccessLevels:', error);
            throw new AppError('Error al obtener niveles de acceso', 500);
        }
    },

    async createAccessLevel(req, res) {
        try {
            const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace);
            const id = await RoleRepository.createAccessLevel(sanitizedBody);
            const newAccessLevel = await RoleRepository.findById(id); // Assuming findById can also fetch access levels, or create a separate one
            res.status(201).json(newAccessLevel);
        } catch (error) {
            console.error('Error in createAccessLevel:', error);
            throw new AppError('Error al crear nivel de acceso', 500);
        }
    }
};

module.exports = RoleController;

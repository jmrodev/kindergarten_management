const PediatricianRepository = require('../repositories/PediatricianRepository');
const { AppError } = require('../middleware/errorHandler');

class PediatricianController {
    async getAll(req, res) {
        try {
            const pediatricians = await PediatricianRepository.getAll();
            res.status(200).json({
                status: 'success',
                data: pediatricians
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    async create(req, res) {
        try {
            const { name, phone } = req.body;
            if (!name) {
                throw new AppError('El nombre del pediatra es requerido', 400);
            }

            const existing = await PediatricianRepository.findByName(name);
            if (existing) {
                // Return existing but updated phone if provided?
                // For now just return existing
                return res.status(200).json({
                    status: 'success',
                    data: existing,
                    message: 'El pediatra ya existe'
                });
            }

            const newPediatrician = await PediatricianRepository.create(name, phone);
            res.status(201).json({
                status: 'success',
                data: newPediatrician
            });
        } catch (error) {
            console.error(error);
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ status: 'error', message: error.message });
        }
    }
}

module.exports = new PediatricianController();

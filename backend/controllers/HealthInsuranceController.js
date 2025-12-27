const HealthInsuranceRepository = require('../repositories/HealthInsuranceRepository');
const { AppError } = require('../middleware/errorHandler');

class HealthInsuranceController {
    async getAll(req, res) {
        try {
            const insurances = await HealthInsuranceRepository.getAll();
            res.status(200).json({
                status: 'success',
                data: insurances
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    async create(req, res) {
        try {
            const { name } = req.body;
            if (!name) {
                throw new AppError('El nombre de la obra social es requerido', 400);
            }

            // Check if already exists
            const existing = await HealthInsuranceRepository.findByName(name);
            if (existing) {
                return res.status(200).json({
                    status: 'success',
                    data: existing,
                    message: 'La obra social ya existe'
                });
            }

            const newInsurance = await HealthInsuranceRepository.create(name);
            res.status(201).json({
                status: 'success',
                data: newInsurance
            });
        } catch (error) {
            console.error(error);
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ status: 'error', message: error.message });
        }
    }
}

module.exports = new HealthInsuranceController();

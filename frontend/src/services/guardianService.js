// frontend/src/services/guardianService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/guardians';

const guardianService = {
    // CRUD básico de Guardians
    async getAll() {
        const token = localStorage.getItem('token');
        const response = await axios.get(API_URL, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    async getById(id) {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    async create(guardianData) {
        const token = localStorage.getItem('token');
        const response = await axios.post(API_URL, guardianData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    async update(id, guardianData) {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/${id}`, guardianData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    async delete(id) {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Relaciones Student-Guardian
    async getAllRelationships(searchTerm = '') {
        const token = localStorage.getItem('token');
        const params = searchTerm ? `?searchTerm=${encodeURIComponent(searchTerm)}` : '';
        const response = await axios.get(`${API_URL}/relationships${params}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    async getByStudent(studentId) {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/student/${studentId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    async assignToStudent(studentId, guardianId, relationData) {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            `${API_URL}/student/${studentId}/guardian/${guardianId}`,
            relationData,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    },

    async updateRelation(studentId, guardianId, relationData) {
        const token = localStorage.getItem('token');
        const response = await axios.put(
            `${API_URL}/student/${studentId}/guardian/${guardianId}`,
            relationData,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    },

    async removeFromStudent(studentId, guardianId) {
        const token = localStorage.getItem('token');
        const response = await axios.delete(
            `${API_URL}/student/${studentId}/guardian/${guardianId}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    },

    // Métodos helper para crear y asignar en un solo paso
    async createAndAssign(studentId, guardianData, relationData) {
        // Primero crear el guardian
        const guardian = await this.create(guardianData);
        
        // Luego asignarlo al estudiante
        await this.assignToStudent(studentId, guardian.id, relationData);
        
        return guardian;
    }
};

export default guardianService;

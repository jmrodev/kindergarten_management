// frontend/src/services/salaService.js
const API_BASE_URL = 'http://localhost:3000/api/classrooms';

const salaService = {
    getAllSalas: async () => {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch salas');
        }
        return response.json();
    },

    getSalaById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch sala with id ${id}`);
        }
        return response.json();
    },

    createSala: async (salaData) => {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(salaData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create sala');
        }
        return response.json();
    },

    updateSala: async (id, salaData) => {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(salaData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update sala');
        }
        return response.json();
    },

    deleteSala: async (id) => {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Failed to delete sala with id ${id}`);
        }
        // No content expected for 204 No Content
    },
};

export default salaService;

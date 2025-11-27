// frontend/src/services/alumnoService.js
const API_BASE_URL = 'http://localhost:3000/api/students';

const alumnoService = {
    getAllAlumnos: async () => {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch alumnos');
        }
        return response.json();
    },

    searchAlumnos: async (filters) => {
        const params = new URLSearchParams();
        
        // Búsqueda general
        if (filters.searchText) params.append('searchText', filters.searchText);
        
        // Filtros específicos
        if (filters.nombre) params.append('nombre', filters.nombre);
        if (filters.salaId) params.append('salaId', filters.salaId);
        if (filters.turno) params.append('turno', filters.turno);
        if (filters.ciudad) params.append('ciudad', filters.ciudad);
        if (filters.provincia) params.append('provincia', filters.provincia);
        if (filters.calle) params.append('calle', filters.calle);
        if (filters.yearNacimiento) params.append('yearNacimiento', filters.yearNacimiento);
        if (filters.edadMin) params.append('edadMin', filters.edadMin);
        if (filters.edadMax) params.append('edadMax', filters.edadMax);
        if (filters.contactoEmergencia) params.append('contactoEmergencia', filters.contactoEmergencia);
        
        const queryString = params.toString();
        const url = queryString ? `${API_BASE_URL}/search?${queryString}` : API_BASE_URL;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to search alumnos');
        }
        return response.json();
    },

    getAlumnoById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch alumno with id ${id}`);
        }
        return response.json();
    },

    createAlumno: async (alumnoData) => {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(alumnoData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create alumno');
        }
        return response.json();
    },

    updateAlumno: async (id, alumnoData) => {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(alumnoData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update alumno');
        }
        return response.json();
    },

    deleteAlumno: async (id) => {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Failed to delete alumno with id ${id}`);
        }
        // No content expected for 204 No Content
    },
};

export default alumnoService;

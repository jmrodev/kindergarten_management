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
        
        const token = localStorage.getItem('token');
        const response = await fetch(url, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
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

    // Crear alumno con responsables y contacto de emergencia
    createAlumnoWithGuardians: async (alumnoData) => {
        const { guardians, ...studentData } = alumnoData;
        
        try {
            // 1. Crear el alumno primero
            const student = await alumnoService.createAlumno(studentData);
            
            // 2. Crear y asignar cada responsable
            if (guardians && guardians.length > 0) {
                const token = localStorage.getItem('token');
                
                for (const guardian of guardians) {
                    // Extraer datos de relación
                    const { relacion, esPrincipal, autorizadoRetiro, autorizadoPañales, notas, ...guardianData } = guardian;
                    
                    // Crear el guardian
                    const guardianResponse = await fetch('http://localhost:3000/api/guardians', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            ...guardianData,
                            direccionId: studentData.direccion?.id || 1 // Usar dirección del alumno o default
                        })
                    });
                    
                    if (!guardianResponse.ok) {
                        console.error('Error creando guardian:', await guardianResponse.text());
                        continue;
                    }
                    
                    const createdGuardian = await guardianResponse.json();
                    
                    // Asignar guardian al estudiante
                    await fetch(`http://localhost:3000/api/guardians/student/${student.id}/guardian/${createdGuardian.id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            relacion: relacion || 'Padre',
                            esPrincipal: esPrincipal || false,
                            autorizadoRetiro: autorizadoRetiro || false,
                            autorizadoPañales: autorizadoPañales || false,
                            notas: notas || ''
                        })
                    });
                }
            }
            
            return student;
        } catch (error) {
            console.error('Error en createAlumnoWithGuardians:', error);
            throw error;
        }
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

    assignClassroom: async (studentId, classroomId) => {
        const response = await fetch(`${API_BASE_URL}/${studentId}/assign-classroom`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ classroomId }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to assign classroom');
        }
        return response.json();
    },
};

export default alumnoService;

// frontend/src/hooks/useAlumnos.js
import { useState, useEffect, useCallback } from 'react';
import alumnoService from '../services/alumnoService';

const useAlumnos = () => {
    const [alumnos, setAlumnos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAlumnos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await alumnoService.getAllAlumnos();
            setAlumnos(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const searchAlumnos = useCallback(async (filters) => {
        setLoading(true);
        setError(null);
        try {
            const data = await alumnoService.searchAlumnos(filters);
            setAlumnos(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAlumnos();
    }, [fetchAlumnos]);

    const addAlumno = async (alumnoData) => {
        try {
            let newAlumno;
            
            // Si tiene guardians, usar el método especial
            if (alumnoData.guardians && alumnoData.guardians.length > 0) {
                newAlumno = await alumnoService.createAlumnoWithGuardians(alumnoData);
            } else {
                newAlumno = await alumnoService.createAlumno(alumnoData);
            }
            
            // Refrescar la lista completa desde el servidor
            await fetchAlumnos();
            return newAlumno;
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    const updateAlumno = async (id, alumnoData) => {
        try {
            const updated = await alumnoService.updateAlumno(id, alumnoData);
            // Refrescar la lista completa desde el servidor
            await fetchAlumnos();
            return updated;
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    const deleteAlumno = async (id) => {
        try {
            await alumnoService.deleteAlumno(id);
            // Refrescar la lista completa desde el servidor
            await fetchAlumnos();
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    return { alumnos, loading, error, fetchAlumnos, searchAlumnos, addAlumno, updateAlumno, deleteAlumno };
};

export default useAlumnos;

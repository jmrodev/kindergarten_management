// frontend/src/hooks/useSalas.js
import { useState, useEffect, useCallback } from 'react';
import salaService from '../services/salaService';

const useSalas = () => {
    const [salas, setSalas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSalas = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await salaService.getAllSalas();
            setSalas(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSalas();
    }, [fetchSalas]);

    const addSala = async (salaData) => {
        try {
            const newSala = await salaService.createSala(salaData);
            // Refrescar la lista completa desde el servidor
            await fetchSalas();
            return newSala;
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    const updateSala = async (id, salaData) => {
        try {
            const updated = await salaService.updateSala(id, salaData);
            // Refrescar la lista completa desde el servidor
            await fetchSalas();
            return updated;
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    const deleteSala = async (id) => {
        try {
            await salaService.deleteSala(id);
            // Refrescar la lista completa desde el servidor
            await fetchSalas();
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    return { salas, loading, error, fetchSalas, addSala, updateSala, deleteSala };
};

export default useSalas;

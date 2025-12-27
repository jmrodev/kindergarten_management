import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Atoms/Card';
import Button from '../components/Atoms/Button';
import Text from '../components/Atoms/Text';
import DataCardList from '../components/Organisms/DataCardList';
import api from '../utils/api';

const ParentDashboard = () => {
    const navigate = useNavigate();
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchChildren();
    }, []);

    const fetchChildren = async () => {
        try {
            // Assuming endpoint exists or needs to be created/verified
            // Using existing authService logic, parents access children via specific endpoint
            const response = await api.get('/api/parent-portal/my-children');
            setChildren(response.children || []);
        } catch (error) {
            console.error('Error fetching children:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterClick = () => {
        navigate('/parent/register');
    };

    const handleChildClick = (child) => {
        // Future implementation: Navigate to detailed child view
        console.log('Clicked child:', child);
    };

    return (
        <div className="dashboard-container" style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Text variant="h2">Bienvenido, {user?.name || 'Familia'}</Text>
                    <Text variant="subtitle">Panel de gestión familiar</Text>
                </div>
                <Button variant="primary" onClick={handleRegisterClick}>
                    + Inscribir Alumno
                </Button>
            </div>

            <Card title="Mis Hijos">
                {loading ? (
                    <div>Cargando información...</div>
                ) : children.length > 0 ? (
                    <DataCardList
                        items={children}
                        title="Mis Hijos"
                        itemTitleKey="nombre"
                        itemSubtitleKey="apellidoPaterno"
                        onCardClick={handleChildClick}
                        emptyMessage="No hay alumnos registrados"
                        fields={[
                            { label: 'DNI', key: 'dni' },
                            { label: 'Fecha Nacimiento', key: 'fechaNacimiento', type: 'date' },
                            { label: 'Sala', key: 'sala.nombre' },
                            { label: 'Estado', key: 'estado' },
                            { label: 'Obra Social', key: 'obraSocial' },
                            { label: 'Grupo Sanguíneo', key: 'grupoSanguineo' }
                        ]}
                    />
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <Text variant="body" style={{ marginBottom: '20px', display: 'block' }}>
                            No tienes ningún alumno registrado o en proceso de inscripción.
                        </Text>
                        <Button variant="secondary" onClick={handleRegisterClick}>
                            Comenzar Inscripción
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ParentDashboard;

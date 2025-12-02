// frontend/src/components/StudentList.jsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner, Alert, Badge, Card } from 'react-bootstrap';

const StudentList = ({ alumnos, loading, onEdit, onDelete, onSelect }) => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const checkDarkMode = () => {
            setDarkMode(document.body.classList.contains('dark-mode'));
        };
        
        checkDarkMode();
        
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        
        return () => observer.disconnect();
    }, []);

    if (loading) {
        return (
            <Card className="text-center py-5 shadow-sm border-0">
                <Card.Body>
                    <Spinner animation="border" role="status" variant="primary" style={{width: '3rem', height: '3rem'}}>
                        <span className="visually-hidden">Cargando alumnos...</span>
                    </Spinner>
                    <p className="mt-3 text-muted fw-semibold">Cargando alumnos...</p>
                </Card.Body>
            </Card>
        );
    }

    if (!alumnos) {
        return (
            <Alert variant="info" className="shadow-sm border-0">
                <Alert.Heading className="h5"><span className="material-icons">info</span> Sin datos</Alert.Heading>
                No hay datos disponibles.
            </Alert>
        );
    }

    const calcularEdad = (fechaNacimiento) => {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    };

    const getTurnoIcon = (turno) => {
        switch(turno) {
            case 'Mañana': return <span className="material-icons">wb_sunny</span>;
            case 'Tarde': return <span className="material-icons">nights_stay</span>;
            case 'Completo': return <span className="material-icons">brightness_high</span>;
            default: return <span className="material-icons">schedule</span>;
        }
    };

    const getEdadColor = (edad) => {
        const colors = {
            3: { bg: 'transparent', color: '#0d47a1', border: '#0d47a1', darkBg: 'transparent', darkColor: '#90caf9', darkBorder: '#90caf9' },
            4: { bg: 'transparent', color: '#6a1b9a', border: '#6a1b9a', darkBg: 'transparent', darkColor: '#ce93d8', darkBorder: '#ce93d8' },
            5: { bg: 'transparent', color: '#2e7d32', border: '#2e7d32', darkBg: 'transparent', darkColor: '#81c784', darkBorder: '#81c784' },
            6: { bg: 'transparent', color: '#e65100', border: '#e65100', darkBg: 'transparent', darkColor: '#ffab40', darkBorder: '#ffab40' },
        };
        return colors[edad] || { bg: 'transparent', color: '#616161', border: '#616161', darkBg: 'transparent', darkColor: '#bdbdbd', darkBorder: '#bdbdbd' };
    };

    const getSalaColor = (salaNombre) => {
        const salaColors = {
            'Sala Roja': { bg: 'transparent', color: '#c62828', border: '#c62828', darkBg: 'transparent', darkColor: '#ef5350', darkBorder: '#ef5350' },
            'Sala Azul': { bg: 'transparent', color: '#1565c0', border: '#1565c0', darkBg: 'transparent', darkColor: '#42a5f5', darkBorder: '#42a5f5' },
            'Sala Verde': { bg: 'transparent', color: '#2e7d32', border: '#2e7d32', darkBg: 'transparent', darkColor: '#66bb6a', darkBorder: '#66bb6a' },
            'Sala Amarilla': { bg: 'transparent', color: '#f57f17', border: '#f57f17', darkBg: 'transparent', darkColor: '#ffb300', darkBorder: '#ffb300' },
            'Sala Naranja': { bg: 'transparent', color: '#e65100', border: '#e65100', darkBg: 'transparent', darkColor: '#ff9800', darkBorder: '#ff9800' },
            'Sala Violeta': { bg: 'transparent', color: '#6a1b9a', border: '#6a1b9a', darkBg: 'transparent', darkColor: '#ab47bc', darkBorder: '#ab47bc' },
        };
        return salaColors[salaNombre] || { bg: 'transparent', color: '#616161', border: '#616161', darkBg: 'transparent', darkColor: '#bdbdbd', darkBorder: '#bdbdbd' };
    };

    const getTurnoColor = (turno) => {
        const colors = {
            'Mañana': { bg: 'transparent', color: '#f57f17', border: '#f57f17', darkBg: 'transparent', darkColor: '#ffa726', darkBorder: '#ffa726' },
            'Tarde': { bg: 'transparent', color: '#0277bd', border: '#0277bd', darkBg: 'transparent', darkColor: '#4fc3f7', darkBorder: '#4fc3f7' },
            'Completo': { bg: 'transparent', color: '#388e3c', border: '#388e3c', darkBg: 'transparent', darkColor: '#66bb6a', darkBorder: '#66bb6a' },
        };
        return colors[turno] || { bg: 'transparent', color: '#616161', border: '#616161', darkBg: 'transparent', darkColor: '#bdbdbd', darkBorder: '#bdbdbd' };
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">
                    <span style={{fontSize: '1.8rem'}}><span className="material-icons">groups</span></span> Listado de Alumnos
                </h2>
                {Array.isArray(alumnos) && alumnos.length > 0 && (
                    <span className="text-muted" style={{fontSize: '0.95rem'}}>
                        <span className="material-icons" style={{fontSize: '1rem', verticalAlign: 'middle'}}>info</span>
                        {' '}{alumnos.length} alumno{alumnos.length !== 1 ? 's' : ''} encontrado{alumnos.length !== 1 ? 's' : ''}
                    </span>
                )}
            </div>

            {Array.isArray(alumnos) && alumnos.length === 0 ? (
                <Alert variant="warning" className="shadow-sm border-0 py-4">
                    <Alert.Heading className="h5"><span className="material-icons">search</span> No se encontraron alumnos</Alert.Heading>
                    <p className="mb-0">
                        No hay alumnos que coincidan con los criterios de búsqueda.
                        Intente ajustar los filtros o registre un nuevo alumno.
                    </p>
                </Alert>
            ) : (
                <Card className="shadow border-0 overflow-hidden">
                    <Table responsive hover className="mb-0" style={{fontSize: '0.95rem'}}>
                        <thead style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white'}}>
                            <tr>
                                <th className="py-3 px-4 border-0">
                                    <span className="material-icons" style={{fontSize: '1.1rem'}}>person</span> Nombre Completo
                                </th>
                                <th className="py-3 px-3 border-0">
                                    <span className="material-icons" style={{fontSize: '1.1rem'}}>cake</span> Edad
                                </th>
                                <th className="py-3 px-3 border-0">
                                    <span className="material-icons" style={{fontSize: '1.1rem'}}>meeting_room</span> Sala
                                </th>
                                <th className="py-3 px-3 border-0">
                                    <span className="material-icons" style={{fontSize: '1.1rem'}}>schedule</span> Turno
                                </th>
                                <th className="py-3 px-3 border-0 text-center">
                                    <span className="material-icons" style={{fontSize: '1.1rem'}}>settings</span> Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(alumnos) ? (
                                alumnos.map((alumno, index) => (
                                    <tr
                                        key={alumno.id}
                                        onClick={() => onSelect(alumno)}
                                        style={{
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#e7f3ff';
                                            e.currentTarget.style.transform = 'scale(1.01)';
                                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#f8f9fa' : 'white';
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <td className="py-3 px-4 fw-semibold text-dark" style={{fontSize: '1.05rem'}}>
                                            {`${alumno.nombre} ${alumno.apellidoPaterno} ${alumno.apellidoMaterno}`}
                                            {alumno.alias && (
                                                <Badge bg="light" text="dark" className="ms-2" style={{fontSize: '0.85rem'}}>
                                                    "{alumno.alias}"
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="py-3 px-3">
                                            <span
                                                className="px-4 py-2 d-inline-block"
                                                style={{
                                                    fontSize: '0.95rem',
                                                    fontWeight: '600',
                                                    borderRadius: '4px',
                                                    backgroundColor: darkMode ? getEdadColor(calcularEdad(alumno.fechaNacimiento)).darkBg : getEdadColor(calcularEdad(alumno.fechaNacimiento)).bg,
                                                    color: darkMode ? getEdadColor(calcularEdad(alumno.fechaNacimiento)).darkColor : getEdadColor(calcularEdad(alumno.fechaNacimiento)).color,
                                                    border: `2px solid ${darkMode ? getEdadColor(calcularEdad(alumno.fechaNacimiento)).darkBorder : getEdadColor(calcularEdad(alumno.fechaNacimiento)).border}`
                                                }}
                                            >
                                                {calcularEdad(alumno.fechaNacimiento)} años
                                            </span>
                                        </td>
                                        <td className="py-3 px-3">
                                            <span
                                                className="px-4 py-2 d-inline-block"
                                                style={{
                                                    fontSize: '0.95rem',
                                                    fontWeight: '600',
                                                    borderRadius: '4px',
                                                    backgroundColor: darkMode ? getSalaColor(alumno.sala?.nombre).darkBg : getSalaColor(alumno.sala?.nombre).bg,
                                                    color: darkMode ? getSalaColor(alumno.sala?.nombre).darkColor : getSalaColor(alumno.sala?.nombre).color,
                                                    border: `2px solid ${darkMode ? getSalaColor(alumno.sala?.nombre).darkBorder : getSalaColor(alumno.sala?.nombre).border}`
                                                }}
                                            >
                                                {alumno.sala ? alumno.sala.nombre : 'N/A'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3">
                                            <span
                                                className="px-4 py-2 d-inline-block"
                                                style={{
                                                    fontSize: '0.95rem',
                                                    fontWeight: '600',
                                                    borderRadius: '4px',
                                                    backgroundColor: darkMode ? getTurnoColor(alumno.turno).darkBg : getTurnoColor(alumno.turno).bg,
                                                    color: darkMode ? getTurnoColor(alumno.turno).darkColor : getTurnoColor(alumno.turno).color,
                                                    border: `2px solid ${darkMode ? getTurnoColor(alumno.turno).darkBorder : getTurnoColor(alumno.turno).border}`
                                                }}
                                            >
                                                {getTurnoIcon(alumno.turno)} {alumno.turno}
                                            </span>
                                        </td>
                                        <td
                                            className="py-3 px-3 text-center"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="d-flex gap-2 justify-content-center">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => onEdit(alumno)}
                                                    className="shadow-sm px-3"
                                                    style={{
                                                        borderWidth: '2px',
                                                        fontWeight: '500',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    <span className="material-icons" style={{fontSize: '1rem'}}>edit</span> Editar
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => onDelete(alumno.id)}
                                                    className="shadow-sm px-3"
                                                    style={{
                                                        borderWidth: '2px',
                                                        fontWeight: '500',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    <span className="material-icons" style={{fontSize: '1rem'}}>delete</span> Eliminar
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center p-4 text-muted">
                                        <span className="material-icons" style={{fontSize: '2rem', opacity: 0.5}}>person</span>
                                        <div>No hay alumnos para mostrar</div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card>
            )}
        </div>
    );
};

export default StudentList;

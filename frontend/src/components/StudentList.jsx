// frontend/src/components/StudentList.jsx
import React from 'react';
import { Table, Button, Spinner, Alert, Badge, Card } from 'react-bootstrap';

const StudentList = ({ alumnos, loading, onEdit, onDelete, onSelect }) => {
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
                <Alert.Heading className="h5">ℹ️ Sin datos</Alert.Heading>
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

    const getTurnoColor = (turno) => {
        switch(turno) {
            case 'Mañana': return 'warning';
            case 'Tarde': return 'info';
            case 'Completo': return 'success';
            default: return 'secondary';
        }
    };

    const getTurnoIcon = (turno) => {
        switch(turno) {
            case 'Mañana': return '☀️';
            case 'Tarde': return '🌙';
            case 'Completo': return '🌞';
            default: return '🕐';
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">
                    <span style={{fontSize: '1.8rem'}}>👥</span> Listado de Alumnos
                </h2>
                {alumnos.length > 0 && (
                    <Badge 
                        bg="primary" 
                        className="px-4 py-2 shadow-sm"
                        style={{fontSize: '1.1rem', fontWeight: 'normal'}}
                    >
                        {alumnos.length} alumno{alumnos.length !== 1 ? 's' : ''} encontrado{alumnos.length !== 1 ? 's' : ''}
                    </Badge>
                )}
            </div>

            {alumnos.length === 0 ? (
                <Alert variant="warning" className="shadow-sm border-0 py-4">
                    <Alert.Heading className="h5">🔍 No se encontraron alumnos</Alert.Heading>
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
                                    <span style={{fontSize: '1.1rem'}}>👤</span> Nombre Completo
                                </th>
                                <th className="py-3 px-3 border-0">
                                    <span style={{fontSize: '1.1rem'}}>🎂</span> Edad
                                </th>
                                <th className="py-3 px-3 border-0">
                                    <span style={{fontSize: '1.1rem'}}>🏫</span> Sala
                                </th>
                                <th className="py-3 px-3 border-0">
                                    <span style={{fontSize: '1.1rem'}}>🕐</span> Turno
                                </th>
                                <th className="py-3 px-3 border-0 text-center">
                                    <span style={{fontSize: '1.1rem'}}>⚙️</span> Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {alumnos.map((alumno, index) => (
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
                                    <td className="py-3 px-4 fw-semibold text-dark">
                                        {`${alumno.nombre} ${alumno.apellidoPaterno} ${alumno.apellidoMaterno}`}
                                        {alumno.alias && (
                                            <Badge bg="light" text="dark" className="ms-2" style={{fontSize: '0.75rem'}}>
                                                "{alumno.alias}"
                                            </Badge>
                                        )}
                                    </td>
                                    <td className="py-3 px-3">
                                        <Badge bg="secondary" className="px-3 py-1">
                                            {calcularEdad(alumno.fechaNacimiento)} años
                                        </Badge>
                                    </td>
                                    <td className="py-3 px-3">
                                        <Badge bg="info" className="px-3 py-1">
                                            {alumno.sala ? alumno.sala.nombre : 'N/A'}
                                        </Badge>
                                    </td>
                                    <td className="py-3 px-3">
                                        <Badge bg={getTurnoColor(alumno.turno)} className="px-3 py-1">
                                            {getTurnoIcon(alumno.turno)} {alumno.turno}
                                        </Badge>
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
                                                ✏️ Editar
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
                                                🗑️ Eliminar
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card>
            )}
        </div>
    );
};

export default StudentList;

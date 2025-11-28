// frontend/src/components/Dashboard.jsx
import React from 'react';
import { Row, Col, Card, Badge, ProgressBar } from 'react-bootstrap';
import { getClassroomStatus } from '../utils/classroomStatus';

const Dashboard = ({ alumnos, salas, onNavigate, onShowOcupacion }) => {
    // Estadísticas de alumnos
    const totalAlumnos = alumnos.length;
    const alumnosSinSala = alumnos.filter(a => !a.sala).length;
    const alumnosMañana = alumnos.filter(a => a.turno === 'Mañana').length;
    const alumnosTarde = alumnos.filter(a => a.turno === 'Tarde').length;

    // Estadísticas de salas
    const totalSalas = salas.length;
    const salasVacias = salas.filter(s => s.asignados === 0).length;
    const salasCompletas = salas.filter(s => s.asignados >= s.capacidad).length;
    const salasSobrepasadas = salas.filter(s => s.asignados > s.capacidad).length;
    
    // Capacidad total
    const capacidadTotal = salas.reduce((sum, s) => sum + s.capacidad, 0);
    const ocupacionTotal = salas.reduce((sum, s) => sum + (s.asignados || 0), 0);
    const porcentajeOcupacion = capacidadTotal > 0 ? (ocupacionTotal / capacidadTotal) * 100 : 0;
    const espaciosDisponibles = capacidadTotal - ocupacionTotal;

    // Calcular edad promedio
    const calcularEdad = (fechaNacimiento) => {
        if (!fechaNacimiento) return 0;
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    };

    const edadPromedio = alumnos.length > 0
        ? (alumnos.reduce((sum, a) => sum + calcularEdad(a.fechaNacimiento), 0) / alumnos.length).toFixed(1)
        : 0;

    // Salas con más alumnos
    const salasOrdenadas = [...salas].sort((a, b) => (b.asignados || 0) - (a.asignados || 0)).slice(0, 5);

    return (
        <div>
            {/* Tarjetas de estadísticas principales */}
            <Row className="mb-2 g-2">
                <Col md={2} className="mb-2">
                    <Card 
                        className="h-100 shadow-sm"
                        style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                        onClick={() => onNavigate('students')}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-0 small">Total Alumnos</p>
                                    <h3 className="mb-0">{totalAlumnos}</h3>
                                </div>
                                <span className="material-icons" style={{fontSize: '2.5rem', color: '#667eea', opacity: 0.7}}>
                                    people
                                </span>
                            </div>
                            <small className="text-muted">
                                <span className="material-icons" style={{fontSize: '0.8rem', verticalAlign: 'middle'}}>
                                    info
                                </span> Click para ver
                            </small>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={2} className="mb-2">
                    <Card 
                        className="h-100 shadow-sm"
                        style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                        onClick={() => onNavigate('classrooms')}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-0 small">Total Salas</p>
                                    <h3 className="mb-0">{totalSalas}</h3>
                                </div>
                                <span className="material-icons" style={{fontSize: '2.5rem', color: '#11998e', opacity: 0.7}}>
                                    meeting_room
                                </span>
                            </div>
                            <small className="text-muted">
                                <span className="material-icons" style={{fontSize: '0.8rem', verticalAlign: 'middle'}}>
                                    info
                                </span> Click para ver
                            </small>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={2} className="mb-2">
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-0 small">Capacidad</p>
                                    <h3 className="mb-0">{capacidadTotal}</h3>
                                </div>
                                <span className="material-icons" style={{fontSize: '2.5rem', color: '#f093fb', opacity: 0.7}}>
                                    airline_seat_recline_normal
                                </span>
                            </div>
                            <small className="text-success">
                                <span className="material-icons" style={{fontSize: '0.8rem', verticalAlign: 'middle'}}>
                                    check_circle
                                </span> {espaciosDisponibles} disponibles
                            </small>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={2} className="mb-2">
                    <Card 
                        className="h-100 shadow-sm"
                        style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                        onClick={onShowOcupacion}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-0 small">Ocupación</p>
                                    <h3 className="mb-0">{porcentajeOcupacion.toFixed(1)}%</h3>
                                </div>
                                <span className="material-icons" style={{fontSize: '2.5rem', color: porcentajeOcupacion > 90 ? '#f5576c' : porcentajeOcupacion > 70 ? '#f39c12' : '#38ef7d', opacity: 0.7}}>
                                    pie_chart
                                </span>
                            </div>
                            <small className="text-muted">
                                <span className="material-icons" style={{fontSize: '0.8rem', verticalAlign: 'middle'}}>
                                    info
                                </span> Click para ver
                            </small>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={2} className="mb-2">
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-0 small">Edad Media</p>
                                    <h3 className="mb-0">{edadPromedio}</h3>
                                </div>
                                <span className="material-icons" style={{fontSize: '2.5rem', color: '#fa709a', opacity: 0.7}}>
                                    cake
                                </span>
                            </div>
                            <small className="text-muted">{totalAlumnos} alumnos</small>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={2} className="mb-2">
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-0 small">Sin Sala</p>
                                    <h3 className="mb-0">{alumnosSinSala}</h3>
                                </div>
                                <span className="material-icons" style={{fontSize: '2.5rem', color: alumnosSinSala > 0 ? '#f39c12' : '#95a5a6', opacity: 0.7}}>
                                    person_off
                                </span>
                            </div>
                            <small className={alumnosSinSala > 0 ? "text-warning" : "text-muted"}>
                                {alumnosSinSala > 0 ? 'Pendientes' : 'Todo OK'}
                            </small>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={2} className="mb-2">
                    <Card 
                        className="h-100 shadow-sm"
                        style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                        onClick={() => onNavigate('responsables')}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-0 small">Responsables</p>
                                    <h3 className="mb-0">
                                        <span className="material-icons" style={{fontSize: '2rem', verticalAlign: 'middle'}}>
                                            family_restroom
                                        </span>
                                    </h3>
                                </div>
                            </div>
                            <small className="text-primary">
                                <span className="material-icons" style={{fontSize: '0.8rem', verticalAlign: 'middle'}}>
                                    arrow_forward
                                </span> Gestionar
                            </small>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-2">
                {/* Distribución por turno */}
                <Col md={6} className="mb-2">
                    <Card className="shadow-sm h-100">
                        <Card.Body>
                            <h5 className="mb-2">
                                <span className="material-icons" style={{fontSize: '1.2rem', verticalAlign: 'middle'}}>
                                    schedule
                                </span> Distribución por Turno
                            </h5>
                            <div className="mb-2">
                                <div className="d-flex justify-content-between mb-2">
                                    <span>
                                        <Badge bg="info">Mañana</Badge> {alumnosMañana} alumnos
                                    </span>
                                    <strong>{totalAlumnos > 0 ? ((alumnosMañana / totalAlumnos) * 100).toFixed(1) : 0}%</strong>
                                </div>
                                <ProgressBar 
                                    now={totalAlumnos > 0 ? (alumnosMañana / totalAlumnos) * 100 : 0} 
                                    variant="info"
                                />
                            </div>
                            <div className="mb-2">
                                <div className="d-flex justify-content-between mb-2">
                                    <span>
                                        <Badge bg="dark">Tarde</Badge> {alumnosTarde} alumnos
                                    </span>
                                    <strong>{totalAlumnos > 0 ? ((alumnosTarde / totalAlumnos) * 100).toFixed(1) : 0}%</strong>
                                </div>
                                <ProgressBar 
                                    now={totalAlumnos > 0 ? (alumnosTarde / totalAlumnos) * 100 : 0} 
                                    variant="dark"
                                />
                            </div>
                            {alumnosSinSala > 0 && (
                                <div className="alert alert-warning mb-0">
                                    <span className="material-icons" style={{fontSize: '1rem', verticalAlign: 'middle'}}>
                                        warning
                                    </span> {alumnosSinSala} alumno(s) sin sala asignada
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Top 5 salas más pobladas */}
                <Col md={6} className="mb-2">
                    <Card className="shadow-sm h-100">
                        <Card.Body>
                            <h5 className="mb-2">
                                <span className="material-icons" style={{fontSize: '1.2rem', verticalAlign: 'middle'}}>
                                    trending_up
                                </span> Salas con Más Alumnos
                            </h5>
                            {salasOrdenadas.length === 0 ? (
                                <p className="text-muted">No hay salas registradas</p>
                            ) : (
                                <div>
                                    {salasOrdenadas.map((sala, index) => {
                                        const status = getClassroomStatus(sala.asignados, sala.capacidad);
                                        const porcentaje = (sala.asignados / sala.capacidad) * 100;
                                        
                                        return (
                                            <div key={sala.id} className="mb-2">
                                                <div className="d-flex justify-content-between mb-1">
                                                    <span>
                                                        <strong>{index + 1}.</strong> {sala.nombre}
                                                    </span>
                                                    <span>
                                                        <Badge bg={status.variant}>{sala.asignados}</Badge>
                                                        <span className="text-muted"> / {sala.capacidad}</span>
                                                    </span>
                                                </div>
                                                <ProgressBar 
                                                    now={porcentaje} 
                                                    variant={status.variant}
                                                    style={{ height: '10px' }}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;

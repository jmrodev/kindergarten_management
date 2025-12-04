import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { People, Pencil, Trash, Plus, Eye } from 'react-bootstrap-icons';
import classroomService from '../../api/classroomService';

const ClassroomList = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [classroomToDelete, setClassroomToDelete] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    capacity: '',
    shift: ''
  });

  const fetchClassrooms = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await classroomService.getAll(filters);
      setClassrooms(response.data.data || []);
    } catch (err) {
      setError('Error al cargar las salas: ' + err.message);
      console.error('Error fetching classrooms:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchClassrooms();
  }, [fetchClassrooms]);

  const handleDelete = async () => {
    if (!classroomToDelete) return;

    try {
      await classroomService.delete(classroomToDelete.id);
      setClassrooms(classrooms.filter(classroom => classroom.id !== classroomToDelete.id));
      setShowDeleteModal(false);
      setClassroomToDelete(null);
    } catch (err) {
      setError('Error al eliminar la sala: ' + err.message);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <Container fluid className="py-4">
        <Row className="justify-content-center">
          <Col xs="auto">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h3 mb-0">
            <People className="me-2" />
            Gestión de Salas
          </h1>
          <p className="text-muted">Administrar las salas del jardín de infantes</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="form-container mb-4">
        <Card.Header className="form-header">
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0">Filtros de Búsqueda</h5>
            </Col>
            <Col xs="auto">
              <Button variant="primary" href="/classrooms/new">
                <Plus className="me-2" />
                Nueva Sala
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="form-body">
          <Form>
            <Row>
              <Col md={4}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Buscar por nombre</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre de la sala..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Capacidad</Form.Label>
                  <Form.Select
                    value={filters.capacity}
                    onChange={(e) => handleFilterChange('capacity', e.target.value)}
                  >
                    <option value="">Todas las capacidades</option>
                    <option value="10">10 alumnos</option>
                    <option value="15">15 alumnos</option>
                    <option value="20">20 alumnos</option>
                    <option value="25">25 alumnos</option>
                    <option value="30">30 alumnos</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Turno</Form.Label>
                  <Form.Select
                    value={filters.shift}
                    onChange={(e) => handleFilterChange('shift', e.target.value)}
                  >
                    <option value="">Todos los turnos</option>
                    <option value="Mañana">Mañana</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Completo">Completo</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Card className="table-container">
        <Card.Header className="table-header">
          <h5 className="mb-0">Listado de Salas</h5>
        </Card.Header>
        <Card.Body className="table-body p-0">
          <div className="table-responsive">
            <Table className="mb-0" striped hover>
              <thead className="table-light">
                <tr>
                  <th>Nombre</th>
                  <th>Capacidad</th>
                  <th>Turno</th>
                  <th>Año Académico</th>
                  <th>Grupo de Edad</th>
                  <th>Estado</th>
                  <th>Alumnos Asignados</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {classrooms.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      No se encontraron salas
                    </td>
                  </tr>
                ) : (
                  classrooms.map((classroom) => (
                    <tr key={classroom.id}>
                      <td>
                        <strong>{classroom.name}</strong>
                      </td>
                      <td>
                        {classroom.capacity} {classroom.capacity === 1 ? 'alumno' : 'alumnos'}
                      </td>
                      <td>{classroom.shift}</td>
                      <td>{classroom.academic_year}</td>
                      <td>{classroom.age_group} años</td>
                      <td>
                        <span className={`badge ${classroom.is_active ? 'bg-success' : 'bg-secondary'}`}>
                          {classroom.is_active ? 'Activa' : 'Inactiva'}
                        </span>
                      </td>
                      <td>
                        {classroom.assigned_students_count || 0}/{classroom.capacity}
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          href={`/classrooms/edit/${classroom.id}`}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="outline-info"
                          size="sm"
                          className="me-2"
                          href={`/classrooms/${classroom.id}`}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            setClassroomToDelete(classroom);
                            setShowDeleteModal(true);
                          }}
                        >
                          <Trash size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Modal de confirmación de eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro de que desea eliminar la sala <strong>
            {classroomToDelete?.name}
          </strong>? Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ClassroomList;
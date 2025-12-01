import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { Pencil, Trash, Plus, Eye, PersonCircle } from 'react-bootstrap-icons';
import studentService from '../../api/studentService';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    classroomId: '',
    search: ''
  });

  const fetchStudents = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await studentService.getAll(filters);
      setStudents(response.data.data || []);
    } catch (err) {
      setError('Error al cargar los alumnos: ' + err.message);
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleDelete = async () => {
    if (!studentToDelete) return;

    try {
      await studentService.delete(studentToDelete.id);
      setStudents(students.filter(student => student.id !== studentToDelete.id));
      setShowDeleteModal(false);
      setStudentToDelete(null);
    } catch (err) {
      setError('Error al eliminar el alumno: ' + err.message);
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
            <Pencil className="me-2" />
            Gestión de Alumnos
          </h1>
          <p className="text-muted">Administrar la información de los alumnos del jardín</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-4">
        <Card.Header>
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0">Filtros de Búsqueda</h5>
            </Col>
            <Col xs="auto">
              <Button variant="primary" href="/students/new">
                <Plus className="me-2" />
                Nuevo Alumno
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Form>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Buscar</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre, apellido o DNI..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="">Todos los estados</option>
                    <option value="preinscripto">Preinscripto</option>
                    <option value="inscripto">Inscripto</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="egresado">Egresado</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Sala</Form.Label>
                  <Form.Select
                    value={filters.classroomId}
                    onChange={(e) => handleFilterChange('classroomId', e.target.value)}
                  >
                    <option value="">Todas las salas</option>
                    {/* Se agregarían las salas desde el backend */}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h5 className="mb-0">Listado de Alumnos</h5>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table className="mb-0" striped hover>
              <thead className="table-light">
                <tr>
                  <th>Foto</th>
                  <th>Nombre</th>
                  <th>DNI</th>
                  <th>Fecha Nacimiento</th>
                  <th>Sala</th>
                  <th>Estado</th>
                  <th>Vacunas</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      No se encontraron alumnos
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student.id}>
                      <td>
                        {student.photo_path ? (
                          <img 
                            src={student.photo_path} 
                            alt="Foto del alumno" 
                            className="rounded-circle"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" 
                               style={{ width: '40px', height: '40px' }}>
                            <PersonCircle size={20} />
                          </div>
                        )}
                      </td>
                      <td>
                        {student.first_name} {student.paternal_surname} {student.maternal_surname}
                      </td>
                      <td>{student.dni}</td>
                      <td>{new Date(student.birth_date).toLocaleDateString()}</td>
                      <td>{student.classroom_name || 'Sin sala'}</td>
                      <td>
                        <span className={`badge student-status-${student.status}`}>
                          {student.status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${
                          student.vaccination_status === 'completo' ? 'vaccine-status-completo' :
                          student.vaccination_status === 'incompleto' ? 'vaccine-status-incompleto' :
                          'vaccine-status-pendiente'
                        }`}>
                          {student.vaccination_status}
                        </span>
                      </td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-2"
                          href={`/students/edit/${student.id}`}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button 
                          variant="outline-info" 
                          size="sm" 
                          className="me-2"
                          href={`/students/${student.id}`}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => {
                            setStudentToDelete(student);
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
          ¿Está seguro de que desea eliminar al alumno <strong>
            {studentToDelete?.first_name} {studentToDelete?.paternal_surname}
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

export default StudentList;
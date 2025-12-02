import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'react-bootstrap-icons';
import OfficeTable from '../../components/organisms/OfficeTable';
import TableCell from '../../components/atoms/TableCell';
import TableRow from '../../components/molecules/TableRow';
import TableHeaderCell from '../../components/atoms/TableHeaderCell';
import Badge from '../../components/atoms/Badge';
import Icon from '../../components/atoms/Icon';
import Container from '../../components/atoms/Container';
import { Row, Col } from '../../components/atoms/Grid';
import Card from '../../components/atoms/Card';
import Button from '../../components/atoms/Button';
import Spinner from '../../components/atoms/Spinner';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { safeExtractData, getColorVariantById, normalizeName } from '../../utils/apiResponseHandler';
import classroomService from '../../api/classroomService';

const ClassroomList = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [classroomToDelete, setClassroomToDelete] = useState(null);

  const fetchClassrooms = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await classroomService.getAll();
      setClassrooms(safeExtractData(response));
    } catch (err) {
      setError('Error al cargar las salas: ' + err.message);
      console.error('Error fetching classrooms:', err);
    } finally {
      setLoading(false);
    }
  }, []);

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
    <Container fluid className="p-0 m-0" style={{padding: '0', margin: '0', marginTop: '0', paddingTop: '0'}}>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="border-0 m-0" style={{marginTop: '0', paddingTop: '0', border: 'none'}}>
        <Card.Header className="p-1" style={{padding: '2px', borderBottom: '1px solid #dee2e6'}}>
          <h5 className="mb-0" style={{fontSize: '0.9rem', padding: '4px 8px'}}>Listado de Salas</h5>
        </Card.Header>
        <Card.Body className="p-0" style={{padding: '0'}}>
          <OfficeTable
            headers={[
              { label: 'Nombre' },
              { label: 'Capacidad' },
              { label: 'Turno' },
              { label: 'Año Académico' },
              { label: 'Grupo de Edad' },
              { label: 'Estado' },
              { label: 'Alumnos Asignados' },
              { label: 'Acciones' }
            ]}
            data={classrooms}
            renderRow={(classroom) => (
              <>
                <TableCell>
                  <strong>{normalizeName(classroom.name)}</strong>
                </TableCell>
                <TableCell>
                  {classroom.capacity} {classroom.capacity === 1 ? 'alumno' : 'alumnos'}
                </TableCell>
                <TableCell>
                  {classroom.shift ? (
                    <Badge type="classroom" variant={getColorVariantById(classroom.shift)} capitalize="uppercase">
                      {normalizeName(classroom.shift)}
                    </Badge>
                  ) : (
                    <Badge type="classroom" variant="default" capitalize="uppercase">
                      Sin turno
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{classroom.academic_year}</TableCell>
                <TableCell>{classroom.age_group} años</TableCell>
                <TableCell>
                  <Badge type="status" variant={classroom.is_active ? 'success' : 'danger'} capitalize="uppercase">
                    {classroom.is_active ? 'Activa' : 'Inactiva'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {classroom.assigned_students_count || 0}/{classroom.capacity}
                </TableCell>
                <TableCell>
                  <div className="office-actions-container">
                    <a href={`/classrooms/edit/${classroom.id}`} title="Editar" style={{ textDecoration: 'none', color: 'inherit', margin: '0.25rem' }}>
                      <Icon type="edit" size={18} title="Editar" />
                    </a>
                    <a href={`/classrooms/${classroom.id}`} title="Ver Detalles" style={{ textDecoration: 'none', color: 'inherit', margin: '0.25rem' }}>
                      <Icon type="view" size={18} title="Ver Detalles" />
                    </a>
                    <span
                      onClick={() => {
                        setClassroomToDelete(classroom);
                        setShowDeleteModal(true);
                      }}
                      title="Eliminar"
                      style={{ cursor: 'pointer', margin: '0.25rem' }}
                    >
                      <Icon type="delete" size={18} title="Eliminar" />
                    </span>
                  </div>
                </TableCell>
              </>
            )}
            emptyMessage="No se encontraron salas"
          />
        </Card.Body>
      </Card>

      {/* Modal de confirmación de eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro de que desea eliminar la sala <strong>
            {classroomToDelete?.name && normalizeName(classroomToDelete.name)}
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
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, PersonCircle } from 'react-bootstrap-icons';
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
import Modal from 'react-bootstrap/Modal'; // Por ahora mantendremos Modal ya que requiere más trabajo personalizarlo
import Form from 'react-bootstrap/Form'; // Por ahora mantendremos Form
import Alert from 'react-bootstrap/Alert'; // Por ahora mantendremos Alert
import { safeExtractData, getColorVariantById, normalizeName } from '../../utils/apiResponseHandler';
import studentService from '../../api/studentService';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const fetchStudents = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      // Fetch all students without filters
      const response = await studentService.getAll();
      setStudents(safeExtractData(response));
    } catch (err) {
      setError('Error al cargar los alumnos: ' + err.message);
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  }, []);

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

      <Card className="border-0 m-0" style={{marginTop: '0', paddingTop: '0', border: 'none'}}>
        <Card.Header className="p-1" style={{padding: '2px', borderBottom: '1px solid #dee2e6'}}>
          <h5 className="mb-0" style={{fontSize: '0.9rem', padding: '4px 8px'}}>Listado de Alumnos</h5>
        </Card.Header>
        <Card.Body className="p-0" style={{padding: '0'}}>
          <OfficeTable
            headers={[
              { label: 'Foto' },
              { label: 'Nombre' },
              { label: 'DNI' },
              { label: 'Fecha Nacimiento' },
              { label: 'Sala' },
              { label: 'Turno' },
              { label: 'Estado' },
              { label: 'Vacunas' },
              { label: 'Acciones' }
            ]}
            data={students}
            renderRow={(student) => (
              <>
                <TableCell>
                  <div className="d-flex align-items-center justify-content-center">
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
                  </div>
                </TableCell>
                <TableCell>
                  {normalizeName(student.first_name)} {normalizeName(student.paternal_surname)} {normalizeName(student.maternal_surname)}
                </TableCell>
                <TableCell>{student.dni}</TableCell>
                <TableCell>{new Date(student.birth_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  {student.classroom_name ? (
                    <Badge type="classroom" variant={getColorVariantById(student.classroom_id || student.classroom_name)} capitalize="uppercase">
                      {student.classroom_name}
                    </Badge>
                  ) : (
                    <Badge type="classroom" variant="default" capitalize="uppercase">
                      Sin sala
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {student.shift ? (
                    <Badge type="classroom" variant={getColorVariantById(student.shift_id || student.shift)} capitalize="uppercase">
                      {student.shift}
                    </Badge>
                  ) : (
                    <Badge type="classroom" variant="default" capitalize="uppercase">
                      Sin turno
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge type="status" variant={getColorVariantById(student.status_id || student.status)} capitalize="uppercase">
                    {student.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    type="vaccine"
                    variant={getColorVariantById(student.vaccination_status_id || student.vaccination_status)}
                    capitalize="uppercase"
                  >
                    {student.vaccination_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="office-actions-container">
                    <a href={`/students/edit/${student.id}`} title="Editar" style={{ textDecoration: 'none', color: 'inherit', margin: '0.25rem' }}>
                      <Icon type="edit" size={18} title="Editar" />
                    </a>
                    <a href={`/students/${student.id}`} title="Ver Detalles" style={{ textDecoration: 'none', color: 'inherit', margin: '0.25rem' }}>
                      <Icon type="view" size={18} title="Ver Detalles" />
                    </a>
                    <span
                      onClick={() => {
                        setStudentToDelete(student);
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
            emptyMessage="No se encontraron alumnos"
          />
        </Card.Body>
      </Card>

      {/* Modal de confirmación de eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro de que desea eliminar al alumno <strong>
            {studentToDelete?.first_name && normalizeName(studentToDelete.first_name)} {studentToDelete?.paternal_surname && normalizeName(studentToDelete.paternal_surname)}
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
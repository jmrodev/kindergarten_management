import React, { useState, useEffect, useCallback } from 'react';
import { Plus, PersonCircle, FileEarmarkPlus } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import OfficeRibbonWithTitle from '../../components/atoms/OfficeRibbonWithTitle';
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
import VaccinationStatusWithLink from '../../components/atoms/VaccinationStatusWithLink';
import ConfirmationModal from '../../components/molecules/ConfirmationModal';
import FormModal from '../../components/molecules/FormModal';
import StudentDetails from '../../components/organisms/StudentDetails';
import Alert from 'react-bootstrap/Alert'; // Por ahora mantendremos Alert
import { safeExtractData, getColorVariantById, normalizeName } from '../../utils/apiResponseHandler';
import studentService from '../../api/studentService';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [studentToView, setStudentToView] = useState(null);
  const navigate = useNavigate();

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
        <Card.Header className="p-1 office-ribbon" style={{padding: '2px', borderBottom: '1px solid #dee2e6'}}>
          <OfficeRibbonWithTitle
            title="Listado de Alumnos"
            menuItems={[
              {
                label: "Nuevo",
                icon: <FileEarmarkPlus size={16} />,
                onClick: () => navigate('/students/new')
              }
            ]}
            onClose={() => navigate('/dashboard')}
            navigate={navigate}
            showTitle={false} // Hide the title as requested
          />
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
                  <VaccinationStatusWithLink
                    studentId={student.id}
                    status={student.vaccination_status}
                  />
                </TableCell>
                <TableCell>
                  <div className="office-actions-container">
                    <span
                      onClick={() => navigate(`/students/edit/${student.id}`)}
                      title="Editar"
                      style={{ cursor: 'pointer', margin: '0.25rem', textDecoration: 'none', color: 'inherit' }}
                    >
                      <Icon type="edit" size={18} title="Editar" />
                    </span>
                    <span
                      onClick={async () => {
                        try {
                          // Get the complete student record (with emergency contact info included)
                          const studentResponse = await studentService.getById(student.id);
                          const fullStudentData = studentResponse.data.data;

                          setStudentToView(fullStudentData);
                          setShowViewModal(true);
                        } catch (err) {
                          console.error('Error loading student data:', err);
                          // Fallback to basic student data
                          setStudentToView(student);
                          setShowViewModal(true);
                        }
                      }}
                      title="Ver Detalles"
                      style={{ cursor: 'pointer', margin: '0.25rem', textDecoration: 'none', color: 'inherit' }}
                    >
                      <Icon type="view" size={18} title="Ver Detalles" />
                    </span>
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

      <ConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Confirmar Eliminación"
        message={`¿Está seguro de que desea eliminar al alumno ${studentToDelete?.first_name && normalizeName(studentToDelete.first_name)} ${studentToDelete?.paternal_surname && normalizeName(studentToDelete.paternal_surname)}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />

      <FormModal
        show={showViewModal}
        onHide={() => {
          setShowViewModal(false);
          setStudentToView(null);
        }}
        title={`Detalles de ${studentToView ? normalizeName(studentToView.first_name) + ' ' + normalizeName(studentToView.paternal_surname) : ''}`}
        size="lg"
      >
        <StudentDetails student={studentToView} />
      </FormModal>
    </Container>
  );
};

export default StudentList;
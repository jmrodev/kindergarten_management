import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tab, Tabs } from 'react-bootstrap';
import { ArrowLeft, Save, Person, Pencil } from 'react-bootstrap-icons';
import studentService from '../../api/studentService';
import classroomService from '../../api/classroomService';
import { useParams, useNavigate, Link } from 'react-router-dom';

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    // Datos personales
    first_name: '',
    middle_name_optional: '',
    third_name_optional: '',
    paternal_surname: '',
    maternal_surname: '',
    nickname_optional: '',
    dni: '',
    birth_date: '',

    // Dirección (campos separados que deberían mapearse a una tabla de dirección)
    street: '',
    number: '',
    city: '',
    provincia: '',
    postal_code_optional: '',

    // Contacto de emergencia
    emergency_contact_full_name: '',
    emergency_contact_relationship: '',
    emergency_contact_priority: 1,
    emergency_contact_phone: '',
    emergency_contact_alternative_phone: '',
    emergency_contact_authorized_pickup: false,

    // Información escolar
    classroom_id: '',
    shift: '',
    status: 'preinscripto',

    // Información médica
    health_insurance: '',
    affiliate_number: '',
    allergies: '',
    medications: '',
    medical_observations: '',
    blood_type: '',
    pediatrician_name: '',
    pediatrician_phone: '',

    // Autorizaciones
    photo_authorization: false,
    trip_authorization: false,
    medical_attention_authorization: false,

    // Información adicional
    has_siblings_in_school: false,
    special_needs: '',
    vaccination_status: 'no_informado',
    observations: '',

    // Datos de la dirección (simulando un objeto de dirección)
    address_id: null
  });

  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');

  const fetchClassrooms = useCallback(async () => {
    try {
      const response = await classroomService.getAll();
      setClassrooms(response.data.data || []);
    } catch (err) {
      setError('Error al cargar las salas: ' + err.message);
    }
  }, []);

  const fetchStudentData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await studentService.getById(id);
      const student = response.data.data;

      // Mapear los datos del estudiante al formulario
      setFormData(prev => ({
        ...prev,
        first_name: student.first_name || '',
        middle_name_optional: student.middle_name_optional || '',
        third_name_optional: student.third_name_optional || '',
        paternal_surname: student.paternal_surname || '',
        maternal_surname: student.maternal_surname || '',
        nickname_optional: student.nickname_optional || '',
        dni: student.dni || '',
        birth_date: student.birth_date || '',

        // Suponiendo que la dirección viene como parte del objeto
        street: student.street || '',
        number: student.number || '',
        city: student.city || '',
        provincia: student.provincia || '',
        postal_code_optional: student.postal_code_optional || '',

        // Suponiendo que el contacto de emergencia viene como parte del objeto
        classroom_id: student.classroom_id || '',
        shift: student.shift || '',
        status: student.status || 'preinscripto',

        health_insurance: student.health_insurance || '',
        affiliate_number: student.affiliate_number || '',
        allergies: student.allergies || '',
        medications: student.medications || '',
        medical_observations: student.medical_observations || '',
        blood_type: student.blood_type || '',
        pediatrician_name: student.pediatrician_name || '',
        pediatrician_phone: student.pediatrician_phone || '',

        photo_authorization: student.photo_authorization || false,
        trip_authorization: student.trip_authorization || false,
        medical_attention_authorization: student.medical_attention_authorization || false,

        has_siblings_in_school: student.has_siblings_in_school || false,
        special_needs: student.special_needs || '',
        vaccination_status: student.vaccination_status || 'no_informado',
        observations: student.observations || ''
      }));
    } catch (err) {
      setError('Error al cargar los datos del alumno: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchClassrooms();
    if (isEdit) {
      fetchStudentData();
    }
  }, [isEdit, fetchClassrooms, fetchStudentData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Preparar los datos para enviar al backend
      const studentData = {
        first_name: formData.first_name,
        middle_name_optional: formData.middle_name_optional,
        third_name_optional: formData.third_name_optional,
        paternal_surname: formData.paternal_surname,
        maternal_surname: formData.maternal_surname,
        nickname_optional: formData.nickname_optional,
        dni: formData.dni,
        birth_date: formData.birth_date,
        // Aquí se debería manejar la creación/actualización de la dirección
        classroom_id: formData.classroom_id,
        shift: formData.shift,
        status: formData.status,
        health_insurance: formData.health_insurance,
        affiliate_number: formData.affiliate_number,
        allergies: formData.allergies,
        medications: formData.medications,
        medical_observations: formData.medical_observations,
        blood_type: formData.blood_type,
        pediatrician_name: formData.pediatrician_name,
        pediatrician_phone: formData.pediatrician_phone,
        photo_authorization: formData.photo_authorization,
        trip_authorization: formData.trip_authorization,
        medical_attention_authorization: formData.medical_attention_authorization,
        has_siblings_in_school: formData.has_siblings_in_school,
        special_needs: formData.special_needs,
        vaccination_status: formData.vaccination_status,
        observations: formData.observations,
        // Aquí se debería incluir la información del contacto de emergencia
        emergency_contact: {
          full_name: formData.emergency_contact_full_name,
          relationship: formData.emergency_contact_relationship,
          priority: formData.emergency_contact_priority,
          phone: formData.emergency_contact_phone,
          alternative_phone: formData.emergency_contact_alternative_phone,
          is_authorized_pickup: formData.emergency_contact_authorized_pickup
        }
      };

      let response;
      if (isEdit) {
        response = await studentService.update(id, studentData);
        navigate(`/students/${id}`);
      } else {
        response = await studentService.create(studentData);
        navigate(`/students/edit/${response.data.data.id}`);
      }
    } catch (err) {
      setError('Error al guardar el alumno: ' + err.message);
      console.error('Error saving student:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <Container fluid className="py-4">
        <Row className="justify-content-center">
          <Col xs="auto">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
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
            {isEdit ? (
              <><Pencil className="me-2" /> Editar Alumno</>
            ) : (
              <><Person className="me-2" /> Nuevo Alumno</>
            )}
          </h1>
          <p className="text-muted">
            {isEdit 
              ? 'Modificar la información del alumno' 
              : 'Agregar un nuevo alumno al sistema'
            }
          </p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Header>
          <Link to="/students" className="btn btn-outline-secondary btn-sm me-2">
            <ArrowLeft className="me-1" />
            Volver
          </Link>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Guardando...
              </>
            ) : (
              <>
                <Save className="me-2" />
                {isEdit ? 'Actualizar' : 'Guardar'} Alumno
              </>
            )}
          </Button>
        </Card.Header>
        <Card.Body>
          <div className="form-body">
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-4"
            >
              {/* Pestaña de Datos Personales */}
              <Tab eventKey="personal" title="Datos Personales">
                <Row>
                  <Col md={6}>
                    <Form.Group className="form-group mb-3">
                      <Form.Label className="form-label">Nombre(s) *</Form.Label>
                      <Form.Control
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="form-group mb-3">
                      <Form.Label className="form-label">Segundo Nombre (Opcional)</Form.Label>
                      <Form.Control
                        type="text"
                        name="middle_name_optional"
                        value={formData.middle_name_optional}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="form-group mb-3">
                      <Form.Label className="form-label">Apellido Paterno *</Form.Label>
                      <Form.Control
                        type="text"
                        name="paternal_surname"
                        value={formData.paternal_surname}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="form-group mb-3">
                      <Form.Label className="form-label">Apellido Materno</Form.Label>
                      <Form.Control
                        type="text"
                        name="maternal_surname"
                        value={formData.maternal_surname}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="form-group mb-3">
                      <Form.Label className="form-label">Alias/Nickname</Form.Label>
                      <Form.Control
                        type="text"
                        name="nickname_optional"
                        value={formData.nickname_optional}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="form-group mb-3">
                      <Form.Label className="form-label">DNI *</Form.Label>
                      <Form.Control
                        type="text"
                        name="dni"
                        value={formData.dni}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="form-group mb-3">
                      <Form.Label className="form-label">Fecha de Nacimiento *</Form.Label>
                      <Form.Control
                        type="date"
                        name="birth_date"
                        value={formData.birth_date}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="form-group mb-3">
                      <Form.Label className="form-label">Sala</Form.Label>
                      <Form.Select
                        name="classroom_id"
                        value={formData.classroom_id}
                        onChange={handleChange}
                      >
                        <option value="">Seleccione una sala</option>
                        {classrooms.map(classroom => (
                          <option key={classroom.id} value={classroom.id}>
                            {classroom.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="form-group mb-3">
                      <Form.Label className="form-label">Turno</Form.Label>
                      <Form.Select
                        name="shift"
                        value={formData.shift}
                        onChange={handleChange}
                      >
                        <option value="">Seleccione un turno</option>
                        <option value="mañana">Mañana</option>
                        <option value="tarde">Tarde</option>
                        <option value="mañana y tarde">Mañana y Tarde</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="form-group mb-3">
                      <Form.Label className="form-label">Estado</Form.Label>
                      <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="preinscripto">Preinscripto</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="approved">Aprobado</option>
                        <option value="sorteo">Sorteo</option>
                        <option value="inscripto">Inscripto</option>
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                        <option value="egresado">Egresado</option>
                        <option value="rechazado">Rechazado</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Tab>

              {/* Pestaña de Información Médica */}
              <Tab eventKey="medical" title="Información Médica">
                <Row>
                  <Col md={6}>
                    <Form.Group className="form-group mb-3">
                      <Form.Label className="form-label">Obra Social</Form.Label>
                      <Form.Control
                        type="text"
                        name="health_insurance"
                        value={formData.health_insurance}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="form-group mb-3">
                      <Form.Label className="form-label">Número de Afiliado</Form.Label>
                      <Form.Control
                        type="text"
                        name="affiliate_number"
                        value={formData.affiliate_number}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="form-group mb-3">
                      <Form.Label className="form-label">Alergias</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="form-group mb-3">
                      <Form.Label className="form-label">Medicamentos</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="medications"
                        value={formData.medications}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="form-group mb-3">
                      <Form.Label className="form-label">Tipo de Sangre</Form.Label>
                      <Form.Select
                        name="blood_type"
                        value={formData.blood_type}
                        onChange={handleChange}
                      >
                        <option value="">Seleccione tipo de sangre</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="form-group mb-3">
                      <Form.Label className="form-label">Nombre del Pediatra</Form.Label>
                      <Form.Control
                        type="text"
                        name="pediatrician_name"
                        value={formData.pediatrician_name}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="form-group mb-3">
                      <Form.Label className="form-label">Teléfono del Pediatra</Form.Label>
                      <Form.Control
                        type="text"
                        name="pediatrician_phone"
                        value={formData.pediatrician_phone}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="form-group mb-3">
                      <Form.Label className="form-label">Estado de Vacunación</Form.Label>
                      <Form.Select
                        name="vaccination_status"
                        value={formData.vaccination_status}
                        onChange={handleChange}
                      >
                        <option value="completo">Completo</option>
                        <option value="incompleto">Incompleto</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="no_informado">No Informado</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="form-group mb-3">
                      <Form.Label className="form-label">Observaciones Médicas</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="medical_observations"
                        value={formData.medical_observations}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Tab>

              {/* Pestaña de Autorizaciones */}
              <Tab eventKey="authorizations" title="Autorizaciones">
                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Check
                      type="switch"
                      id="photo_authorization"
                      label="Autorización para fotografía"
                      name="photo_authorization"
                      checked={formData.photo_authorization}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Check
                      type="switch"
                      id="trip_authorization"
                      label="Autorización para excursiones"
                      name="trip_authorization"
                      checked={formData.trip_authorization}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Check
                      type="switch"
                      id="medical_attention_authorization"
                      label="Autorización para atención médica de emergencia"
                      name="medical_attention_authorization"
                      checked={formData.medical_attention_authorization}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Check
                      type="switch"
                      id="has_siblings_in_school"
                      label="Tiene hermanos en el jardín"
                      name="has_siblings_in_school"
                      checked={formData.has_siblings_in_school}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="form-group mb-3">
                      <Form.Label className="form-label">Necesidades Especiales</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="special_needs"
                        value={formData.special_needs}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="form-group mb-3">
                      <Form.Label className="form-label">Observaciones Generales</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="observations"
                        value={formData.observations}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Tab>
            </Tabs>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StudentForm;
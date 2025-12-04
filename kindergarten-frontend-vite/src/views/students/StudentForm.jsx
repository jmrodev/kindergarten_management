import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Save, Person, ShieldCheck } from 'react-bootstrap-icons';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import studentService from '../../api/studentService';
import classroomService from '../../api/classroomService';
import { normalizeName } from '../../utils/apiResponseHandler';
import Button from '../../components/atoms/Button';
import Card from '../../components/atoms/Card';
import Container from '../../components/atoms/Container';
import Input from '../../components/atoms/Input';
import Select from '../../components/atoms/Select';
import TextArea from '../../components/atoms/TextArea';
import Toggle from '../../components/atoms/Toggle';
import { Row, Col } from '../../components/atoms/Grid';

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
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

    // Dirección
    street: '',
    number: '',
    city: '',
    provincia: '',
    postal_code_optional: '',
    address_id: null,

    // Contacto de emergencia
    emergency_contact_full_name: '',
    emergency_contact_relationship: '',
    emergency_contact_priority: 1,
    emergency_contact_phone: '',
    emergency_contact_alternative_phone: '',
    emergency_contact_authorized_pickup: false,
    emergency_contact_id: null,

    // Información escolar
    classroom_id: '',
    shift: '',
    status: 'preinscripto',
    enrollment_date: '',
    withdrawal_date: '',

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
    observations: ''
  });

  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

      setFormData({
        // Datos personales
        first_name: student.first_name || '',
        middle_name_optional: student.middle_name_optional || '',
        third_name_optional: student.third_name_optional || '',
        paternal_surname: student.paternal_surname || '',
        maternal_surname: student.maternal_surname || '',
        nickname_optional: student.nickname_optional || '',
        dni: student.dni || '',
        birth_date: student.birth_date || '',

        // Dirección
        street: student.address?.street || '',
        number: student.address?.number || '',
        city: student.address?.city || '',
        provincia: student.address?.provincia || '',
        postal_code_optional: student.address?.postal_code_optional || '',
        address_id: student.address_id || null,

        // Contacto de emergencia
        emergency_contact_full_name: student.emergency_contact?.full_name || '',
        emergency_contact_relationship: student.emergency_contact?.relationship || '',
        emergency_contact_priority: student.emergency_contact?.priority || 1,
        emergency_contact_phone: student.emergency_contact?.phone || '',
        emergency_contact_alternative_phone: student.emergency_contact?.alternative_phone || '',
        emergency_contact_authorized_pickup: student.emergency_contact?.is_authorized_pickup || false,
        emergency_contact_id: student.emergency_contact_id || null,

        // Información escolar
        classroom_id: student.classroom_id || '',
        shift: student.shift || '',
        status: student.status || 'preinscripto',
        enrollment_date: student.enrollment_date || '',
        withdrawal_date: student.withdrawal_date || '',

        // Información médica
        health_insurance: student.health_insurance || '',
        affiliate_number: student.affiliate_number || '',
        allergies: student.allergies || '',
        medications: student.medications || '',
        medical_observations: student.medical_observations || '',
        blood_type: student.blood_type || '',
        pediatrician_name: student.pediatrician_name || '',
        pediatrician_phone: student.pediatrician_phone || '',

        // Autorizaciones
        photo_authorization: student.photo_authorization || false,
        trip_authorization: student.trip_authorization || false,
        medical_attention_authorization: student.medical_attention_authorization || false,

        // Información adicional
        has_siblings_in_school: student.has_siblings_in_school || false,
        special_needs: student.special_needs || '',
        vaccination_status: student.vaccination_status || 'no_informado',
        observations: student.observations || ''
      });
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
  }, [isEdit, fetchStudentData, fetchClassrooms]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Normalizamos los nombres
      const normalizedData = {
        ...formData,
        first_name: normalizeName(formData.first_name),
        middle_name_optional: normalizeName(formData.middle_name_optional),
        third_name_optional: normalizeName(formData.third_name_optional),
        paternal_surname: normalizeName(formData.paternal_surname),
        maternal_surname: normalizeName(formData.maternal_surname),
        nickname_optional: normalizeName(formData.nickname_optional)
      };

      if (isEdit) {
        await studentService.update(id, normalizedData);
      } else {
        await studentService.create(normalizedData);
      }

      navigate('/students');
    } catch (err) {
      setError('Error al guardar los datos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/students');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>
            <Person className="me-2" />
            {isEdit ? 'Editar Alumno' : 'Crear Nuevo Alumno'}
          </h2>
          <p className="text-muted">
            {isEdit ? 'Modifique los datos del alumno' : 'Complete la información del nuevo alumno'}
          </p>
        </div>
        <Link to="/students" className="btn btn-outline-secondary">
          <ArrowLeft className="me-2" />
          Volver a la lista
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <Card>
        <Card.Body>
          <form onSubmit={handleSubmit}>
            {/* Datos Personales */}
            <fieldset className="mb-4">
              <legend className="h5 mb-3">Datos Personales</legend>
              <Row>
                <Col md={6}>
                  <Input
                    label="Nombre"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    normalize
                    required
                  />
                </Col>
                <Col md={6}>
                  <Input
                    label="Segundo Nombre (Opcional)"
                    name="middle_name_optional"
                    value={formData.middle_name_optional}
                    onChange={handleChange}
                    normalize
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Input
                    label="Tercer Nombre (Opcional)"
                    name="third_name_optional"
                    value={formData.third_name_optional}
                    onChange={handleChange}
                    normalize
                  />
                </Col>
                <Col md={6}>
                  <Input
                    label="Apellido Paterno"
                    name="paternal_surname"
                    value={formData.paternal_surname}
                    onChange={handleChange}
                    normalize
                    required
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Input
                    label="Apellido Materno (Opcional)"
                    name="maternal_surname"
                    value={formData.maternal_surname}
                    onChange={handleChange}
                    normalize
                  />
                </Col>
                <Col md={6}>
                  <Input
                    label="Apodo (Opcional)"
                    name="nickname_optional"
                    value={formData.nickname_optional}
                    onChange={handleChange}
                    normalize
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Input
                    label="DNI"
                    name="dni"
                    value={formData.dni}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col md={6}>
                  <Input
                    label="Fecha de Nacimiento"
                    name="birth_date"
                    type="date"
                    value={formData.birth_date}
                    onChange={handleChange}
                    required
                  />
                </Col>
              </Row>
            </fieldset>

            {/* Dirección */}
            <fieldset className="mb-4">
              <legend className="h5 mb-3">Dirección</legend>
              <Row>
                <Col md={6}>
                  <Input
                    label="Calle"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    normalize
                  />
                </Col>
                <Col md={6}>
                  <Input
                    label="Número"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Input
                    label="Ciudad"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    normalize
                  />
                </Col>
                <Col md={6}>
                  <Input
                    label="Provincia"
                    name="provincia"
                    value={formData.provincia}
                    onChange={handleChange}
                    normalize
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Input
                    label="Código Postal (Opcional)"
                    name="postal_code_optional"
                    value={formData.postal_code_optional}
                    onChange={handleChange}
                  />
                </Col>
                <Col md={6}></Col>
              </Row>
            </fieldset>

            {/* Información Escolar */}
            <fieldset className="mb-4">
              <legend className="h5 mb-3">Información Escolar</legend>
              <Row>
                <Col md={6}>
                  <Select
                    label="Sala"
                    name="classroom_id"
                    value={formData.classroom_id}
                    onChange={handleChange}
                    options={[
                      { value: '', label: 'Seleccione una sala' },
                      ...classrooms.map(room => ({
                        value: room.id,
                        label: room.name
                      }))
                    ]}
                  />
                </Col>
                <Col md={6}>
                  <Input
                    label="Turno"
                    name="shift"
                    value={formData.shift}
                    onChange={handleChange}
                    normalize
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Select
                    label="Estado"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    options={[
                      { value: 'preinscripto', label: 'Preinscripto' },
                      { value: 'activo', label: 'Activo' },
                      { value: 'inscripto', label: 'Inscripto' },
                      { value: 'egresado', label: 'Egresado' },
                      { value: 'rechazado', label: 'Rechazado' },
                      { value: 'inactivo', label: 'Inactivo' }
                    ]}
                  />
                </Col>
                <Col md={6}>
                  <Select
                    label="Estado de Vacunas"
                    name="vaccination_status"
                    value={formData.vaccination_status}
                    onChange={handleChange}
                    options={[
                      { value: 'completo', label: 'Completo' },
                      { value: 'incompleto', label: 'Incompleto' },
                      { value: 'pendiente', label: 'Pendiente' },
                      { value: 'no_informado', label: 'No informado' }
                    ]}
                  />
                </Col>
              </Row>
            </fieldset>

            {/* Información Médica */}
            <fieldset className="mb-4">
              <legend className="h5 mb-3">Información Médica</legend>
              <Row>
                <Col md={6}>
                  <Input
                    label="Obra Social"
                    name="health_insurance"
                    value={formData.health_insurance}
                    onChange={handleChange}
                    normalize
                  />
                </Col>
                <Col md={6}>
                  <Input
                    label="Número de Afiliado"
                    name="affiliate_number"
                    value={formData.affiliate_number}
                    onChange={handleChange}
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Input
                    label="Alergias"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                  />
                </Col>
                <Col md={6}>
                  <Input
                    label="Medicamentos"
                    name="medications"
                    value={formData.medications}
                    onChange={handleChange}
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Input
                    label="Tipo de Sangre"
                    name="blood_type"
                    value={formData.blood_type}
                    onChange={handleChange}
                  />
                </Col>
                <Col md={6}>
                  <Input
                    label="Pediatra"
                    name="pediatrician_name"
                    value={formData.pediatrician_name}
                    onChange={handleChange}
                    normalize
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Input
                    label="Teléfono Pediatra"
                    name="pediatrician_phone"
                    value={formData.pediatrician_phone}
                    onChange={handleChange}
                  />
                </Col>
                <Col md={6}></Col>
              </Row>

              <Row>
                <Col md={12}>
                  <TextArea
                    label="Observaciones Médicas"
                    name="medical_observations"
                    value={formData.medical_observations}
                    onChange={handleChange}
                    rows={3}
                  />
                </Col>
              </Row>
            </fieldset>

            {/* Autorizaciones */}
            <fieldset className="mb-4">
              <legend className="h5 mb-3">Autorizaciones</legend>
              <Row>
                <Col md={4}>
                  <Toggle
                    label="Autorización de fotografías"
                    name="photo_authorization"
                    checked={formData.photo_authorization}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      photo_authorization: e.target.checked
                    }))}
                  />
                </Col>
                <Col md={4}>
                  <Toggle
                    label="Autorización de salidas"
                    name="trip_authorization"
                    checked={formData.trip_authorization}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      trip_authorization: e.target.checked
                    }))}
                  />
                </Col>
                <Col md={4}>
                  <Toggle
                    label="Autorización atención médica"
                    name="medical_attention_authorization"
                    checked={formData.medical_attention_authorization}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      medical_attention_authorization: e.target.checked
                    }))}
                  />
                </Col>
              </Row>
            </fieldset>

            {/* Información Adicional */}
            <fieldset className="mb-4">
              <legend className="h5 mb-3">Información Adicional</legend>
              <Row>
                <Col md={4}>
                  <Toggle
                    label="Tiene hermanos en la escuela"
                    name="has_siblings_in_school"
                    checked={formData.has_siblings_in_school}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      has_siblings_in_school: e.target.checked
                    }))}
                  />
                </Col>
                <Col md={4}>
                  <Input
                    label="Necesidades Especiales"
                    name="special_needs"
                    value={formData.special_needs}
                    onChange={handleChange}
                  />
                </Col>
                <Col md={4}>
                  <Input
                    label="Fecha de Inscripción"
                    name="enrollment_date"
                    type="date"
                    value={formData.enrollment_date}
                    onChange={handleChange}
                  />
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <TextArea
                    label="Observaciones Generales"
                    name="observations"
                    value={formData.observations}
                    onChange={handleChange}
                    rows={3}
                  />
                </Col>
              </Row>
            </fieldset>

            {/* Botones de acción */}
            <div className="d-flex gap-2">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={handleCancel}
                disabled={loading}
              >
                <ArrowLeft className="me-2" />
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    {isEdit ? 'Actualizando...' : 'Creando...'}
                  </>
                ) : (
                  <>
                    <Save className="me-2" />
                    {isEdit ? 'Actualizar Alumno' : 'Crear Alumno'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StudentForm;
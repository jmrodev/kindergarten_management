import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Person, Pencil, ShieldCheck } from 'react-bootstrap-icons';
import { normalizeName } from '../utils/apiResponseHandler.js';
import { StudentFormValidator } from '../utils/formValidation.js';
import api from '../api/api.js';
import parentService from '../api/parentService.js';

// Reutilizando componentes atómicos del formulario de estudiantes
import ContainerAtom from '../components/atoms/Container.jsx';
import { Row as RowAtom, Col as ColAtom } from '../components/atoms/Grid.jsx';
import CardAtom from '../components/atoms/Card.jsx';
import ButtonAtom from '../components/atoms/Button.jsx';
import Input from '../components/atoms/Input.jsx';
import Select from '../components/atoms/Select.jsx';
import TextArea from '../components/atoms/TextArea.jsx';
import Toggle from '../components/atoms/Toggle.jsx';
import FormSection from '../components/atoms/FormSection.jsx';

const RegisterChildForm = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

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

    // Contacto de emergencia
    emergency_contact_full_name: '',
    emergency_contact_relationship: '',
    emergency_contact_priority: 1,
    emergency_contact_phone: '',
    emergency_contact_alternative_phone: '',
    emergency_contact_authorized_pickup: false,

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

    // Estado predeterminado para inscripción
    status: 'preinscripto',
    enrollment_date: new Date().toISOString().split('T')[0]
  });

  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('personal');
  const [draftSaved, setDraftSaved] = useState(false);

  // Cargar salas disponibles
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await api.get('/classrooms');
        setClassrooms(response.data.data || []);
      } catch (err) {
        console.error('Error al cargar las salas:', err);
      }
    };

    fetchClassrooms();
  }, []);

  // Cargar borrador si existe
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const response = await parentService.getDraft(currentUser.id);
        if (response.data.data && response.data.data.form_data) {
          setFormData({
            ...formData,
            ...response.data.data.form_data
          });
        }
      } catch (err) {
        // No hay borrador guardado, continuar con formulario vacío
      }
    };

    if (currentUser) {
      loadDraft();
    }
  }, [currentUser, formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpiar error cuando se cambia el campo
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Guardar borrador automáticamente
    saveDraft({ [name]: type === 'checkbox' ? checked : value });
  };

  const saveDraft = async (partialData = {}) => {
    if (!currentUser) return;

    try {
      const draftData = { ...formData, ...partialData };
      await parentService.saveDraft({
        user_id: currentUser.id,
        form_data: draftData
      });
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 3000); // Mensaje de borrador guardado desaparece después de 3 segundos
    } catch (err) {
      console.error('Error guardando borrador:', err);
    }
  };

  const validateForm = () => {
    const validationErrors = StudentFormValidator.validateStudent(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Preparar datos del alumno
      const studentData = {
        ...formData,
        emergency_contact: {
          full_name: formData.emergency_contact_full_name,
          relationship: formData.emergency_contact_relationship,
          priority: formData.emergency_contact_priority,
          phone: formData.emergency_contact_phone,
          alternative_phone: formData.emergency_contact_alternative_phone,
          is_authorized_pickup: formData.emergency_contact_authorized_pickup
        },
        // Información del padre responsable
        parent_id: currentUser.id
      };

      // Crear alumno
      const response = await api.post('/students', studentData);
      
      // Crear registro de presentación por parte del padre
      await parentService.submitRegistration({
        user_id: currentUser.id,
        student_id: response.data.data.id
      });

      // Borrar borrador
      await parentService.deleteDraft(currentUser.id);

      // Navegar a la vista de detalles del alumno
      navigate(`/children/${response.data.data.id}`);
    } catch (err) {
      setError('Error al inscribir al alumno: ' + err.message);
      console.error('Error en la inscripción:', err);
    } finally {
      setLoading(false);
    }
  };

  // Opciones para selects
  const shiftOptions = [
    { value: 'mañana', label: 'Mañana' },
    { value: 'tarde', label: 'Tarde' },
    { value: 'mañana y tarde', label: 'Mañana y Tarde' }
  ];

  const bloodTypeOptions = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' }
  ];

  const vaccinationStatusOptions = [
    { value: 'completo', label: 'Completo' },
    { value: 'incompleto', label: 'Incompleto' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'no_informado', label: 'No Informado' }
  ];

  return (
    <ContainerAtom fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h3 mb-0">
            <Pencil className="me-2" /> Inscripción de Nuevo Hijo
          </h1>
          <p className="text-muted">Complete la información del alumno para iniciar el proceso de inscripción</p>
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      {draftSaved && (
        <Row className="mb-4">
          <Col>
            <Alert variant="success">
              <ShieldCheck className="me-2" />
              Borrador guardado automáticamente
            </Alert>
          </Col>
        </Row>
      )}

      <CardAtom>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <Button
              variant="outline-secondary"
              onClick={() => navigate('/parent-dashboard')}
              className="me-2"
            >
              <ArrowLeft className="me-1" />
              Volver al panel
            </Button>
            <div className="text-muted">
              <ShieldCheck className="me-1" />
              Borrador guardado automáticamente
            </div>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Procesando...
                </>
              ) : (
                <>
                  <Save className="me-2" />
                  Enviar Inscripción
                </>
              )}
            </Button>
          </div>

          <div className="tabs-container">
            <div className="tab-nav">
              <button
                className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
                onClick={() => setActiveTab('personal')}
              >
                Datos Personales
              </button>
              <button
                className={`tab-button ${activeTab === 'medical' ? 'active' : ''}`}
                onClick={() => setActiveTab('medical')}
              >
                Información Médica
              </button>
              <button
                className={`tab-button ${activeTab === 'authorizations' ? 'active' : ''}`}
                onClick={() => setActiveTab('authorizations')}
              >
                Autorizaciones
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'personal' && (
                <FormSection title="Datos Personales" subtitle="Información básica del alumno">
                  <RowAtom>
                    <ColAtom md={6}>
                      <Input
                        label="Nombre(s) *"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        error={errors.first_name?.[0]}
                        normalize
                        required
                      />
                    </ColAtom>
                    <ColAtom md={6}>
                      <Input
                        label="Segundo Nombre (Opcional)"
                        name="middle_name_optional"
                        value={formData.middle_name_optional}
                        onChange={handleChange}
                        normalize
                      />
                    </ColAtom>
                  </RowAtom>

                  <RowAtom>
                    <ColAtom md={6}>
                      <Input
                        label="Apellido Paterno *"
                        name="paternal_surname"
                        value={formData.paternal_surname}
                        onChange={handleChange}
                        error={errors.paternal_surname?.[0]}
                        normalize
                        required
                      />
                    </ColAtom>
                    <ColAtom md={6}>
                      <Input
                        label="Apellido Materno"
                        name="maternal_surname"
                        value={formData.maternal_surname}
                        onChange={handleChange}
                        normalize
                      />
                    </ColAtom>
                  </RowAtom>

                  <RowAtom>
                    <ColAtom md={6}>
                      <Input
                        label="Alias/Nickname"
                        name="nickname_optional"
                        value={formData.nickname_optional}
                        onChange={handleChange}
                        normalize
                      />
                    </ColAtom>
                    <ColAtom md={6}>
                      <Input
                        label="DNI *"
                        name="dni"
                        value={formData.dni}
                        onChange={handleChange}
                        error={errors.dni?.[0]}
                        type="text"
                        required
                      />
                    </ColAtom>
                  </RowAtom>

                  <RowAtom>
                    <ColAtom md={6}>
                      <Input
                        label="Fecha de Nacimiento *"
                        name="birth_date"
                        value={formData.birth_date}
                        onChange={handleChange}
                        error={errors.birth_date?.[0]}
                        type="date"
                        required
                      />
                    </ColAtom>
                    <ColAtom md={6}>
                      <Select
                        label="Sala"
                        name="classroom_id"
                        value={formData.classroom_id}
                        onChange={handleChange}
                        options={classrooms.map(classroom => ({
                          value: classroom.id,
                          label: classroom.name
                        }))}
                        placeholder="Seleccione una sala"
                      />
                    </ColAtom>
                  </RowAtom>

                  <RowAtom>
                    <ColAtom md={6}>
                      <Select
                        label="Turno"
                        name="shift"
                        value={formData.shift}
                        onChange={handleChange}
                        options={shiftOptions}
                        placeholder="Seleccione un turno"
                      />
                    </ColAtom>
                  </RowAtom>

                  {/* Información de contacto de emergencia */}
                  <FormSection title="Contacto de Emergencia" subtitle="Información para contacto en caso de emergencia">
                    <RowAtom>
                      <ColAtom md={6}>
                        <Input
                          label="Nombre Completo"
                          name="emergency_contact_full_name"
                          value={formData.emergency_contact_full_name}
                          onChange={handleChange}
                          normalize
                        />
                      </ColAtom>
                      <ColAtom md={6}>
                        <Input
                          label="Relación"
                          name="emergency_contact_relationship"
                          value={formData.emergency_contact_relationship}
                          onChange={handleChange}
                        />
                      </ColAtom>
                    </RowAtom>
                    <RowAtom>
                      <ColAtom md={6}>
                        <Input
                          label="Teléfono"
                          name="emergency_contact_phone"
                          value={formData.emergency_contact_phone}
                          onChange={handleChange}
                          error={errors.emergency_contact_phone?.[0]}
                          type="tel"
                        />
                      </ColAtom>
                      <ColAtom md={6}>
                        <Input
                          label="Teléfono Alternativo"
                          name="emergency_contact_alternative_phone"
                          value={formData.emergency_contact_alternative_phone}
                          onChange={handleChange}
                          type="tel"
                        />
                      </ColAtom>
                    </RowAtom>
                    <RowAtom>
                      <ColAtom md={12}>
                        <Toggle
                          label="Autorizado para retirar"
                          name="emergency_contact_authorized_pickup"
                          checked={formData.emergency_contact_authorized_pickup}
                          onChange={handleChange}
                        />
                      </ColAtom>
                    </RowAtom>
                  </FormSection>

                  {/* Información de dirección */}
                  <FormSection title="Dirección" subtitle="Información de la dirección del alumno">
                    <RowAtom>
                      <ColAtom md={6}>
                        <Input
                          label="Calle"
                          name="street"
                          value={formData.street}
                          onChange={handleChange}
                        />
                      </ColAtom>
                      <ColAtom md={6}>
                        <Input
                          label="Número"
                          name="number"
                          value={formData.number}
                          onChange={handleChange}
                          type="number"
                        />
                      </ColAtom>
                    </RowAtom>
                    <RowAtom>
                      <ColAtom md={6}>
                        <Input
                          label="Ciudad"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          normalize
                        />
                      </ColAtom>
                      <ColAtom md={6}>
                        <Input
                          label="Provincia"
                          name="provincia"
                          value={formData.provincia}
                          onChange={handleChange}
                          normalize
                        />
                      </ColAtom>
                    </RowAtom>
                    <RowAtom>
                      <ColAtom md={6}>
                        <Input
                          label="Código Postal"
                          name="postal_code_optional"
                          value={formData.postal_code_optional}
                          onChange={handleChange}
                        />
                      </ColAtom>
                    </RowAtom>
                  </FormSection>
                </FormSection>
              )}

              {activeTab === 'medical' && (
                <FormSection title="Información Médica" subtitle="Datos médicos importantes del alumno">
                  <RowAtom>
                    <ColAtom md={6}>
                      <Input
                        label="Obra Social"
                        name="health_insurance"
                        value={formData.health_insurance}
                        onChange={handleChange}
                      />
                    </ColAtom>
                    <ColAtom md={6}>
                      <Input
                        label="Número de Afiliado"
                        name="affiliate_number"
                        value={formData.affiliate_number}
                        onChange={handleChange}
                      />
                    </ColAtom>
                  </RowAtom>

                  <RowAtom>
                    <ColAtom md={12}>
                      <TextArea
                        label="Alergias"
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleChange}
                        rows={2}
                      />
                    </ColAtom>
                  </RowAtom>

                  <RowAtom>
                    <ColAtom md={12}>
                      <TextArea
                        label="Medicamentos"
                        name="medications"
                        value={formData.medications}
                        onChange={handleChange}
                        rows={2}
                      />
                    </ColAtom>
                  </RowAtom>

                  <RowAtom>
                    <ColAtom md={6}>
                      <Select
                        label="Tipo de Sangre"
                        name="blood_type"
                        value={formData.blood_type}
                        onChange={handleChange}
                        options={bloodTypeOptions}
                        placeholder="Seleccione tipo de sangre"
                      />
                    </ColAtom>
                    <ColAtom md={6}>
                      <Input
                        label="Nombre del Pediatra"
                        name="pediatrician_name"
                        value={formData.pediatrician_name}
                        onChange={handleChange}
                        normalize
                      />
                    </ColAtom>
                  </RowAtom>

                  <RowAtom>
                    <ColAtom md={6}>
                      <Input
                        label="Teléfono del Pediatra"
                        name="pediatrician_phone"
                        value={formData.pediatrician_phone}
                        onChange={handleChange}
                        error={errors.pediatrician_phone?.[0]}
                        type="tel"
                      />
                    </ColAtom>
                    <ColAtom md={6}>
                      <Select
                        label="Estado de Vacunación"
                        name="vaccination_status"
                        value={formData.vaccination_status}
                        onChange={handleChange}
                        options={vaccinationStatusOptions}
                        placeholder="Seleccione estado de vacunación"
                      />
                    </ColAtom>
                  </RowAtom>

                  <RowAtom>
                    <ColAtom md={12}>
                      <TextArea
                        label="Observaciones Médicas"
                        name="medical_observations"
                        value={formData.medical_observations}
                        onChange={handleChange}
                        rows={3}
                      />
                    </ColAtom>
                  </RowAtom>
                </FormSection>
              )}

              {activeTab === 'authorizations' && (
                <FormSection title="Autorizaciones" subtitle="Autorizaciones y permisos especiales">
                  <RowAtom className="mb-3">
                    <ColAtom md={12}>
                      <Toggle
                        label="Autorización para fotografía"
                        name="photo_authorization"
                        checked={formData.photo_authorization}
                        onChange={handleChange}
                      />
                    </ColAtom>
                  </RowAtom>

                  <RowAtom className="mb-3">
                    <ColAtom md={12}>
                      <Toggle
                        label="Autorización para excursiones"
                        name="trip_authorization"
                        checked={formData.trip_authorization}
                        onChange={handleChange}
                      />
                    </ColAtom>
                  </RowAtom>

                  <RowAtom className="mb-3">
                    <ColAtom md={12}>
                      <Toggle
                        label="Autorización para atención médica de emergencia"
                        name="medical_attention_authorization"
                        checked={formData.medical_attention_authorization}
                        onChange={handleChange}
                      />
                    </ColAtom>
                  </RowAtom>

                  <RowAtom className="mb-3">
                    <ColAtom md={12}>
                      <Toggle
                        label="Tiene hermanos en el jardín"
                        name="has_siblings_in_school"
                        checked={formData.has_siblings_in_school}
                        onChange={handleChange}
                      />
                    </ColAtom>
                  </RowAtom>

                  <RowAtom>
                    <ColAtom md={12}>
                      <TextArea
                        label="Necesidades Especiales"
                        name="special_needs"
                        value={formData.special_needs}
                        onChange={handleChange}
                        rows={3}
                      />
                    </ColAtom>
                  </RowAtom>

                  <RowAtom>
                    <ColAtom md={12}>
                      <TextArea
                        label="Observaciones Generales"
                        name="observations"
                        value={formData.observations}
                        onChange={handleChange}
                        rows={3}
                      />
                    </ColAtom>
                  </RowAtom>
                </FormSection>
              )}
            </div>
          </div>
        </Card.Body>
      </CardAtom>
    </ContainerAtom>
  );
};

export default RegisterChildForm;
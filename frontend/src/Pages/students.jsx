import { useState, useEffect } from 'react';
import Modal from '../components/Atoms/Modal';
import FormGroup from '../components/Molecules/FormGroup';
import Input from '../components/Atoms/Input';
import Button from '../components/Atoms/Button';
import Loading from '../components/Atoms/Loading';
import ErrorMessage from '../components/Atoms/ErrorMessage';
import useIsMobile from '../hooks/useIsMobile';
import DesktopStudents from '../components/Organisms/DesktopStudents';
import MobileStudents from '../components/Organisms/MobileStudents';
import studentsService from '../services/studentsService';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [formState, setFormState] = useState({
    // Datos personales
    first_name: '',
    middle_name_optional: '',
    third_name_optional: '',
    paternal_surname: '',
    maternal_surname: '',
    nickname_optional: '',
    dni: '',
    birth_date: '',
    status: 'activo',
    // Dirección
    address: {
      street: '',
      number: '',
      city: '',
      provincia: '',
      postal_code_optional: ''
    },
    // Salud
    blood_type: '',
    health_insurance: '',
    allergies: '',
    medications: '',
    special_needs: '',
    medical_observations: '',
    pediatrician_name: '',
    pediatrician_phone: '',
    // Autorizaciones
    photo_authorization: false,
    trip_authorization: false,
    medical_attention_authorization: false,
    // Contacto de emergencia
    emergency_contact: {
      full_name: '',
      relationship: '',
      phone: '',
      alternative_phone: '',
      is_authorized_pickup: false
    }
  });

  // Cargar estudiantes al montar el componente
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await studentsService.getAll();
      // Backend returns { status: 'success', data: [...] }
      setStudents(Array.isArray(response) ? response : (response.data || []));
    } catch (err) {
      console.error('Error loading students:', err);
      setError(err.message || 'Error al cargar estudiantes');
    } finally {
      setLoading(false);
    }
  };

  const normalizeText = (text) => {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u0386]/g, '');
  };

  const filteredStudents = students.filter(student => {
    const fullName = `${student.first_name} ${student.paternal_surname || ''} ${student.maternal_surname || ''}`.toLowerCase();
    return normalizeText(fullName).includes(normalizeText(searchTerm)) ||
      (student.dni && student.dni.includes(searchTerm));
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Manejar campos anidados (address.street, emergency_contact.phone, etc.)
    if (name.includes('.')) {
      const [parent, field] = name.split('.');
      setFormState(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormState(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleEdit = (student) => {
    setCurrentStudent(student);
    setFormState({
      // Datos personales
      first_name: student.first_name || '',
      middle_name_optional: student.middle_name_optional || '',
      third_name_optional: student.third_name_optional || '',
      paternal_surname: student.paternal_surname || '',
      maternal_surname: student.maternal_surname || '',
      nickname_optional: student.nickname_optional || '',
      dni: student.dni || '',
      birth_date: student.birth_date || '',
      status: student.status || 'activo',
      // Dirección
      address: student.address || {
        street: '',
        number: '',
        city: '',
        provincia: '',
        postal_code_optional: ''
      },
      // Salud
      blood_type: student.blood_type || '',
      health_insurance: student.health_insurance || '',
      allergies: student.allergies || '',
      medications: student.medications || '',
      special_needs: student.special_needs || '',
      medical_observations: student.medical_observations || '',
      pediatrician_name: student.pediatrician_name || '',
      pediatrician_phone: student.pediatrician_phone || '',
      // Autorizaciones
      photo_authorization: student.photo_authorization || false,
      trip_authorization: student.trip_authorization || false,
      medical_attention_authorization: student.medical_attention_authorization || false,
      // Contacto de emergencia
      emergency_contact: student.emergency_contact || {
        full_name: '',
        relationship: '',
        phone: '',
        alternative_phone: '',
        is_authorized_pickup: false
      }
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (currentStudent) {
        // Actualizar estudiante existente
        await studentsService.update(currentStudent.id, formState);
      } else {
        // Crear nuevo estudiante
        await studentsService.create(formState);
      }
      // Recargar lista
      await loadStudents();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving student:', err);
      setError(err.message || 'Error al guardar estudiante');
    }
  };

  const handleAdd = () => {
    setCurrentStudent(null);
    setFormState({
      // Datos personales
      first_name: '',
      middle_name_optional: '',
      third_name_optional: '',
      paternal_surname: '',
      maternal_surname: '',
      nickname_optional: '',
      dni: '',
      birth_date: '',
      status: 'activo',
      // Dirección
      address: {
        street: '',
        number: '',
        city: '',
        provincia: '',
        postal_code_optional: ''
      },
      // Salud
      blood_type: '',
      health_insurance: '',
      allergies: '',
      medications: '',
      special_needs: '',
      medical_observations: '',
      pediatrician_name: '',
      pediatrician_phone: '',
      // Autorizaciones
      photo_authorization: false,
      trip_authorization: false,
      medical_attention_authorization: false,
      // Contacto de emergencia
      emergency_contact: {
        full_name: '',
        relationship: '',
        phone: '',
        alternative_phone: '',
        is_authorized_pickup: false
      }
    });
    setIsModalOpen(true);
  };

  const isMobile = useIsMobile();

  const handleDelete = async (studentId) => {
    if (!window.confirm('¿Está seguro de eliminar este estudiante?')) return;

    try {
      await studentsService.delete(studentId);
      // Recargar lista
      await loadStudents();
    } catch (err) {
      console.error('Error deleting student:', err);
      setError(err.message || 'Error al eliminar estudiante');
    }
  };

  if (loading) return <Loading message="Cargando estudiantes..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadStudents} />;



  return (
    <>
      {isMobile ? (
        <MobileStudents
          students={filteredStudents}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      ) : (
        <DesktopStudents
          students={filteredStudents}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentStudent ? "Editar Estudiante" : "Agregar Estudiante"}
      >
        <div style={{ maxHeight: '70vh', overflowY: 'auto', padding: '0 10px' }}>

          {/* DATOS PERSONALES */}
          <h3 style={{ marginTop: '20px', marginBottom: '10px', color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '5px' }}>
            Datos Personales
          </h3>
          <FormGroup>
            <Input
              label="Nombre *"
              name="first_name"
              value={formState.first_name}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Input
              label="Segundo Nombre"
              name="middle_name_optional"
              value={formState.middle_name_optional}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Input
              label="Tercer Nombre"
              name="third_name_optional"
              value={formState.third_name_optional}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Input
              label="Apellido Paterno *"
              name="paternal_surname"
              value={formState.paternal_surname}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Input
              label="Apellido Materno"
              name="maternal_surname"
              value={formState.maternal_surname}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Input
              label="Apodo"
              name="nickname_optional"
              value={formState.nickname_optional}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Input
              label="DNI *"
              name="dni"
              value={formState.dni}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Input
              label="Fecha de Nacimiento *"
              name="birth_date"
              type="date"
              value={formState.birth_date}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <label>Estado</label>
            <select
              name="status"
              value={formState.status}
              onChange={handleChange}
              className="select-field"
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
            </select>
          </FormGroup>

          {/* DIRECCIÓN */}
          <h3 style={{ marginTop: '20px', marginBottom: '10px', color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '5px' }}>
            Dirección
          </h3>
          <FormGroup>
            <Input
              label="Calle"
              name="address.street"
              value={formState.address.street}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Input
              label="Número"
              name="address.number"
              value={formState.address.number}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Input
              label="Ciudad"
              name="address.city"
              value={formState.address.city}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Input
              label="Provincia"
              name="address.provincia"
              value={formState.address.provincia}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Input
              label="Código Postal"
              name="address.postal_code_optional"
              value={formState.address.postal_code_optional}
              onChange={handleChange}
            />
          </FormGroup>

          {/* SALUD */}
          <h3 style={{ marginTop: '20px', marginBottom: '10px', color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '5px' }}>
            Información de Salud
          </h3>
          <FormGroup>
            <Input
              label="Grupo Sanguíneo"
              name="blood_type"
              value={formState.blood_type}
              onChange={handleChange}
              placeholder="ej: O+, A-, B+"
            />
          </FormGroup>
          <FormGroup>
            <Input
              label="Obra Social"
              name="health_insurance"
              value={formState.health_insurance}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <label>Alergias</label>
            <textarea
              name="allergies"
              value={formState.allergies}
              onChange={handleChange}
              className="input-field"
              rows="2"
              placeholder="Detalle de alergias conocidas"
            />
          </FormGroup>
          <FormGroup>
            <label>Medicamentos</label>
            <textarea
              name="medications"
              value={formState.medications}
              onChange={handleChange}
              className="input-field"
              rows="2"
              placeholder="Medicamentos que toma regularmente"
            />
          </FormGroup>
          <FormGroup>
            <label>Necesidades Especiales</label>
            <textarea
              name="special_needs"
              value={formState.special_needs}
              onChange={handleChange}
              className="input-field"
              rows="2"
              placeholder="Necesidades especiales o condiciones médicas"
            />
          </FormGroup>
          <FormGroup>
            <label>Observaciones Médicas</label>
            <textarea
              name="medical_observations"
              value={formState.medical_observations}
              onChange={handleChange}
              className="input-field"
              rows="2"
              placeholder="Cualquier otra observación médica relevante"
            />
          </FormGroup>
          <FormGroup>
            <Input
              label="Nombre del Pediatra"
              name="pediatrician_name"
              value={formState.pediatrician_name}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Input
              label="Teléfono del Pediatra"
              name="pediatrician_phone"
              value={formState.pediatrician_phone}
              onChange={handleChange}
            />
          </FormGroup>

          {/* AUTORIZACIONES */}
          <h3 style={{ marginTop: '20px', marginBottom: '10px', color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '5px' }}>
            Autorizaciones
          </h3>
          <FormGroup>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                name="photo_authorization"
                checked={formState.photo_authorization}
                onChange={handleChange}
              />
              Autorización de Fotos
            </label>
          </FormGroup>
          <FormGroup>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                name="trip_authorization"
                checked={formState.trip_authorization}
                onChange={handleChange}
              />
              Autorización de Viajes/Salidas
            </label>
          </FormGroup>
          <FormGroup>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                name="medical_attention_authorization"
                checked={formState.medical_attention_authorization}
                onChange={handleChange}
              />
              Autorización de Atención Médica
            </label>
          </FormGroup>

          {/* CONTACTO DE EMERGENCIA */}
          <h3 style={{ marginTop: '20px', marginBottom: '10px', color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '5px' }}>
            Contacto de Emergencia
          </h3>
          <FormGroup>
            <Input
              label="Nombre Completo"
              name="emergency_contact.full_name"
              value={formState.emergency_contact.full_name}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <label>Relación</label>
            <select
              name="emergency_contact.relationship"
              value={formState.emergency_contact.relationship}
              onChange={handleChange}
              className="select-field"
            >
              <option value="">Seleccionar...</option>
              <option value="madre">Madre</option>
              <option value="padre">Padre</option>
              <option value="tutor">Tutor</option>
              <option value="abuelo">Abuelo</option>
              <option value="abuela">Abuela</option>
              <option value="tio">Tío</option>
              <option value="tia">Tía</option>
              <option value="otro">Otro</option>
            </select>
          </FormGroup>
          <FormGroup>
            <Input
              label="Teléfono"
              name="emergency_contact.phone"
              value={formState.emergency_contact.phone}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Input
              label="Teléfono Alternativo"
              name="emergency_contact.alternative_phone"
              value={formState.emergency_contact.alternative_phone}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                name="emergency_contact.is_authorized_pickup"
                checked={formState.emergency_contact.is_authorized_pickup}
                onChange={handleChange}
              />
              Autorizado para retirar al estudiante
            </label>
          </FormGroup>
        </div>

        <div className="modal-footer">
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave}>Guardar</Button>
        </div>
      </Modal>
    </>
  );
};

export default Students;

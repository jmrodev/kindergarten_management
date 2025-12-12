import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash } from 'react-bootstrap-icons';
import Card from '../../components/atoms/Card';
import Button from '../../components/atoms/Button';
import OfficeRibbonWithTitle from '../../components/organisms/OfficeRibbonWithTitle';
import ConfirmationModal from '../../components/molecules/ConfirmationModal';
import { studentService } from '../../api/studentService';
import { normalizeName } from '../../utils/apiResponseHandler';

const StudentDetailsView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchStudent();
    }
  }, [id]);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const data = await studentService.getById(id);
      setStudent(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos del alumno');
      console.error('Error fetching student:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/students/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await studentService.delete(id);
      setShowDeleteModal(false);
      navigate('/students');
    } catch (err) {
      setError('Error al eliminar el alumno');
      console.error('Error deleting student:', err);
    }
  };

  const handleGoBack = () => {
    navigate('/students');
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-h-200">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error && !student) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (!student) {
    return <div>Alumno no encontrado</div>;
  }

  const menuItems = [
    {
      label: 'Editar Alumno',
      icon: <Pencil size={16} />,
      onClick: handleEdit
    },
    {
      label: 'Eliminar Alumno',
      icon: <Trash size={16} />,
      onClick: handleDeleteClick
    }
  ];

  const renderContactSection = (title, contacts, contactType) => {
    if (!contacts || contacts.length === 0) return null;

    return (
      <div className="contact-section mt-4">
        <h5>{title}</h5>
        <div className="contacts-grid">
          {contacts.map((contact, index) => (
            <div key={`${contactType}-${index}`} className="contact-item">
              <div className="contact-info">
                <div className="contact-name">
                  <strong>{normalizeName(contact.full_name || contact.name || contact.first_name)}</strong>
                </div>
                <div className="contact-details">
                  {contact.phone && (
                    <div className="contact-phone">
                      <span className="contact-label">Teléfono:</span>
                      <a
                        href={`https://wa.me/${contact.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whatsapp-link"
                        title="Enviar mensaje por WhatsApp"
                      >
                        {contact.phone}
                      </a>
                    </div>
                  )}
                  {contact.relationship && (
                    <div className="contact-relationship">
                      <span className="contact-label">Relación:</span>
                      <span>{contact.relationship}</span>
                    </div>
                  )}
                  {contact.relationship_type && (
                    <div className="contact-relationship">
                      <span className="contact-label">Relación:</span>
                      <span>{contact.relationship_type}</span>
                    </div>
                  )}
                  {contact.priority && (
                    <div className="contact-priority">
                      <span className="contact-label">Prioridad:</span>
                      <span>{contact.priority}</span>
                    </div>
                  )}
                  {contact.is_authorized_pickup !== undefined && (
                    <div className="contact-authorization">
                      <span className="contact-label">Autorizado a retirar:</span>
                      <span>{contact.is_authorized_pickup ? 'Sí' : 'No'}</span>
                    </div>
                  )}
                  {contact.authorized_pickup !== undefined && (
                    <div className="contact-authorization">
                      <span className="contact-label">Autorizado a retirar:</span>
                      <span>{contact.authorized_pickup ? 'Sí' : 'No'}</span>
                    </div>
                  )}
                  {contact.authorized_diaper_change !== undefined && (
                    <div className="contact-authorization">
                      <span className="contact-label">Autorizado cambio pañales:</span>
                      <span>{contact.authorized_diaper_change ? 'Sí' : 'No'}</span>
                    </div>
                  )}
                  {contact.custody_rights !== undefined && (
                    <div className="contact-authorization">
                      <span className="contact-label">Derechos de custodia:</span>
                      <span>{contact.custody_rights ? 'Sí' : 'No'}</span>
                    </div>
                  )}
                  {contact.financial_responsible !== undefined && (
                    <div className="contact-authorization">
                      <span className="contact-label">Responsable financiero:</span>
                      <span>{contact.financial_responsible ? 'Sí' : 'No'}</span>
                    </div>
                  )}
                  {contact.is_primary !== undefined && (
                    <div className="contact-authorization">
                      <span className="contact-label">Responsable primario:</span>
                      <span>{contact.is_primary ? 'Sí' : 'No'}</span>
                    </div>
                  )}
                  {contact.type && (
                    <div className="contact-type">
                      <span className="contact-label">Tipo:</span>
                      <span>{contact.type}</span>
                    </div>
                  )}
                  {contact.notes && (
                    <div className="contact-notes">
                      <span className="contact-label">Notas:</span>
                      <span>{contact.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="student-details-container">
      <OfficeRibbonWithTitle
        title={`Alumno: ${normalizeName(student.first_name)} ${normalizeName(student.paternal_surname)}`}
        menuItems={menuItems}
        backPath="/students"
      />

      <div className="main-content-with-ribbon">
        <Card>
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
              <h3>Detalle del Alumno</h3>
              <div className="d-flex gap-2">
                <Button 
                  variant="secondary" 
                  onClick={handleGoBack}
                >
                  <ArrowLeft size={16} className="me-2" />
                  Volver
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleEdit}
                >
                  <Pencil size={16} className="me-2" />
                  Editar
                </Button>
                <Button 
                  variant="danger" 
                  onClick={handleDeleteClick}
                >
                  <Trash size={16} className="me-2" />
                  Eliminar
                </Button>
              </div>
            </div>
          </Card.Header>
          
          <Card.Body>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <div className="student-details-grid">
              <div className="detail-item">
                <label>DNI:</label>
                <span>{student.dni}</span>
              </div>

              <div className="detail-item">
                <label>Fecha de Nacimiento:</label>
                <span>{student.birth_date ? new Date(student.birth_date).toLocaleDateString() : '-'}</span>
              </div>

              <div className="detail-item">
                <label>Sala:</label>
                <span>{student.classroom_name || 'Sin sala'}</span>
              </div>

              <div className="detail-item">
                <label>Turno:</label>
                <span>{student.shift || 'Sin turno'}</span>
              </div>

              <div className="detail-item">
                <label>Estado:</label>
                <span className={`badge bg-${getStatusVariant(student.status)}`}>
                  {getStatusDisplay(student.status)}
                </span>
              </div>

              <div className="detail-item">
                <label>Seguro de Salud:</label>
                <span>{student.health_insurance || '-'}</span>
              </div>

              <div className="detail-item">
                <label>Estado de Vacunas:</label>
                <span>{student.vaccination_status || 'No informado'}</span>
              </div>

              <div className="detail-item">
                <label>Alergias:</label>
                <span>{student.allergies || '-'}</span>
              </div>

              <div className="detail-item">
                <label>Medicamentos:</label>
                <span>{student.medications || '-'}</span>
              </div>

              <div className="detail-item">
                <label>Observaciones Médicas:</label>
                <span>{student.medical_observations || '-'}</span>
              </div>

              <div className="detail-item">
                <label>Observaciones Generales:</label>
                <span>{student.observations || '-'}</span>
              </div>

              <div className="detail-item">
                <label>Fecha de Inscripción:</label>
                <span>{student.enrollment_date ? new Date(student.enrollment_date).toLocaleDateString() : '-'}</span>
              </div>

              <div className="detail-item">
                <label>Autorización de Foto:</label>
                <span>{student.photo_authorization ? 'Sí' : 'No'}</span>
              </div>

              <div className="detail-item">
                <label>Autorización de Salida:</label>
                <span>{student.trip_authorization ? 'Sí' : 'No'}</span>
              </div>

              <div className="detail-item">
                <label>Autorización de Atención Médica:</label>
                <span>{student.medical_attention_authorization ? 'Sí' : 'No'}</span>
              </div>

              <div className="detail-item">
                <label>Tiene Hermanos en la Escuela:</label>
                <span>{student.has_siblings_in_school ? 'Sí' : 'No'}</span>
              </div>

              <div className="detail-item">
                <label>Necesidades Especiales:</label>
                <span>{student.special_needs || '-'}</span>
              </div>

              {/* Emergency Contact Information */}
              {(student.emergency_contact_name || student.emergency_contact_phone) && (
                <div className="detail-item">
                  <label>Contacto de Emergencia:</label>
                  <div className="emergency-contact-info">
                    {student.emergency_contact_name && (
                      <div>Nombre: {normalizeName(student.emergency_contact_name)}</div>
                    )}
                    {student.emergency_contact_phone && (
                      <div>
                        Teléfono:
                        <a
                          href={`https://wa.me/${student.emergency_contact_phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="whatsapp-link"
                          title="Enviar mensaje por WhatsApp"
                        >
                          {student.emergency_contact_phone}
                        </a>
                      </div>
                    )}
                    {student.emergency_contact_alt_phone && (
                      <div>
                        Teléfono Alternativo:
                        <a
                          href={`https://wa.me/${student.emergency_contact_alt_phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="whatsapp-link"
                          title="Enviar mensaje por WhatsApp"
                        >
                          {student.emergency_contact_alt_phone}
                        </a>
                      </div>
                    )}
                    {student.emergency_contact_authorized_pickup !== undefined && (
                      <div>Autorizado a Retirar: {student.emergency_contact_authorized_pickup ? 'Sí' : 'No'}</div>
                    )}
                    {student.emergency_contact_relationship && (
                      <div>Relación: {student.emergency_contact_relationship}</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Guardians Section */}
            {renderContactSection('Responsables', student.guardians, 'guardian')}

            {/* Emergency Contacts Section */}
            {renderContactSection('Contactos de Emergencia', student.emergencyContacts, 'emergency')}
          </Card.Body>
        </Card>
      </div>

      <ConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Confirmar Eliminación"
        message={`¿Está seguro de que desea eliminar al alumno ${normalizeName(student.first_name)} ${normalizeName(student.paternal_surname)}?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
};

// Helper functions
const getStatusVariant = (status) => {
  switch (status) {
    case 'activo':
      return 'success';
    case 'inactivo':
      return 'secondary';
    case 'preinscripto':
      return 'warning';
    case 'inscripto':
      return 'info';
    case 'egresado':
      return 'dark';
    default:
      return 'light';
  }
};

const getStatusDisplay = (status) => {
  switch (status) {
    case 'activo':
      return 'Activo';
    case 'inactivo':
      return 'Inactivo';
    case 'preinscripto':
      return 'Preinscripto';
    case 'inscripto':
      return 'Inscripto';
    case 'egresado':
      return 'Egresado';
    default:
      return status || 'Sin estado';
  }
};

export default StudentDetailsView;
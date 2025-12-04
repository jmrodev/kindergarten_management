import React from 'react';
import { normalizeName } from '../../utils/apiResponseHandler';

const StudentDetails = ({ student }) => {
  if (!student) return null;

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
    <div className="student-details-modal">
      <div className="student-header mb-3">
        <h4>{normalizeName(student.first_name)} {normalizeName(student.paternal_surname)} {normalizeName(student.maternal_surname)}</h4>
        <p className="text-muted">Detalle del alumno</p>
      </div>

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
          <span>{student.status || 'Sin estado'}</span>
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

      <style jsx>{`
        .student-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .detail-item label {
          font-weight: bold;
          font-size: 0.85rem;
          color: #6c757d;
        }

        .detail-item span {
          font-size: 0.95rem;
        }

        .contact-section {
          width: 100%;
        }

        .contact-section h5 {
          border-bottom: 1px solid #e9ecef;
          padding-bottom: 0.5rem;
          margin-bottom: 1rem;
        }

        .contacts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
        }

        .contact-item {
          border: 1px solid #e9ecef;
          border-radius: 4px;
          padding: 1rem;
          background-color: #f8f9fa;
        }

        .contact-name {
          margin-bottom: 0.5rem;
        }

        .contact-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .contact-label {
          font-weight: bold;
          font-size: 0.85rem;
          color: #6c757d;
          display: inline-block;
          min-width: 140px;
        }

        .contact-details > div {
          display: flex;
          gap: 0.5rem;
        }

        .emergency-contact-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .emergency-contact-info > div {
          padding: 0.125rem 0;
        }

        .whatsapp-link {
          color: #25D366 !important;
          text-decoration: underline;
          font-weight: 500;
        }

        .whatsapp-link:hover {
          color: #128C7E !important;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default StudentDetails;
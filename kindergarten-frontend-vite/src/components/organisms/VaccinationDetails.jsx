import React from 'react';
import { normalizeName } from '../../utils/apiResponseHandler';

const VaccinationDetails = ({ vaccination, student }) => {
  if (!vaccination) return null;

  return (
    <div className="vaccination-details-modal">
      <div className="vaccination-header mb-3">
        <h4>Detalle de Vacuna</h4>
        {student && (
          <p className="text-muted">
            Alumno: {normalizeName(student.first_name)} {normalizeName(student.paternal_surname)}
          </p>
        )}
      </div>
      
      <div className="vaccination-details-grid">
        {student && (
          <div className="detail-item">
            <label>Alumno:</label>
            <span>{normalizeName(student.first_name)} {normalizeName(student.paternal_surname)} {normalizeName(student.maternal_surname)}</span>
          </div>
        )}

        <div className="detail-item">
          <label>Nombre de la Vacuna:</label>
          <span>{vaccination.vaccine_name || '-'}</span>
        </div>

        <div className="detail-item">
          <label>Fecha de Vacunación:</label>
          <span>{vaccination.vaccine_date ? new Date(vaccination.vaccine_date).toLocaleDateString() : '-'}</span>
        </div>

        <div className="detail-item">
          <label>Número de Lote:</label>
          <span>{vaccination.batch_number || '-'}</span>
        </div>

        <div className="detail-item">
          <label>Número de Dosis:</label>
          <span>{vaccination.dose_number || '-'}</span>
        </div>

        <div className="detail-item">
          <label>Próxima Dosis:</label>
          <span>{vaccination.next_due_date ? new Date(vaccination.next_due_date).toLocaleDateString() : '-'}</span>
        </div>

        <div className="detail-item">
          <label>Estado:</label>
          <span>{vaccination.status || '-'}</span>
        </div>

        <div className="detail-item">
          <label>Administrado por:</label>
          <span>{vaccination.administered_by || '-'}</span>
        </div>

        <div className="detail-item">
          <label>Notas:</label>
          <span>{vaccination.notes || '-'}</span>
        </div>
      </div>
      
      <style jsx>{`
        .vaccination-details-grid {
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
      `}</style>
    </div>
  );
};

export default VaccinationDetails;
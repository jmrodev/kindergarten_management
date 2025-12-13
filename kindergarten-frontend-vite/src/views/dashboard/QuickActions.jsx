import React from 'react';
import { FileEarmarkMedical, Calendar, FileEarmarkCheck, PersonCheck } from 'react-bootstrap-icons';

export default function QuickActions({ currentUser }) {
  return (
    <div className="quick-actions-card">
      <div className="card-header">
        <h5>Acciones Rápidas</h5>
      </div>
      <div className="quick-actions-grid">
        {(currentUser?.role === 'Administrator' || currentUser?.role === 'Director' || currentUser?.role === 'Secretary' || currentUser?.role === 'Teacher') && (
          <a href="/attendance" className="quick-action-btn">
            <FileEarmarkMedical size={32} className="icon-block-mb" />
            Registrar Asistencia
          </a>
        )}
        <a href="/calendar" className="quick-action-btn">
          <Calendar size={32} className="icon-block-mb" />
          Calendario
        </a>
        {(currentUser?.role === 'Administrator' || currentUser?.role === 'Director' || currentUser?.role === 'Secretary') && (
          <a href="/document-reviews" className="quick-action-btn">
            <FileEarmarkCheck size={32} className="icon-block-mb" />
            Revisar Documentos
          </a>
        )}
        {currentUser?.parentPortalUser && (
          <a href="/parent-dashboard" className="quick-action-btn">
            <PersonCheck size={32} className="icon-block-mb" />
            Mi Panel
          </a>
        )}
      </div>
    </div>
  );
}

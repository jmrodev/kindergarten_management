import React from 'react';
import { PersonCheck, FileEarmarkMedical, FileEarmarkCheck, JournalText, Calendar } from 'react-bootstrap-icons';
import CardCol from '../../components/atoms/CardCol';

export default function AllStats({ stats, navigate }) {
  return (
    <div className="flex-2-min600">
      <div className="cards-row">
        <CardCol number={stats.totalStudents} icon={PersonCheck} text="Alumnos Totales" extraClass="clickable-card cursor-pointer" onClick={() => navigate('/students')} />
        <CardCol number={stats.activeStudents} icon={PersonCheck} text="Alumnos Activos" variant="active" />
        <CardCol number={stats.vaccinationComplete} icon={FileEarmarkMedical} text="Vacunas Completas" variant="active" />
        <CardCol number={stats.pendingDocuments} icon={FileEarmarkCheck} text="Documentos Pendientes" variant="warning" />

        <CardCol number={stats.preinscriptoStudents} icon={JournalText} text="Preinscriptos" variant="warning" />
        <CardCol number={stats.inscriptoStudents} icon={JournalText} text="Inscriptos" variant="info" />
        <CardCol number={stats.vaccinationIncomplete} icon={FileEarmarkMedical} text="Vacunas Incompletas" variant="danger" />
        <CardCol number={stats.todayEvents} icon={Calendar} text="Eventos Hoy" variant="info" />
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import Card from '../Atoms/Card';
import Text from '../Atoms/Text';
import Button from '../Atoms/Button';

const MobileAttendance = ({
  classrooms,
  students,
  attendanceRecords,
  selectedClassroom,
  setSelectedClassroom,
  selectedDate,
  setSelectedDate,
  onSetStatus,
  onSave,
  hasChanges,
  saving,
  viewMode,
  onToggleViewMode
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isWizardActive, setIsWizardActive] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // Reset wizard when mode changes
  useEffect(() => {
    if (viewMode === 'view') {
      setIsWizardActive(false);
      setShowSummary(false);
    }
  }, [viewMode]);

  // Reset when classroom changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsWizardActive(false);
    setShowSummary(false);
  }, [selectedClassroom]);

  const handleStart = () => {
    setCurrentIndex(0);
    setIsWizardActive(true);
    setShowSummary(false);
  };

  const handleMark = (status) => {
    const student = students[currentIndex];
    if (student) {
      onSetStatus(student.id, status);
      setTimeout(() => {
        if (currentIndex < students.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setShowSummary(true);
        }
      }, 150); // Small delay for feedback
    }
  };

  const handlePrev = () => {
    if (showSummary) {
      setShowSummary(false);
      setCurrentIndex(students.length - 1);
    } else if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const currentStudent = students[currentIndex];

  // Render: Summary/Completion Screen
  if (isWizardActive && showSummary) {
    const presentStudents = students.filter(s => attendanceRecords[s.id] === 'presente');
    const absentStudents = students.filter(s => attendanceRecords[s.id] === 'ausente');
    const pendingStudents = students.filter(s => !attendanceRecords[s.id]);

    const presentCount = presentStudents.length;
    const absentCount = absentStudents.length;
    const pendingCount = pendingStudents.length;

    return (
      <div style={{ padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Text variant="h2" style={{ marginBottom: '1rem', textAlign: 'center' }}>Resumen de Asistencia</Text>

        <Card style={{ padding: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <Text variant="h1" style={{ color: 'green' }}>{presentCount}</Text>
              <Text>Presentes</Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Text variant="h1" style={{ color: 'red' }}>{absentCount}</Text>
              <Text>Ausentes</Text>
            </div>
          </div>
          {pendingCount > 0 && (
            <div style={{ textAlign: 'center', color: 'orange', marginTop: '1rem' }}>
              <Text>{pendingCount} Sin Marcar</Text>
            </div>
          )}
        </Card>

        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', border: '1px solid #eee', borderRadius: '8px', padding: '1rem' }}>
          {/* Pending List First (Warning) */}
          {pendingCount > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <Text style={{ color: '#d97706', fontWeight: 'bold', borderBottom: '1px solid #fcd34d', display: 'block', marginBottom: '0.5rem' }}>⚠ Sin Marcar ({pendingCount})</Text>
              <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                {pendingStudents.map(s => (
                  <li key={s.id} style={{ marginBottom: '0.25rem' }}>{s.paternal_surname} {s.first_name}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Absent List */}
          {absentCount > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <Text style={{ color: '#dc2626', fontWeight: 'bold', borderBottom: '1px solid #fecaca', display: 'block', marginBottom: '0.5rem' }}>Ausentes ({absentCount})</Text>
              <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                {absentStudents.map(s => (
                  <li key={s.id} style={{ marginBottom: '0.25rem' }}>{s.paternal_surname} {s.first_name}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Present List */}
          {presentCount > 0 && (
            <div>
              <Text style={{ color: '#059669', fontWeight: 'bold', borderBottom: '1px solid #a7f3d0', display: 'block', marginBottom: '0.5rem' }}>Presentes ({presentCount})</Text>
              <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                {presentStudents.map(s => (
                  <li key={s.id} style={{ marginBottom: '0.25rem' }}>{s.paternal_surname} {s.first_name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button variant="secondary" onClick={handlePrev} style={{ flex: 1 }}>
            Volver
          </Button>
          <Button variant="primary" onClick={onSave} disabled={saving} style={{ flex: 1 }}>
            {saving ? 'Guardando...' : 'Guardar Todo'}
          </Button>
        </div>
      </div>
    );
  }

  // Render: Wizard Card
  if (isWizardActive && currentStudent) {
    const status = attendanceRecords[currentStudent.id];
    return (
      <div style={{ padding: '1rem', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <Button variant="secondary" size="small" onClick={() => setIsWizardActive(false)}>Salir</Button>
          <Text>{currentIndex + 1} / {students.length}</Text>
        </div>

        <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem', justifyContent: 'center', marginBottom: '1rem' }}>
          <Text variant="h2" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            {currentStudent.paternal_surname} {currentStudent.maternal_surname}
          </Text>
          <Text variant="h3" style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#555' }}>
            {currentStudent.first_name}
          </Text>

          <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <Text variant="small" style={{ color: '#666', display: 'block' }}>DNI: {currentStudent.dni || '-'}</Text>
            {/* Address Display */}
            <Text variant="small" style={{ color: '#666', display: 'block', marginTop: '0.5rem', fontWeight: 'bold' }}>
              📍 {currentStudent.street || ''} {currentStudent.number || ''}, {currentStudent.city || ''}
            </Text>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: 'auto' }}>
            <Button
              variant={status === 'presente' ? 'success' : 'secondary'}
              onClick={() => handleMark('presente')}
              style={{ padding: '1.5rem', fontSize: '1.2rem', backgroundColor: status === 'presente' ? '#10b981' : undefined }}
            >
              PRESENTE
            </Button>
            <Button
              variant={status === 'ausente' ? 'danger' : 'secondary'}
              onClick={() => handleMark('ausente')}
              style={{ padding: '1.5rem', fontSize: '1.2rem', backgroundColor: status === 'ausente' ? '#ef4444' : undefined }}
            >
              AUSENTE
            </Button>
          </div>
        </Card>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="secondary"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            Anterior
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              if (currentIndex < students.length - 1) setCurrentIndex(prev => prev + 1);
              else setShowSummary(true);
            }}
          >
            Siguiente
          </Button>
        </div>
      </div>
    );
  }

  // Render: Initial Selection List (Default View)
  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Text variant="h1" style={{ marginBottom: '0.5rem' }}>Asistencia</Text>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            variant="secondary"
            onClick={onToggleViewMode}
            size="small"
            style={{ flex: 1 }}
          >
            {viewMode === 'register' ? 'Ver Lista' : 'Modo Registro'}
          </Button>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <select
          value={selectedClassroom || ''}
          onChange={(e) => setSelectedClassroom(Number(e.target.value))}
          className="select-field"
          style={{ width: '100%', marginBottom: '0.5rem' }}
        >
          {classrooms.map(room => (
            <option key={room.id} value={room.id}>{room.name}</option>
          ))}
        </select>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="input-field"
          style={{ width: '100%' }}
        />
      </div>

      {viewMode === 'register' ? (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Text style={{ marginBottom: '1rem', display: 'block' }}>{students.length} Estudiantes cargados</Text>
          <Button
            variant="primary"
            onClick={handleStart}
            style={{ width: '100%', padding: '1rem', fontSize: '1.2rem' }}
          >
            COMENZAR TOMA DE ASISTENCIA
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* Simple List View */}
          {students.map(student => {
            const status = attendanceRecords[student.id]; // undefined if no record
            return (
              <Card key={student.id} style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text style={{ fontWeight: 'bold' }}>{student.paternal_surname} {student.first_name}</Text>
                  <Text variant="small" style={{ color: '#666' }}>{student.street} {student.number}</Text>
                </div>
                <div style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  backgroundColor: status === 'presente' ? '#d1fae5' : status === 'ausente' ? '#fee2e2' : '#f3f4f6',
                  color: status === 'presente' ? '#065f46' : status === 'ausente' ? '#991b1b' : '#374151',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {status ? status.toUpperCase() : 'SIN REGISTRO'}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default MobileAttendance;
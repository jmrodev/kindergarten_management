import React from 'react';
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
    onToggleStatus,
    onSave,
    hasChanges,
    saving,
    viewMode,
    onToggleViewMode
}) => {
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
                        {viewMode === 'register' ? 'Ver Registradas' : 'Registrar Nueva'}
                    </Button>
                    {viewMode === 'register' && (
                        <Button 
                            variant="primary" 
                            onClick={onSave}
                            disabled={!hasChanges || saving}
                            size="small"
                            style={{ flex: 1 }}
                        >
                            {saving ? 'Guardando...' : 'Registrar'}
                        </Button>
                    )}
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {students.map(student => {
          const status = attendanceRecords[student.id] || 'ausente';
          const fullName = `${student.first_name} ${student.paternal_surname || ''} ${student.maternal_surname || ''}`.trim();
          return (
            <Card key={student.id} style={{ padding: '1rem' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <Text variant="h3" style={{ marginBottom: '0.25rem' }}>{fullName}</Text>
                <Text variant="small" style={{ color: '#666' }}>DNI: {student.dni || 'N/A'}</Text>
              </div>
              <Button
                variant={status === 'presente' ? 'success' : 'danger'}
                onClick={() => viewMode === 'register' && onToggleStatus(student.id)}
                disabled={viewMode === 'view'}
                style={{ width: '100%', fontSize: '1.1rem', fontWeight: 'bold' }}
              >
                {status === 'presente' ? '✓ Presente' : '✗ Ausente'}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MobileAttendance;
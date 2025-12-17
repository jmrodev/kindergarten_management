import React from 'react';
import Card from '../Atoms/Card';
import Text from '../Atoms/Text';
import Button from '../Atoms/Button';
import Table from '../Atoms/Table';
import TableRow from '../Atoms/TableRow';
import TableCell from '../Atoms/TableCell';
import TableHeader from '../Atoms/TableHeader';
import TableBody from '../Atoms/TableBody';

const DesktopAttendance = ({
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
        <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <Text variant="h1">Asistencia</Text>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button
                        variant="secondary"
                        onClick={onToggleViewMode}
                    >
                        {viewMode === 'register' ? 'Ver Registradas' : 'Registrar Nueva'}
                    </Button>
                    {viewMode === 'register' && (
                        <Button
                            variant="primary"
                            onClick={onSave}
                            disabled={!hasChanges || saving}
                        >
                            {saving ? 'Guardando...' : 'Registrar Asistencia'}
                        </Button>
                    )}
                </div>
            </div>

            <div className="attendance-header">
                <div className="attendance-filters">
                    <select
                        value={selectedClassroom || ''}
                        onChange={(e) => setSelectedClassroom(Number(e.target.value))}
                        className="select-field"
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
                        style={{ maxWidth: '200px', marginLeft: '1rem' }}
                    />
                </div>
            </div>

            <Table striped bordered responsive>
                <TableHeader>
                    <TableRow>
                        <TableCell as="th">Alumno</TableCell>
                        <TableCell as="th">DNI</TableCell>
                        <TableCell as="th">Estado</TableCell>
                        <TableCell as="th">Acción</TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {students.map(student => {
                        const status = attendanceRecords[student.id] || 'ausente';
                        const fullName = `${student.first_name} ${student.paternal_surname || ''} ${student.maternal_surname || ''}`.trim();
                        return (
                            <TableRow key={student.id}>
                                <TableCell>{fullName}</TableCell>
                                <TableCell>{student.dni || 'N/A'}</TableCell>
                                <TableCell>
                                    <span className={`status-badge ${status === 'presente' ? 'status-active' : 'status-inactive'}`}>
                                        {status === 'presente' ? 'Presente' : 'Ausente'}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {viewMode === 'register' ? (
                                        <Button
                                            variant={status === 'presente' ? 'danger' : 'success'}
                                            size="small"
                                            onClick={() => onToggleStatus(student.id)}
                                        >
                                            {status === 'presente' ? 'Marcar Ausente' : 'Marcar Presente'}
                                        </Button>
                                    ) : (
                                        <span style={{ color: '#666', fontSize: '0.9rem' }}>-</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Card>
    );
};

export default DesktopAttendance;

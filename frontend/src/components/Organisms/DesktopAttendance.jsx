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
    attendanceHistory,
    selectedClassroom,
    setSelectedClassroom,
    selectedDate,
    setSelectedDate,
    reportType,
    setReportType,
    onToggleStatus,
    onSave,
    hasChanges,
    saving,
    viewMode,
    onToggleViewMode,

    onOpenDetails,
    onShowHistory // New prop
}) => {

    const renderDatePicker = () => {
        if (reportType === 'yearly') {
            const currentYear = new Date().getFullYear();
            const years = [currentYear - 1, currentYear, currentYear + 1];
            return (
                <select
                    value={selectedDate.substring(0, 4)}
                    onChange={(e) => setSelectedDate(`${e.target.value}-01-01`)}
                    className="select-field"
                    style={{ maxWidth: '120px', marginLeft: '1rem' }}
                >
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
            );
        }
        if (reportType === 'monthly') {
            return (
                <input
                    type="month"
                    value={selectedDate.substring(0, 7)}
                    onChange={(e) => setSelectedDate(`${e.target.value}-01`)}
                    className="input-field"
                    style={{ maxWidth: '200px', marginLeft: '1rem' }}
                />
            );
        }
        return (
            <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input-field"
                style={{ maxWidth: '200px', marginLeft: '1rem' }}
            />
        );
    };

    const renderDailyView = () => {
        // Calculate stats
        const presentCount = students.filter(s => attendanceRecords[s.id] === 'presente').length;
        const absentCount = students.filter(s => attendanceRecords[s.id] === 'ausente').length;
        const unregisteredCount = students.length - presentCount - absentCount;

        const boysPresent = students.filter(s => s.gender === 'M' && attendanceRecords[s.id] === 'presente').length;
        const girlsPresent = students.filter(s => s.gender === 'F' && attendanceRecords[s.id] === 'presente').length;

        const isViewMode = viewMode === 'view';

        return (
            <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ padding: '1rem', backgroundColor: '#d1fae5', borderRadius: '8px', textAlign: 'center', border: '1px solid #10b981' }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#047857' }}>{presentCount}</div>
                        <div style={{ color: '#065f46', fontWeight: '500' }}>Presentes</div>
                    </div>
                    <div style={{ padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '8px', textAlign: 'center', border: '1px solid #ef4444' }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#b91c1c' }}>{absentCount}</div>
                        <div style={{ color: '#991b1b', fontWeight: '500' }}>Ausentes</div>
                    </div>
                    {!isViewMode && (
                        <div style={{ padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '8px', textAlign: 'center', border: '1px solid #9ca3af' }}>
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#4b5563' }}>{unregisteredCount}</div>
                            <div style={{ color: '#374151', fontWeight: '500' }}>Sin Registro</div>
                        </div>
                    )}
                    <div style={{ padding: '1rem', backgroundColor: '#dbeafe', borderRadius: '8px', textAlign: 'center', border: '1px solid #3b82f6' }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e40af' }}>{boysPresent}</div>
                        <div style={{ color: '#1e3a8a', fontWeight: '500' }}>Nenes Presentes</div>
                    </div>
                    <div style={{ padding: '1rem', backgroundColor: '#fce7f3', borderRadius: '8px', textAlign: 'center', border: '1px solid #ec4899' }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#be185d' }}>{girlsPresent}</div>
                        <div style={{ color: '#831843', fontWeight: '500' }}>Nenas Presentes</div>
                    </div>
                </div>

                <Table striped bordered responsive>
                    <TableHeader>
                        <TableRow>
                            <TableCell as="th">Alumno</TableCell>
                            <TableCell as="th">DNI</TableCell>
                            <TableCell as="th">Género</TableCell>
                            <TableCell as="th">Estado</TableCell>
                            {!isViewMode && <TableCell as="th">Acción</TableCell>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.map(student => {
                            const status = attendanceRecords[student.id];
                            const fullName = `${student.first_name} ${student.paternal_surname || ''} ${student.maternal_surname || ''}`.trim();

                            // Map generic status to display
                            let statusLabel = 'Sin Registro';
                            let statusClass = 'status-none';

                            if (status === 'presente') { statusLabel = 'Presente'; statusClass = 'status-active'; }
                            else if (status === 'ausente') { statusLabel = 'Ausente'; statusClass = 'status-inactive'; }
                            else if (status === 'llegada_tarde') { statusLabel = 'Llegada Tarde'; statusClass = 'status-warning'; }
                            else if (status === 'retiro_anticipado') { statusLabel = 'Retiro Anticipado'; statusClass = 'status-info'; }

                            // Styles for view mode
                            const statusStyle = isViewMode ? {
                                padding: '5px 10px',
                                borderRadius: '4px',
                                fontWeight: 'bold',
                                backgroundColor: status === 'presente' ? '#d1fae5' : status === 'ausente' ? '#fee2e2' : '#f3f4f6',
                                color: status === 'presente' ? '#065f46' : status === 'ausente' ? '#991b1b' : '#374151'
                            } : {};

                            return (
                                <TableRow key={student.id}>
                                    <TableCell>{fullName}</TableCell>
                                    <TableCell>{student.dni || 'N/A'}</TableCell>
                                    <TableCell>{student.gender === 'M' ? 'Varón' : student.gender === 'F' ? 'Mujer' : '-'}</TableCell>
                                    <TableCell>
                                        {isViewMode ? (
                                            <span style={statusStyle}>
                                                {statusLabel}
                                            </span>
                                        ) : (
                                            <span className={`status-badge ${statusClass}`}
                                                style={!status ? { backgroundColor: '#e5e7eb', color: '#374151', border: '1px solid #d1d5db' } : {}}>
                                                {statusLabel}
                                            </span>
                                        )}
                                    </TableCell>
                                    {!isViewMode && (
                                        <TableCell>
                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                {/* Button Group 1: Normal Attendance */}
                                                <Button
                                                    variant={status === 'presente' ? 'danger' : 'success'}
                                                    size="small"
                                                    onClick={() => onToggleStatus(student.id, status === 'presente' ? 'ausente' : 'presente')}
                                                    title={status === 'presente' ? 'Marcar Ausente' : 'Marcar Presente'}
                                                    style={{ minWidth: '100px' }}
                                                >
                                                    {status === 'presente' ? '❌ Ausente' : '✅ Presente'}
                                                </Button>

                                                {/* Button Group 2: Out of Hours / Exception */}
                                                <Button
                                                    variant="warning"
                                                    size="small"
                                                    onClick={() => onOpenDetails(student, null)}
                                                    title="Fuera de Horario (Tarde/Retiro)"
                                                >
                                                    ⏱️/🏃 Borrar/Editar
                                                </Button>
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table >
            </>
        );
    };

    const renderWeeklyView = () => {
        // Calculate week days
        const [year, month, day] = selectedDate.split('-').map(Number);
        const d = new Date(year, month - 1, day);
        const dayOfWeek = d.getDay();
        const diffToMon = (dayOfWeek + 6) % 7;
        const monday = new Date(d);
        monday.setDate(d.getDate() - diffToMon);

        const weekDates = [];
        for (let i = 0; i < 5; i++) { // Monday to Friday
            const current = new Date(monday);
            current.setDate(monday.getDate() + i);
            weekDates.push(current);
        }

        return (
            <Table striped bordered responsive>
                <TableHeader>
                    <TableRow>
                        <TableCell as="th">Alumno</TableCell>
                        {weekDates.map(date => (
                            <TableCell as="th" key={date.toISOString()}>
                                {date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {students.map(student => {
                        const fullName = `${student.first_name} ${student.paternal_surname || ''}`.trim();
                        return (
                            <TableRow key={student.id}>
                                <TableCell>{fullName}</TableCell>
                                {weekDates.map(date => {
                                    const dateStr = date.toISOString().split('T')[0];
                                    // Find record
                                    const record = attendanceHistory.find(r =>
                                        r.student_id === student.id &&
                                        (r.date.startsWith(dateStr) || new Date(r.date).toISOString().startsWith(dateStr))
                                    );
                                    const status = record ? record.status : null;
                                    return (
                                        <TableCell key={dateStr} style={{ textAlign: 'center' }}>
                                            {status === 'presente' ? '✅' : status === 'ausente' ? '❌' : <span title="Sin Registro">⚪</span>}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        );
    };

    const renderSummaryView = () => {
        // Calculate stats per student
        const studentStats = students.map(student => {
            const studentRecords = attendanceHistory.filter(r => r.student_id === student.id);
            const present = studentRecords.filter(r => r.status === 'presente' || r.status === 'llegada_tarde' || r.status === 'retiro_anticipado').length;
            const absent = studentRecords.filter(r => r.status === 'ausente').length;
            const lates = studentRecords.filter(r => r.status === 'llegada_tarde').length;
            const early = studentRecords.filter(r => r.status === 'retiro_anticipado').length;

            const total = present + absent;
            const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
            return { ...student, present, absent, lates, early, percentage };
        });

        const topAbsent = [...studentStats].sort((a, b) => b.absent - a.absent).slice(0, 3).filter(s => s.absent > 0);
        const topLates = [...studentStats].sort((a, b) => b.lates - a.lates).slice(0, 3).filter(s => s.lates > 0);
        const topEarly = [...studentStats].sort((a, b) => b.early - a.early).slice(0, 3).filter(s => s.early > 0);

        return (
            <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                    {/* Visual Warnings */}
                    <div style={{ border: '1px solid #fee2e2', borderRadius: '8px', padding: '15px', background: '#fff1f2' }}>
                        <h4 style={{ color: '#991b1b', marginTop: 0 }}>🚨 Más Faltas</h4>
                        {topAbsent.length > 0 ? (
                            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                {topAbsent.map(s => (
                                    <li
                                        key={s.id}
                                        style={{ color: '#7f1d1d', cursor: 'pointer', textDecoration: 'underline' }}
                                        onClick={() => onShowHistory(s, 'ausente')}
                                        title="Ver detalle de faltas"
                                    >
                                        <strong>{s.first_name} {s.paternal_surname}</strong>: {s.absent}
                                    </li>
                                ))}
                            </ul>
                        ) : <span style={{ color: '#991b1b', fontStyle: 'italic' }}>Sin faltas registradas</span>}
                    </div>

                    <div style={{ border: '1px solid #fef3c7', borderRadius: '8px', padding: '15px', background: '#fffbeb' }}>
                        <h4 style={{ color: '#92400e', marginTop: 0 }}>⏱️ Llegadas Tarde</h4>
                        {topLates.length > 0 ? (
                            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                {topLates.map(s => (
                                    <li
                                        key={s.id}
                                        style={{ color: '#78350f', cursor: 'pointer', textDecoration: 'underline' }}
                                        onClick={() => onShowHistory(s, 'llegada_tarde')}
                                        title="Ver detalle de llegadas tarde"
                                    >
                                        <strong>{s.first_name} {s.paternal_surname}</strong>: {s.lates}
                                    </li>
                                ))}
                            </ul>
                        ) : <span style={{ color: '#92400e', fontStyle: 'italic' }}>Todos puntuales</span>}
                    </div>

                    <div style={{ border: '1px solid #e0e7ff', borderRadius: '8px', padding: '15px', background: '#eef2ff' }}>
                        <h4 style={{ color: '#3730a3', marginTop: 0 }}>🏃 Retiro Anticipado</h4>
                        {topEarly.length > 0 ? (
                            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                {topEarly.map(s => (
                                    <li
                                        key={s.id}
                                        style={{ color: '#312e81', cursor: 'pointer', textDecoration: 'underline' }}
                                        onClick={() => onShowHistory(s, 'retiro_anticipado')}
                                        title="Ver detalle de retiros anticipados"
                                    >
                                        <strong>{s.first_name} {s.paternal_surname}</strong>: {s.early}
                                    </li>
                                ))}
                            </ul>
                        ) : <span style={{ color: '#3730a3', fontStyle: 'italic' }}>Sin retiros anticipados</span>}
                    </div>
                </div>

                <Table striped bordered responsive>
                    <TableHeader>
                        <TableRow>
                            <TableCell as="th">Alumno</TableCell>
                            <TableCell as="th">Presentes</TableCell>
                            <TableCell as="th">Ausentes</TableCell>
                            <TableCell as="th">Tardanzas</TableCell>
                            <TableCell as="th">Retiros Ant.</TableCell>
                            <TableCell as="th">% Asistencia</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {studentStats.map(student => (
                            <TableRow
                                key={student.id}
                                style={{ cursor: 'pointer' }}
                                onClick={() => onShowHistory(student, 'all')}
                                title="Ver historial completo"
                            >
                                <TableCell>{`${student.first_name} ${student.paternal_surname}`}</TableCell>
                                <TableCell>{student.present}</TableCell>
                                <TableCell>{student.absent}</TableCell>
                                <TableCell>{student.lates}</TableCell>
                                <TableCell>{student.early}</TableCell>
                                <TableCell>
                                    <span style={{
                                        fontWeight: 'bold',
                                        color: student.percentage < 75 ? 'red' : 'green'
                                    }}>
                                        {student.percentage}%
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </>
        );
    };

    return (
        <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
                <Text variant="h1">Asistencia</Text>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Button
                        variant={viewMode === 'register' && reportType === 'daily' ? 'secondary' : 'primary'}
                        onClick={() => {
                            if (reportType !== 'daily' || viewMode === 'view') {
                                setReportType('daily');
                                if (viewMode !== 'register') onToggleViewMode();
                            } else {
                                onToggleViewMode();
                            }
                        }}
                    >
                        {viewMode === 'register' && reportType === 'daily' ? 'Ver Registradas' : 'Registrar Asistencia'}
                    </Button>
                    {viewMode === 'register' && reportType === 'daily' && (
                        <Button
                            variant="primary"
                            onClick={onSave}
                            disabled={!hasChanges || saving}
                        >
                            {saving ? 'Guardando...' : 'Guardar Todo'}
                        </Button>
                    )}
                </div>
            </div>

            <div className="attendance-header">
                <div className="attendance-filters" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <select
                        value={selectedClassroom || ''}
                        onChange={(e) => setSelectedClassroom(Number(e.target.value))}
                        className="select-field"
                    >
                        {classrooms.map(room => (
                            <option key={room.id} value={room.id}>{room.name}</option>
                        ))}
                    </select>

                    <select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        className="select-field"
                    >
                        <option value="daily">Diaria</option>
                        <option value="weekly">Semanal</option>
                        <option value="monthly">Mensual</option>
                        <option value="yearly">Anual</option>
                    </select>

                    {renderDatePicker()}
                </div>
            </div>

            <div style={{ marginTop: '20px' }}>
                {reportType === 'daily' && renderDailyView()}
                {reportType === 'weekly' && renderWeeklyView()}
                {(reportType === 'monthly' || reportType === 'yearly') && renderSummaryView()}
            </div>
        </Card>
    );
};

export default DesktopAttendance;

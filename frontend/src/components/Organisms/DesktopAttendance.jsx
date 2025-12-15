import React from 'react';
import Card from '../Atoms/Card';
import Text from '../Atoms/Text';
import Button from '../Atoms/Button';
import Table from '../Atoms/Table';
import TableRow from '../Atoms/TableRow';
import TableCell from '../Atoms/TableCell';
import TableHeader from '../Atoms/TableHeader';
import TableBody from '../Atoms/TableBody';
import Modal from '../Atoms/Modal';
import FormGroup from '../Molecules/FormGroup';
import { usePermissions } from '../../context/PermissionsContext';

const DesktopAttendance = ({
    attendanceData,
    selectedClass,
    setSelectedClass,
    selectedDate,
    setSelectedDate,
    isModalOpen,
    setIsModalOpen,
    currentAttendance,
    setCurrentAttendance,
    formState,
    setFormState,
    handleEdit,
    handleSave,
    handleChange
}) => {
    const { permissions: perms = {} } = usePermissions();
    const canCreate = perms['attendance:create'] !== undefined ? perms['attendance:create'] : true;
    const canEdit = perms['attendance:edit'] !== undefined ? perms['attendance:edit'] : true;
    const canDelete = perms['attendance:delete'] !== undefined ? perms['attendance:delete'] : true;

    const filteredAttendance = attendanceData.filter(record => {
        const matchesClass = selectedClass === 'Todos' || record.classroom_name === selectedClass;
        return matchesClass;
    });

    return (
        <Card>
            <Text variant="h1">Asistencia</Text>

            <div className="attendance-header">
                <div className="attendance-filters">
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="class-select"
                    >
                        <option value="Todos">Todos los salones</option>
                        <option value="Maternal A">Maternal A</option>
                        <option value="Maternal B">Maternal B</option>
                        <option value="Jardín A">Jardín A</option>
                        <option value="Jardín B">Jardín B</option>
                        <option value="Preescolar A">Preescolar A</option>
                    </select>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="date-input"
                    />
                </div>
                {canCreate && <Button variant="primary">Registrar Asistencia</Button>}
            </div>

            <Table striped bordered responsive>
                <TableHeader>
                    <TableRow>
                        <TableCell as="th">ID</TableCell>
                        <TableCell as="th">Estudiante</TableCell>
                        <TableCell as="th">Salón</TableCell>
                        <TableCell as="th">Fecha</TableCell>
                        <TableCell as="th">Estado</TableCell>
                        <TableCell as="th">Acciones</TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredAttendance.map(record => (
                        <TableRow key={record.id}>
                            <TableCell>{record.id}</TableCell>
                            <TableCell>{record.student_name || 'N/A'}</TableCell>
                            <TableCell>{record.classroom_name || 'Sin asignar'}</TableCell>
                            <TableCell>{record.date}</TableCell>
                            <TableCell>
                                <span className={`status-badge ${record.status === 'presente' ? 'status-presente' : record.status === 'ausente' ? 'status-ausente' : 'status-tarde'}`}>
                                    {record.status === 'presente' ? 'Presente' :
                                        record.status === 'ausente' ? 'Ausente' : 'Tarde'}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="actions-cell">
                                    {canEdit && (
                                        <Button
                                            variant="secondary"
                                            size="small"
                                            className="action-btn"
                                            onClick={() => handleEdit(record)}
                                        >
                                            Editar
                                        </Button>)}
                                    {canDelete && <Button variant="primary" size="small" className="action-btn">Justificar</Button>}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentAttendance ? "Editar Asistencia" : "Registrar Asistencia"}
            >
                <FormGroup>
                    <input
                        label="Estudiante"
                        name="studentName"
                        value={formState.studentName}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <select
                        name="classroom"
                        value={formState.classroom}
                        onChange={handleChange}
                        className="select-field"
                    >
                        <option value="">Seleccione un salón</option>
                        <option value="Maternal A">Maternal A</option>
                        <option value="Maternal B">Maternal B</option>
                        <option value="Jardín A">Jardín A</option>
                        <option value="Jardín B">Jardín B</option>
                        <option value="Preescolar A">Preescolar A</option>
                    </select>
                </FormGroup>
                <FormGroup>
                    <input
                        label="Fecha"
                        name="date"
                        type="date"
                        value={formState.date}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <select
                        name="status"
                        value={formState.status}
                        onChange={handleChange}
                        className="select-field"
                    >
                        <option value="presente">Presente</option>
                        <option value="ausente">Ausente</option>
                        <option value="tarde">Tarde</option>
                    </select>
                </FormGroup>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={handleSave}>Guardar</Button>
                </div>
            </Modal>
        </Card>
    );
};

export default DesktopAttendance;

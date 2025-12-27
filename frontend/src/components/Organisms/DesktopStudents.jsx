import React from 'react';
import { studentFields } from '../../config/fields/studentFields.jsx';
import Card from '../Atoms/Card';
import Text from '../Atoms/Text';
import Button from '../Atoms/Button';
import Input from '../Atoms/Input';
import Table from '../Atoms/Table';
import TableHeader from '../Atoms/TableHeader';
import TableRow from '../Atoms/TableRow';
import TableCell from '../Atoms/TableCell';
import TableBody from '../Atoms/TableBody';
import './organisms.css';
import { usePermissions } from '../../context/PermissionsContext';

const DesktopStudents = ({ students, onEdit, onDelete, onAdd, searchTerm, setSearchTerm, onView, statusFilter, onStatusFilterChange }) => {
    const { permissions: perms = {} } = usePermissions();
    const canCreate = perms['students:create'] !== undefined ? perms['students:create'] : true;
    const canEdit = perms['students:edit'] !== undefined ? perms['students:edit'] : true;
    const canDelete = perms['students:delete'] !== undefined ? perms['students:delete'] : true;
    const canView = perms['alumnos:ver'] !== undefined ? perms['alumnos:ver'] : true;

    return (
        <Card>
            <Text variant="h1">Estudiantes</Text>

            <div className="students-header">
                {canCreate && (
                    <Button variant="primary" onClick={onAdd}>
                        Agregar Estudiante
                    </Button>
                )}
                <Input
                    type="text"
                    placeholder="Buscar por nombre o DNI..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <select
                    className="select-field"
                    style={{ width: 'auto', marginLeft: '10px' }}
                    value={statusFilter}
                    onChange={(e) => onStatusFilterChange(e.target.value)}
                >
                    <option value="">Todos los Estados</option>
                    <option value="activo">Activo</option>
                    <option value="preinscripto">Preinscripto</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="inscripto">Inscripto</option>
                    <option value="egresado">Egresado</option>
                    <option value="sorteo">Sorteo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="rechazado">Rechazado</option>
                </select>
            </div>

            <Table striped bordered responsive>
                <TableHeader>
                    <TableRow>
                        {studentFields.filter(f => f.showInDesktop).map(field => (
                            <TableCell as="th" key={field.key}>{field.label}</TableCell>
                        ))}
                        <TableCell as="th">Acciones</TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {students.map(student => (
                        <TableRow key={student.id}>
                            {studentFields.filter(f => f.showInDesktop).map(field => (
                                <TableCell key={field.key}>
                                    {field.render
                                        ? field.render(field.valueFn ? field.valueFn(student) : student[field.key], student)
                                        : (field.valueFn ? field.valueFn(student) : (student[field.key] || 'N/A'))
                                    }
                                </TableCell>
                            ))}
                            <TableCell>
                                <div className="actions-cell">
                                    {canView && (
                                        <button
                                            className="icon-action-btn view-btn"
                                            onClick={() => onView(student)}
                                            title="Ver Detalle"
                                        >
                                            👁️
                                        </button>)}
                                    {canEdit && (
                                        <button
                                            className="icon-action-btn edit-btn"
                                            onClick={() => onEdit(student)}
                                            title="Editar"
                                        >
                                            ✏️
                                        </button>)}
                                    {canDelete && (
                                        <button
                                            className="icon-action-btn delete-btn"
                                            onClick={() => onDelete(student.id)}
                                            title="Eliminar"
                                        >
                                            🗑️
                                        </button>)}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};

export default DesktopStudents;

import React from 'react';
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

const DesktopStudents = ({ students, onEdit, onDelete, onAdd, searchTerm, setSearchTerm }) => {
    const perms = usePermissions();
    const canCreate = perms['students:create'] !== undefined ? perms['students:create'] : true;
    const canEdit = perms['students:edit'] !== undefined ? perms['students:edit'] : true;
    const canDelete = perms['students:delete'] !== undefined ? perms['students:delete'] : true;

    return (
        <Card>
            <Text variant="h1">Estudiantes</Text>

            <div className="students-header">
                {canCreate && <Button variant="primary" onClick={onAdd}>Agregar Estudiante</Button>}
                <Input
                    type="text"
                    placeholder="Buscar estudiantes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <Table striped bordered responsive>
                <TableHeader>
                    <TableRow>
                        <TableCell as="th">ID</TableCell>
                        <TableCell as="th">Nombre</TableCell>
                        <TableCell as="th">DNI</TableCell>
                        <TableCell as="th">Salón</TableCell>
                        <TableCell as="th">Estado</TableCell>
                        <TableCell as="th">Acciones</TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {students.map(student => (
                        <TableRow key={student.id}>
                            <TableCell>{student.id}</TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.dni}</TableCell>
                            <TableCell>{student.classroom}</TableCell>
                            <TableCell>
                                <span className={`status-badge ${student.status === 'activo' ? 'status-active' : 'status-inactive'}`}>
                                    {student.status}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="actions-cell">
                                    {canEdit && (
                                        <Button
                                            variant="secondary"
                                            size="small"
                                            className="action-btn"
                                            onClick={() => onEdit(student)}
                                        >
                                            Editar
                                        </Button>)}
                                    {canDelete && (
                                        <Button
                                            variant="danger"
                                            size="small"
                                            className="action-btn"
                                            onClick={() => onDelete(student.id)}
                                        >
                                            Eliminar
                                        </Button>)}
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

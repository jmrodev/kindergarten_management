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

const DesktopUsers = ({ users, onEdit, onDelete, onAdd, searchTerm, setSearchTerm }) => {
    const { permissions: perms = {} } = usePermissions();
    const canCreate = perms['personal:create'] !== undefined ? perms['personal:create'] : true;
    const canEdit = perms['personal:edit'] !== undefined ? perms['personal:edit'] : true;
    const canDelete = perms['personal:delete'] !== undefined ? perms['personal:delete'] : true;

    return (
        <Card>
            <Text variant="h1">Gestión de Usuarios</Text>

            <div className="students-header">
                {canCreate && <Button variant="primary" onClick={onAdd}>Agregar Usuario</Button>}
                <Input
                    type="text"
                    placeholder="Buscar usuarios..."
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
                        <TableCell as="th">Email</TableCell>
                        <TableCell as="th">Rol</TableCell>
                        <TableCell as="th">Estado</TableCell>
                        <TableCell as="th">Acciones</TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map(user => (
                        <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.first_name} {user.paternal_surname || ''} {user.maternal_surname || ''}</TableCell>
                            <TableCell>{user.dni || 'N/A'}</TableCell>
                            <TableCell>{user.email || 'N/A'}</TableCell>
                            <TableCell>
                                <span className="role-badge">
                                    {user.role_name || 'Sin rol'}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className={`status-badge ${user.is_active ? 'status-active' : 'status-inactive'}`}>
                                    {user.is_active ? 'Activo' : 'Inactivo'}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="actions-cell">
                                    {canEdit && (
                                        <Button
                                            variant="secondary"
                                            size="small"
                                            className="action-btn"
                                            onClick={() => onEdit(user)}
                                        >
                                            Editar
                                        </Button>)}
                                    {canDelete && (
                                        <Button
                                            variant="danger"
                                            size="small"
                                            className="action-btn"
                                            onClick={() => onDelete(user.id)}
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

export default DesktopUsers;

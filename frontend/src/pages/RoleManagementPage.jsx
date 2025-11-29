import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useToast } from '../hooks/useToast';
import {
    Container,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const RoleManagementPage = () => {
    const [roles, setRoles] = useState([]);
    const [accessLevels, setAccessLevels] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentRole, setCurrentRole] = useState({ id: null, role_name: '', access_level_id: '' });
    const { showSuccess, showError } = useToast();

    useEffect(() => {
        fetchRoles();
        fetchAccessLevels();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await api.get('/roles');
            setRoles(response.data);
        } catch (error) {
            showError('Error', 'Error al cargar roles');
            console.error('Error fetching roles:', error);
        }
    };

    const fetchAccessLevels = async () => {
        try {
            const response = await api.get('/roles/access-levels');
            setAccessLevels(response.data);
        } catch (error) {
            showError('Error', 'Error al cargar niveles de acceso');
            console.error('Error fetching access levels:', error);
        }
    };

    const handleOpenDialog = (role = { id: null, role_name: '', access_level_id: '' }) => {
        setCurrentRole(role);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentRole({ id: null, role_name: '', access_level_id: '' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentRole(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            if (currentRole.id) {
                await api.put(`/roles/${currentRole.id}`, currentRole);
                showSuccess('Rol actualizado exitosamente', '');
            } else {
                await api.post('/roles', currentRole);
                showSuccess('Rol creado exitosamente', '');
            }
            fetchRoles();
            handleCloseDialog();
        } catch (error) {
            showError('Error', 'Error al guardar rol');
            console.error('Error saving role:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este rol?')) {
            try {
                await api.delete(`/roles/${id}`);
                showSuccess('Rol eliminado exitosamente', '');
                fetchRoles();
            } catch (error) {
                showError('Error', 'Error al eliminar rol');
                console.error('Error deleting role:', error);
            }
        }
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Gestión de Roles
            </Typography>
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{ mb: 2 }}
            >
                Crear Nuevo Rol
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre del Rol</TableCell>
                            <TableCell>Nivel de Acceso</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {roles.map((role) => (
                            <TableRow key={role.id}>
                                <TableCell>{role.id}</TableCell>
                                <TableCell>{role.role_name}</TableCell>
                                <TableCell>{role.access_name}</TableCell>
                                <TableCell align="right">
                                    <IconButton color="primary" onClick={() => handleOpenDialog(role)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="secondary" onClick={() => handleDelete(role.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{currentRole.id ? 'Editar Rol' : 'Crear Rol'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="role_name"
                        label="Nombre del Rol"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={currentRole.role_name}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Nivel de Acceso</InputLabel>
                        <Select
                            name="access_level_id"
                            value={currentRole.access_level_id}
                            onChange={handleChange}
                            label="Nivel de Acceso"
                        >
                            {accessLevels.map((level) => (
                                <MenuItem key={level.id} value={level.id}>
                                    {level.access_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {currentRole.id ? 'Guardar Cambios' : 'Crear Rol'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default RoleManagementPage;

import { useState, useEffect } from 'react';
import { Table, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import staffService from '../services/staffService';
import StaffForm from './StaffForm';
import StaffDetail from './StaffDetail';
import ConfirmModal from './ConfirmModal';
import { ROLE_TRANSLATIONS } from '../utils/constants'; // Import from constants.js

function StaffList({ darkMode, showSuccess, showError }) { // Accept showSuccess and showError as props
    const [staff, setStaff] = useState([]);
    const [filteredStaff, setFilteredStaff] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        loadStaff();
        loadRoles();
    }, []);

    useEffect(() => {
        filterStaffList();
    }, [staff, searchTerm, filterRole, filterStatus]);

    const loadStaff = async () => {
        try {
            const response = await staffService.getAllStaff();
            setStaff(response.data);
        } catch (error) {
            showError('Error', 'Error al cargar personal'); // Use showError prop
        }
    };

    const loadRoles = async () => {
        try {
            const response = await staffService.getRoles();
            setRoles(response.data);
        } catch (error) {
            console.error('Error loading roles:', error);
            showError('Error', 'Error al cargar roles'); // Use showError prop
        }
    };

    const filterStaffList = () => {
        let filtered = [...staff];

        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            filtered = filtered.filter(s =>
                `${s.first_name} ${s.paternal_surname}`.toLowerCase().includes(search) ||
                (s.email && s.email.toLowerCase().includes(search)) ||
                (s.phone && s.phone.includes(search))
            );
        }

        if (filterRole !== 'all') {
            filtered = filtered.filter(s => s.role_id === parseInt(filterRole));
        }

        if (filterStatus !== 'all') {
            const isActive = filterStatus === 'active';
            filtered = filtered.filter(s => s.is_active === isActive);
        }

        setFilteredStaff(filtered);
    };

    const handleCreate = () => {
        setSelectedStaff(null);
        setShowForm(true);
    };

    const handleEdit = (staffMember) => {
        setSelectedStaff(staffMember);
        setShowForm(true);
    };

    const handleView = (staffMember) => {
        setSelectedStaff(staffMember);
        setShowDetail(true);
    };

    const handleDeleteClick = (staffMember) => {
        setSelectedStaff(staffMember);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            await staffService.deleteStaff(selectedStaff.id);
            showSuccess('Éxito', 'Personal eliminado correctamente'); // Use showSuccess prop
            loadStaff();
        } catch (error) {
            showError('Error', error.response?.data?.message || 'Error al eliminar personal'); // Use showError prop
        } finally {
            setShowDeleteModal(false);
            setSelectedStaff(null);
        }
    };

    const handleSave = async (staffData) => {
        try {
            if (selectedStaff) {
                await staffService.updateStaff(selectedStaff.id, staffData);
                showSuccess('Éxito', 'Personal actualizado correctamente'); // Use showSuccess prop
            } else {
                await staffService.createStaff(staffData);
                showSuccess('Éxito', 'Personal creado correctamente'); // Use showSuccess prop
            }
            setShowForm(false);
            loadStaff();
        } catch (error) {
            showError('Error', error.response?.data?.message || 'Error al guardar personal'); // Use showError prop
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ color: darkMode ? '#a78bfa' : '#667eea' }}>
                    <span className="material-icons" style={{ fontSize: '2rem', verticalAlign: 'middle', marginRight: '0.5rem' }}>
                        people
                    </span>
                    Personal
                </h2>
                <Button
                    onClick={handleCreate}
                    style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                    }}
                >
                    <span className="material-icons" style={{ fontSize: '1.2rem', verticalAlign: 'middle', marginRight: '0.3rem' }}>
                        add
                    </span>
                    Nuevo Personal
                </Button>
            </div>

            {/* Filtros */}
            <div className="row mb-4">
                <div className="col-md-4">
                    <InputGroup>
                        <InputGroup.Text style={{
                            background: darkMode ? '#1f2937' : '#f8f9fa',
                            border: `1px solid ${darkMode ? '#374151' : '#dee2e6'}`,
                            color: darkMode ? '#e5e7eb' : '#495057'
                        }}>
                            <span className="material-icons" style={{ fontSize: '1.2rem' }}>search</span>
                        </InputGroup.Text>
                        <Form.Control
                            placeholder="Buscar por nombre, email o teléfono..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                background: darkMode ? '#1f2937' : '#fff',
                                border: `1px solid ${darkMode ? '#374151' : '#dee2e6'}`,
                                color: darkMode ? '#e5e7eb' : '#212529'
                            }}
                        />
                    </InputGroup>
                </div>
                <div className="col-md-3">
                    <Form.Select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        style={{
                            background: darkMode ? '#1f2937' : '#fff',
                            border: `1px solid ${darkMode ? '#374151' : '#dee2e6'}`,
                            color: darkMode ? '#e5e7eb' : '#212529'
                        }}
                    >
                        <option value="all">Todos los roles</option>
                        {roles.map(role => (
                            <option key={role.id} value={role.id}>
                                {ROLE_TRANSLATIONS[role.role_name] || role.role_name}
                            </option>
                        ))}
                    </Form.Select>
                </div>
                <div className="col-md-3">
                    <Form.Select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{
                            background: darkMode ? '#1f2937' : '#fff',
                            border: `1px solid ${darkMode ? '#374151' : '#dee2e6'}`,
                            color: darkMode ? '#e5e7eb' : '#212529'
                        }}
                    >
                        <option value="all">Todos los estados</option>
                        <option value="active">Activos</option>
                        <option value="inactive">Inactivos</option>
                    </Form.Select>
                </div>
                <div className="col-md-2">
                    <div style={{
                        padding: '0.375rem 0.75rem',
                        color: darkMode ? '#9ca3af' : '#6c757d',
                        fontSize: '0.9rem'
                    }}>
                        {filteredStaff.length} encontrado{filteredStaff.length !== 1 ? 's' : ''}
                    </div>
                </div>
            </div>

            {/* Tabla */}
            <div style={{
                background: darkMode ? '#1f2937' : '#fff',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: darkMode
                    ? '0 4px 6px rgba(0, 0, 0, 0.3)'
                    : '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
                <Table hover responsive className="mb-0">
                    <thead style={{
                        background: darkMode ? '#374151' : '#f8f9fa',
                        borderBottom: `2px solid ${darkMode ? '#4b5563' : '#dee2e6'}`
                    }}>
                        <tr>
                            <th style={{ color: darkMode ? '#e5e7eb' : '#495057', fontWeight: '600' }}>Nombre</th>
                            <th style={{ color: darkMode ? '#e5e7eb' : '#495057', fontWeight: '600' }}>Email</th>
                            <th style={{ color: darkMode ? '#e5e7eb' : '#495057', fontWeight: '600' }}>Teléfono</th>
                            <th style={{ color: darkMode ? '#e5e7eb' : '#495057', fontWeight: '600' }}>Rol</th>
                            <th style={{ color: darkMode ? '#e5e7eb' : '#495057', fontWeight: '600' }}>Sala</th>
                            <th style={{ color: darkMode ? '#e5e7eb' : '#495057', fontWeight: '600' }}>Estado</th>
                            <th style={{ color: darkMode ? '#e5e7eb' : '#495057', fontWeight: '600', textAlign: 'center' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStaff.map((staffMember) => (
                            <tr key={staffMember.id} style={{
                                background: darkMode ? '#1f2937' : '#fff',
                                borderBottom: `1px solid ${darkMode ? '#374151' : '#dee2e6'}`,
                                color: darkMode ? '#e5e7eb' : '#212529'
                            }}>
                                <td style={{ fontWeight: '500' }}>
                                    {`${staffMember.first_name} ${staffMember.paternal_surname}`}
                                </td>
                                <td>{staffMember.email || '-'}</td>
                                <td>{staffMember.phone || '-'}</td>
                                <td>
                                    <Badge bg="info" style={{ fontSize: '0.85rem' }}>
                                        {ROLE_TRANSLATIONS[staffMember.role_name] || staffMember.role_name}
                                    </Badge>
                                </td>
                                <td>{staffMember.classroom_name || '-'}</td>
                                <td>
                                    <Badge bg={staffMember.is_active ? 'success' : 'secondary'}>
                                        {staffMember.is_active ? 'Activo' : 'Inactivo'}
                                    </Badge>
                                </td>
                                <td>
                                    <div className="d-flex justify-content-center gap-2">
                                        <Button
                                            variant="info"
                                            size="sm"
                                            onClick={() => handleView(staffMember)}
                                            title="Ver detalles"
                                        >
                                            <span className="material-icons" style={{ fontSize: '1rem' }}>visibility</span>
                                        </Button>
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            onClick={() => handleEdit(staffMember)}
                                            title="Editar"
                                        >
                                            <span className="material-icons" style={{ fontSize: '1rem' }}>edit</span>
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDeleteClick(staffMember)}
                                            title="Eliminar"
                                        >
                                            <span className="material-icons" style={{ fontSize: '1rem' }}>delete</span>
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Modales */}
            {showForm && (
                <StaffForm
                    show={showForm}
                    onHide={() => { setShowForm(false); setSelectedStaff(null); }}
                    onSave={handleSave}
                    staff={selectedStaff}
                    roles={roles}
                    darkMode={darkMode}
                />
            )}

            {showDetail && (
                <StaffDetail
                    show={showDetail}
                    onHide={() => { setShowDetail(false); setSelectedStaff(null); }}
                    staff={selectedStaff}
                    onEdit={handleEdit}
                    darkMode={darkMode}
                />
            )}

            <ConfirmModal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Eliminar Personal"
                message={`¿Está seguro que desea eliminar a ${selectedStaff?.first_name} ${selectedStaff?.paternal_surname}?`}
                darkMode={darkMode}
            />

            <ToastNotification
                show={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
                message={toast.message}
                variant={toast.variant}
            />
        </div>
    );
}

export default StaffList;

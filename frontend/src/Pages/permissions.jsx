import { useEffect, useState } from 'react';
import permissionsService from '../services/permissionsService';
import api from '../utils/api';
import { usePermissions } from '../context/PermissionsContext';
import Card from '../components/Atoms/Card';
import Text from '../components/Atoms/Text';
import Table from '../components/Atoms/Table';
import TableHeader from '../components/Atoms/TableHeader';
import TableBody from '../components/Atoms/TableBody';
import TableRow from '../components/Atoms/TableRow';
import TableCell from '../components/Atoms/TableCell';
import PermissionRow from '../components/Molecules/PermissionRow';
import PermissionToggle from '../components/Atoms/PermissionToggle';
import useIsMobile from '../hooks/useIsMobile';
import './permissions.css';

const PermissionsPage = () => {
    const { refreshPermissions } = usePermissions();
    const isMobile = useIsMobile();
    const [roles, setRoles] = useState([]);
    const [modules, setModules] = useState([]);
    const [actions, setActions] = useState([]);
    const [permissions, setPermissions] = useState([]); // raw v_role_permissions
    const [selectedRoleId, setSelectedRoleId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedModules, setExpandedModules] = useState({});

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [rRoles, rModules, rActions, rPerms] = await Promise.all([
                    api.get('/api/roles'),
                    permissionsService.getModules(),
                    permissionsService.getActions(),
                    permissionsService.getAll()
                ]);

                setRoles(rRoles);
                setModules(rModules);
                setActions(rActions);
                setPermissions(rPerms);

                if (rRoles.length > 0) setSelectedRoleId(rRoles[0].id);
            } catch (err) {
                console.error('Error loading permissions page', err);
                setError(err.message || 'Error cargando datos');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const getPermValue = (roleId, moduleId, actionId) => {
        const p = permissions.find(px => px.role_id === roleId && px.module_id === moduleId && px.action_id === actionId);
        return p ? !!p.is_granted : false;
    };

    const handleToggle = async (moduleId, actionId, checked) => {
        if (!selectedRoleId) return;
        try {
            // Optimistic UI update
            const prev = permissions.slice();
            const idx = permissions.findIndex(px => px.role_id === selectedRoleId && px.module_id === moduleId && px.action_id === actionId);
            if (idx >= 0) {
                const copy = permissions.slice();
                copy[idx] = { ...copy[idx], is_granted: checked ? 1 : 0 };
                setPermissions(copy);
            } else {
                // insert temporary entry
                setPermissions(prev.concat([{ role_id: selectedRoleId, module_id: moduleId, action_id: actionId, is_granted: checked ? 1 : 0 }]));
            }

            await permissionsService.toggle({ roleId: selectedRoleId, moduleId, actionId, isGranted: checked ? 1 : 0 });
            // refresh list
            const rPerms = await permissionsService.getAll();
            setPermissions(rPerms);

            // Refresh global permissions context (to update menus for current user)
            if (refreshPermissions) {
                await refreshPermissions();
            }
        } catch (err) {
            console.error('Toggle failed', err);
            setError(err.message || 'Error actualizando permiso');
            // rollback
            const rPerms = await permissionsService.getAll();
            setPermissions(rPerms);
        }
    };

    if (loading) return <div className="app-loading">Cargando permisos...</div>;
    if (error) return <div className="app-error">{error}</div>;

    const toggleModuleExpand = (moduleId) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };

    return (
        <Card>
            <Text variant="h1">Configuración de Permisos</Text>

            <div className="permissions-controls">
                <label>Rol: </label>
                <select value={selectedRoleId || ''} onChange={(e) => setSelectedRoleId(Number(e.target.value))}>
                    {roles.map(r => (
                        <option key={r.id} value={r.id}>{r.role_name}</option>
                    ))}
                </select>
            </div>

            {/* Mobile View: Card-based layout */}
            {isMobile ? (
                <div className="permissions-mobile-view">
                    {modules.map(m => (
                        <div key={m.id} className="permission-module-card">
                            <button
                                className="permission-module-header"
                                onClick={() => toggleModuleExpand(m.id)}
                                aria-expanded={expandedModules[m.id] || false}
                            >
                                <span className="permission-module-name">{m.module_name}</span>
                                <span className="permission-module-toggle">
                                    {expandedModules[m.id] ? '▼' : '▶'}
                                </span>
                            </button>
                            {expandedModules[m.id] && (
                                <div className="permission-module-actions">
                                    {actions.map(action => (
                                        <div key={action.id} className="permission-action-row">
                                            <label className="permission-action-label">
                                                {action.action_name}
                                            </label>
                                            <PermissionToggle
                                                checked={getPermValue(selectedRoleId, m.id, action.id)}
                                                onChange={(checked) => handleToggle(m.id, action.id, checked)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                /* Desktop View: Traditional table */
                <div className="permissions-table-wrap">
                    <Table striped bordered responsive className="permissions-table">
                        <TableHeader>
                            <TableRow>
                                <TableCell as="th">Módulo</TableCell>
                                {actions.map(a => <TableCell key={a.id} as="th">{a.action_name}</TableCell>)}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {modules.map(m => (
                                <PermissionRow
                                    key={m.id}
                                    module={m}
                                    actions={actions}
                                    getPermValue={(moduleId, actionId) => getPermValue(selectedRoleId, moduleId, actionId)}
                                    onToggle={handleToggle}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </Card>
    );
};

export default PermissionsPage;

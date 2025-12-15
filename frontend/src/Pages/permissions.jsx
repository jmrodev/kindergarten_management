import { useEffect, useState } from 'react';
import permissionsService from '../services/permissionsService';
import api from '../utils/api';
import Card from '../components/Atoms/Card';
import Text from '../components/Atoms/Text';
import Button from '../components/Atoms/Button';
import './permissions.css';

const PermissionToggle = ({ value, onChange, disabled }) => {
    return (
        <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
        />
    );
};

const PermissionsPage = () => {
    const [roles, setRoles] = useState([]);
    const [modules, setModules] = useState([]);
    const [actions, setActions] = useState([]);
    const [permissions, setPermissions] = useState([]); // raw v_role_permissions
    const [selectedRoleId, setSelectedRoleId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

            <div className="permissions-table-wrap">
                <table className="permissions-table">
                    <thead>
                        <tr>
                            <th>Módulo</th>
                            {actions.map(a => <th key={a.id}>{a.action_name}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {modules.map(m => (
                            <tr key={m.id}>
                                <td>{m.module_name}</td>
                                {actions.map(a => (
                                    <td key={a.id} className="permission-cell">
                                        <PermissionToggle
                                            value={getPermValue(selectedRoleId, m.id, a.id)}
                                            onChange={(checked) => handleToggle(m.id, a.id, checked)}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default PermissionsPage;

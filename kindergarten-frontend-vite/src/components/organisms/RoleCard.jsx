import React from 'react';
import RoleBadge from '../atoms/RoleBadge.jsx';
import ModuleCard from '../molecules/ModuleCard.jsx';

const RoleCard = ({
  role,
  modules,
  actions,
  permissions,
  roles,
  getVisibleModulesForRole,
  handlePermissionToggle
}) => {
  const roleName = role.role_name || role;
  const visibleModules = getVisibleModulesForRole(roleName);
  const roleNormalized = roleName.toLowerCase();
  const roleId = typeof role === 'object' ? role.id : roles.find(r => r.role_name === roleName)?.id;

  return (
    <div key={roleName} id={`role-card-${roleName}`} className="role-grid-item">
      <div className="role-card-header">
        <span>{roleName}</span>
        <RoleBadge roleName={roleName} />
      </div>
      <div className="role-modules-container">
        {modules
          .filter(module => visibleModules.includes(module.module_key))
          .map(module => (
            <ModuleCard
              key={`${roleName}-${module.id}`}
              moduleName={module.module_name}
              moduleId={module.id}
              moduleKey={module.module_key}
              roleName={roleName}
              actions={actions}
              permissions={permissions[roleName]?.[module.module_key] || {}}
              roleId={roleId}
              moduleIdValue={module.id}
              onPermissionToggle={handlePermissionToggle}
            />
          ))}
      </div>
    </div>
  );
};

export default RoleCard;
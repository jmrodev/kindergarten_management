import React from 'react';

const RoleFilter = ({ 
  roles, 
  selectedRoleFilter, 
  onFilterChange 
}) => {
  return (
    <div className="mb-4">
      <label htmlFor="roleFilter" className="form-label-custom fw-bold-custom">Filtrar por Rol:</label>
      <select
        id="roleFilter"
        className="form-select-custom w-auto-custom"
        value={selectedRoleFilter}
        onChange={(e) => onFilterChange(e.target.value)}
      >
        <option value="">Ver todos los roles</option>
        {roles.map(role => {
          const roleName = role.role_name || role;
          return (
            <option key={`filter-${roleName}`} value={roleName}>
              {roleName}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default RoleFilter;
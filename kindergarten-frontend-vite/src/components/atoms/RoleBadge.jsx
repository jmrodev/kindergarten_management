import React from 'react';

const RoleBadge = ({ roleName, className = '' }) => {
  // Determine role badge class based on role name
  let roleBadgeClass = 'role-badge';
  
  const roleNormalized = roleName?.toLowerCase();
  if (roleNormalized?.includes('admin')) roleBadgeClass += ' role-badge-admin';
  else if (roleNormalized?.includes('direct')) roleBadgeClass += ' role-badge-director';
  else if (roleNormalized?.includes('teacher')) roleBadgeClass += ' role-badge-teacher';
  else if (roleNormalized?.includes('secret')) roleBadgeClass += ' role-badge-secretary';
  else if (roleNormalized?.includes('tutor')) roleBadgeClass += ' role-badge-tutor';
  
  return (
    <span className={`${roleBadgeClass} ${className}`}>
      {roleName}
    </span>
  );
};

export default RoleBadge;
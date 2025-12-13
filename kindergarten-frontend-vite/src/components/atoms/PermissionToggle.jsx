import React from 'react';

const PermissionToggle = ({ 
  id, 
  checked, 
  disabled, 
  onChange, 
  label 
}) => {
  return (
    <div className="action-item">
      <input
        className="action-checkbox"
        type="checkbox"
        id={id}
        checked={!!checked}
        disabled={disabled}
        onChange={onChange}
      />
      <label
        className="action-label"
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  );
};

export default PermissionToggle;
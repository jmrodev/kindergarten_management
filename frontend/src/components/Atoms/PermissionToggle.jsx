import React from 'react';

const PermissionToggle = ({ checked = false, onChange = () => { }, disabled = false }) => {
    return (
        <label className="permission-toggle">
            <input
                type="checkbox"
                checked={!!checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
            />
        </label>
    );
};

export default PermissionToggle;

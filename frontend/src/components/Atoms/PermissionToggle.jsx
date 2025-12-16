import React from 'react';

const PermissionToggle = ({ checked = false, onChange = () => { }, disabled = false }) => {
    const handleChange = (e) => {
        const newValue = e.target.checked;
        onChange(newValue);
    };

    return (
        <label className="permission-toggle">
            <input
                type="checkbox"
                checked={!!checked}
                onChange={handleChange}
                disabled={disabled}
                aria-label="Alternar permiso"
            />
        </label>
    );
};

export default PermissionToggle;

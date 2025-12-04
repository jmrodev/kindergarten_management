import React from 'react';

const Toggle = ({
  label,
  name,
  checked = false,
  onChange,
  required = false,
  error = null,
  helpText = '',
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`toggle-container ${className}`.trim()}>
      <label className={`toggle-label ${required ? 'required' : ''}`}>
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className="toggle-checkbox"
          {...props}
        />
        <span className="toggle-switch"></span>
        <span className="toggle-text">{label}</span>
      </label>
      {error && <div className="toggle-error">{error}</div>}
      {helpText && !error && <div className="toggle-help">{helpText}</div>}
    </div>
  );
};

export default Toggle;
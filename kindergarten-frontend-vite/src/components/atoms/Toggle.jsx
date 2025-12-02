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
  const toggleClass = `form-toggle ${error ? 'form-toggle-error' : ''} ${className}`.trim();
  const labelClass = `form-toggle-label ${required ? 'form-label-required' : ''}`;

  return (
    <div className="form-group">
      <label className={labelClass}>
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className="form-toggle-input"
          {...props}
        />
        <span className="form-toggle-slider"></span>
        {label}
      </label>
      {error && <div className="form-error">{error}</div>}
      {helpText && !error && <div className="form-help">{helpText}</div>}
    </div>
  );
};

export default Toggle;
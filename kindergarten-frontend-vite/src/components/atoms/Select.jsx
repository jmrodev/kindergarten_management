import React from 'react';

const Select = ({
  label,
  name,
  value = '',
  onChange,
  options = [],
  required = false,
  error = null,
  helpText = '',
  disabled = false,
  placeholder = 'Seleccione una opción',
  className = '',
  ...props
}) => {
  const selectClass = `form-select ${error ? 'form-select-error' : ''} ${className}`.trim();
  const labelClass = `form-label ${required ? 'form-label-required' : ''}`;

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name} className={labelClass}>
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={selectClass}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option, index) => (
          <option key={index} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
      {error && <div className="form-error">{error}</div>}
      {helpText && !error && <div className="form-help">{helpText}</div>}
    </div>
  );
};

export default Select;
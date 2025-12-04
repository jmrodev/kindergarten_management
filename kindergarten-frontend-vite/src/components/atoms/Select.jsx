import React from 'react';
// Removed local CSS import since we're using global atomic styles

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
  // Determinar si el campo tiene contenido para aplicar clases CSS
  const hasValue = value !== '' && value != null;
  const selectFieldClass = [
    'select-field',
    error ? 'error' : '',
    hasValue ? 'filled' : (required && !hasValue ? 'empty' : ''),
  ].filter(Boolean).join(' ');

  return (
    <div className={`select-container ${className}`.trim()}>
      {label && (
        <label htmlFor={name} className={`select-label ${required ? 'required' : ''}`}>
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
        className={`${selectFieldClass} ${className}`.trim()}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option, index) => (
          <option key={index} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
      {error && <div className="select-error">{error}</div>}
      {helpText && !error && <div className="select-help">{helpText}</div>}
    </div>
  );
};

export default Select;
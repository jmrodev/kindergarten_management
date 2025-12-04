import React from 'react';
import { normalizeName } from '../../utils/apiResponseHandler';
// Removed local CSS import since we're using global atomic styles

const Input = ({
  label,
  name,
  value = '',
  onChange,
  type = 'text',
  placeholder = '',
  required = false,
  error = null,
  helpText = '',
  disabled = false,
  className = '',
  pattern,
  title,
  normalize = false,
  ...props
}) => {
  // Manejador de cambio que puede normalizar el nombre si es necesario
  const handleChange = (e) => {
    let processedValue = e.target.value;

    if (normalize && ['first_name', 'paternal_surname', 'maternal_surname', 'nickname_optional'].includes(name)) {
      processedValue = normalizeName(processedValue);
    }

    if (onChange) {
      onChange({
        ...e,
        target: {
          ...e.target,
          name,
          value: processedValue
        }
      });
    }
  };

  // Determinar si el campo tiene contenido para aplicar clases CSS
  const hasValue = value.trim() !== '';
  const inputFieldClass = [
    'input-field',
    error ? 'error' : '',
    hasValue ? 'filled' : (required && !hasValue ? 'empty' : ''),
  ].filter(Boolean).join(' ');

  return (
    <div className={`input-container ${className}`.trim()}>
      {label && (
        <label htmlFor={name} className={`input-label ${required ? 'required' : ''}`}>
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        pattern={pattern}
        title={title}
        className={`${inputFieldClass} ${className}`.trim()}
        {...props}
      />
      {error && <div className="input-error">{error}</div>}
      {helpText && !error && <div className="input-help">{helpText}</div>}
    </div>
  );
};

export default Input;
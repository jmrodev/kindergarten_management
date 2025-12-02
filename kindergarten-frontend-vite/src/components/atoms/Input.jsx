import React from 'react';
import { normalizeName } from '../../utils/apiResponseHandler';

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

  const inputClass = `form-input ${error ? 'form-input-error' : ''} ${className}`.trim();
  const labelClass = `form-label ${required ? 'form-label-required' : ''}`;

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name} className={labelClass}>
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
        className={inputClass}
        {...props}
      />
      {error && <div className="form-error">{error}</div>}
      {helpText && !error && <div className="form-help">{helpText}</div>}
    </div>
  );
};

export default Input;
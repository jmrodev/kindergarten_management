import React from 'react';
// Removed local CSS import since we're using global atomic styles

const TextArea = ({
  label,
  name,
  value = '',
  onChange,
  required = false,
  error = null,
  helpText = '',
  disabled = false,
  placeholder = '',
  rows = 3,
  className = '',
  ...props
}) => {
  // Determinar si el campo tiene contenido para aplicar clases CSS
  const hasValue = value.trim() !== '';
  const textareaFieldClass = [
    'textarea-field',
    error ? 'error' : '',
    hasValue ? 'filled' : (required && !hasValue ? 'empty' : ''),
  ].filter(Boolean).join(' ');

  return (
    <div className={`textarea-container ${className}`.trim()}>
      {label && (
        <label htmlFor={name} className={`textarea-label ${required ? 'required' : ''}`}>
          {label}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        rows={rows}
        className={`${textareaFieldClass} ${className}`.trim()}
        {...props}
      />
      {error && <div className="textarea-error">{error}</div>}
      {helpText && !error && <div className="textarea-help">{helpText}</div>}
    </div>
  );
};

export default TextArea;
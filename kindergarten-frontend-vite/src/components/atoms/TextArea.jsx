import React from 'react';

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
  const textAreaClass = `form-textarea ${error ? 'form-textarea-error' : ''} ${className}`.trim();
  const labelClass = `form-label ${required ? 'form-label-required' : ''}`;

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name} className={labelClass}>
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
        className={textAreaClass}
        {...props}
      />
      {error && <div className="form-error">{error}</div>}
      {helpText && !error && <div className="form-help">{helpText}</div>}
    </div>
  );
};

export default TextArea;
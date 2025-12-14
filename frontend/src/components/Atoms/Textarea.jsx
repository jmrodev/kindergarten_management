import './atoms.css';

const Textarea = ({ label, id, placeholder, value, onChange, error, required = false, disabled = false, rows = 3, className = '', ...props }) => {
  const baseClasses = 'textarea-field';
  const errorClass = error ? 'textarea-error' : '';
  const disabledClass = disabled ? 'textarea-disabled' : '';
  const requiredClass = required ? 'textarea-required' : '';
  const customClasses = className;

  const textareaClasses = [
    baseClasses,
    errorClass,
    disabledClass,
    requiredClass,
    customClasses
  ].filter(Boolean).join(' ');

  return (
    <div className="textarea-container">
      {label && (
        <label htmlFor={id} className="textarea-label">
          {label} {required && <span className="required-indicator">*</span>}
        </label>
      )}
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        rows={rows}
        className={textareaClasses}
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default Textarea;
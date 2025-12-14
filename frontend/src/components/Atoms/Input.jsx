import './atoms.css';

const Input = ({ label, id, type = 'text', placeholder, value, onChange, error, required = false, disabled = false, className = '', ...props }) => {
  const baseClasses = 'input-field';
  const errorClass = error ? 'input-error' : '';
  const disabledClass = disabled ? 'input-disabled' : '';
  const requiredClass = required ? 'input-required' : '';
  const customClasses = className;

  const inputClasses = [
    baseClasses,
    errorClass,
    disabledClass,
    requiredClass,
    customClasses
  ].filter(Boolean).join(' ');

  return (
    <div className="input-container">
      {label && (
        <label htmlFor={id} className="input-label">
          {label} {required && <span className="required-indicator">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={inputClasses}
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default Input;
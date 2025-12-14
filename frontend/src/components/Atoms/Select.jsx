import './atoms.css';

const Select = ({ label, id, options = [], value, onChange, error, required = false, disabled = false, placeholder, className = '', ...props }) => {
  const baseClasses = 'select-field';
  const errorClass = error ? 'select-error' : '';
  const disabledClass = disabled ? 'select-disabled' : '';
  const requiredClass = required ? 'select-required' : '';
  const customClasses = className;

  const selectClasses = [
    baseClasses,
    errorClass,
    disabledClass,
    requiredClass,
    customClasses
  ].filter(Boolean).join(' ');

  return (
    <div className="select-container">
      {label && (
        <label htmlFor={id} className="select-label">
          {label} {required && <span className="required-indicator">*</span>}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={selectClasses}
        {...props}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default Select;
import './atoms.css';

const Checkbox = ({ label, id, checked, onChange, disabled = false, required = false, className = '', ...props }) => {
  const baseClasses = 'checkbox-input';
  const disabledClass = disabled ? 'checkbox-disabled' : '';
  const requiredClass = required ? 'checkbox-required' : '';
  const customClasses = className;

  const checkboxClasses = [
    baseClasses,
    disabledClass,
    requiredClass,
    customClasses
  ].filter(Boolean).join(' ');

  return (
    <div className="checkbox-container">
      <label className="checkbox-label">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={checkboxClasses}
          {...props}
        />
        <span className="checkbox-display"></span>
        {label}
        {required && <span className="required-indicator">*</span>}
      </label>
    </div>
  );
};

export default Checkbox;
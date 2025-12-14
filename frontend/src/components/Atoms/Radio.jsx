import './atoms.css';

const Radio = ({ label, id, name, value, checked, onChange, disabled = false, required = false, className = '', ...props }) => {
  const baseClasses = 'radio-input';
  const disabledClass = disabled ? 'radio-disabled' : '';
  const requiredClass = required ? 'radio-required' : '';
  const customClasses = className;

  const radioClasses = [
    baseClasses,
    disabledClass,
    requiredClass,
    customClasses
  ].filter(Boolean).join(' ');

  return (
    <div className="radio-container">
      <label className="radio-label">
        <input
          id={id}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={radioClasses}
          {...props}
        />
        <span className="radio-display"></span>
        {label}
        {required && <span className="required-indicator">*</span>}
      </label>
    </div>
  );
};

export default Radio;
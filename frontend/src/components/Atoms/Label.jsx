import './atoms.css';

const Label = ({ children, htmlFor, required = false, className = '', ...props }) => {
  const baseClasses = 'label';
  const requiredClass = required ? 'label-required' : '';
  const customClasses = className;

  const labelClasses = [
    baseClasses,
    requiredClass,
    customClasses
  ].filter(Boolean).join(' ');

  return (
    <label htmlFor={htmlFor} className={labelClasses} {...props}>
      {children}
      {required && <span className="required-indicator">*</span>}
    </label>
  );
};

export default Label;
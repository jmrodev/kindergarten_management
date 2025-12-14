import './atoms.css';

const Button = ({ children, variant = 'primary', size = 'medium', onClick, disabled = false, className = '', ...props }) => {
  const baseClasses = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const disabledClass = disabled ? 'btn-disabled' : '';
  const customClasses = className;

  const buttonClasses = [
    baseClasses,
    variantClass,
    sizeClass,
    disabledClass,
    customClasses
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
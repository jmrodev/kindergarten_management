import './molecules.css';

const FormGroup = ({ children, className = '', ...props }) => {
  const baseClasses = 'form-group';
  const customClasses = className;

  const groupClasses = [
    baseClasses,
    customClasses
  ].filter(Boolean).join(' ');

  return (
    <div className={groupClasses} {...props}>
      {children}
    </div>
  );
};

export default FormGroup;
import './molecules.css';
import Text from '../Atoms/Text';

const FormContainer = ({ children, title, className = '', ...props }) => {
  const baseClasses = 'form-container';
  const customClasses = className;

  const containerClasses = [
    baseClasses,
    customClasses
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} {...props}>
      {title && <Text variant="h2" className="form-title">{title}</Text>}
      {children}
    </div>
  );
};

export default FormContainer;
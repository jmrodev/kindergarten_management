import Card from './Card';
import './atoms.css';

const LoginCard = ({ title = 'Iniciar Sesión', children, className = '', ...props }) => {
  const baseClasses = 'login-card';
  const customClasses = className;

  const cardClasses = [
    baseClasses,
    customClasses
  ].filter(Boolean).join(' ');

  return (
    <Card title={title} className={cardClasses} {...props}>
      {children}
    </Card>
  );
};

export default LoginCard;
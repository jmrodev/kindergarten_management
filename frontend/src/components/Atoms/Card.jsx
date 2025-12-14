import './atoms.css';
import Text from './Text';

const Card = ({ children, title, className = '', ...props }) => {
  const baseClasses = 'card';
  const customClasses = className;

  const cardClasses = [
    baseClasses,
    customClasses
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} {...props}>
      {title && <Text variant="h3" className="card-title">{title}</Text>}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default Card;
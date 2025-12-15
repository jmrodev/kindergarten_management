import Card from '../Atoms/Card';
import Text from '../Atoms/Text';
import Button from '../Atoms/Button';
import './molecules.css';

const MobileCardSection = ({ title, children, onAdd, showAdd = true }) => {
  return (
    <Card className="mobile-card-section">
      <div className="mobile-section-header">
        <Text variant="h2">{title}</Text>
        {showAdd && onAdd && (
          <Button variant="primary" size="small" onClick={onAdd}>
            Agregar
          </Button>
        )}
      </div>
      <div className="mobile-section-content">
        {children}
      </div>
    </Card>
  );
};

export default MobileCardSection;
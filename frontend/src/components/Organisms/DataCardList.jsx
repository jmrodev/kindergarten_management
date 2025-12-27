import Card from '../Atoms/Card';
import Text from '../Atoms/Text';
import Modal from '../Atoms/Modal';
import './organisms.css';

import { useState } from 'react';

const DataCardList = ({
  items,
  title,
  fields,
  onEdit,
  onDelete,
  onAdd,
  onItemSelect, // Nueva prop para manejar la selección de ítems
  renderActions = true,
  itemTitleKey = 'name',
  itemSubtitleKey = null, // Nueva prop para subtítulo opcional
  showHeader = true,
}) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleCardClick = (item) => {
    if (onItemSelect) {
      onItemSelect(item);
    } else {
      // Si no hay onItemSelect, mostrar detalle en modal
      setSelectedItem(item);
    }
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <>
      <Card className="data-card-container">
        {showHeader && (
          <div className="data-card-header">
            <Text variant="h1">{title}</Text>
          </div>
        )}

        <div className="data-card-list">
          {items && items.map((item, index) => (
            <Card
              key={item.id || index}
              className="data-card-item"
              onClick={() => handleCardClick(item)}
            >
              <div className="data-card-content">
                <div className="data-card-header-row">
                  <div className="data-card-title-section">
                    <Text variant="h3" className="data-card-title">
                      {item[itemTitleKey] || `Ítem ${index + 1}`}
                    </Text>
                    {itemSubtitleKey && (
                      <div className="data-card-subtitle">
                        {item[itemSubtitleKey]}
                      </div>
                    )}
                  </div>
                  {/* Summary fields */}
                  <div className="data-card-fields summary-only">
                    {fields && fields.slice(0, 3).map((field, idx) => {
                      const value = field.valueFn ? field.valueFn(item) : item[field.key];
                      if (field.key === 'status') {
                        return (
                          <div key={idx} className="data-card-field">
                            <span className="field-label">{field.label}:</span>
                            <span className={`status-badge status-${(value || 'pendiente').toLowerCase()}`}>{value || 'N/A'}</span>
                          </div>
                        );
                      }
                      return (
                        <div key={idx} className="data-card-field">
                          <span className="field-label">{field.label}:</span>
                          <span className="field-value">{value || 'N/A'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Modal para mostrar el detalle */}
      {selectedItem && (
        <Modal
          isOpen={!!selectedItem}
          onClose={closeModal}
          title={`Detalle - ${selectedItem[itemTitleKey] || 'Elemento'}`}
        >
          <div className="data-card-detail-modal">
            <div className="data-card-fields">
              {fields && fields.map((field, idx) => {
                const rawValue = field.valueFn ? field.valueFn(selectedItem) : selectedItem[field.key];
                const value = rawValue || '';

                let renderedValue = value;
                if (field.type === 'phone' && value) {
                  renderedValue = (<a href={`tel:${value}`} className="link-field">{value}</a>);
                } else if (field.type === 'email' && value) {
                  renderedValue = (<a href={`mailto:${value}`} className="link-field">{value}</a>);
                }

                return (
                  <div key={idx} className="data-card-field">
                    <span className="field-label">{field.label}:</span>
                    <span className="field-value">{renderedValue || 'N/A'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default DataCardList;
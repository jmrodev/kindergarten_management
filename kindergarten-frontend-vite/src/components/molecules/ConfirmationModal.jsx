import React from 'react';
import Modal from './Modal'; // Use our custom modal
import Button from '../atoms/Button';

const ConfirmationModal = ({ 
  show, 
  onHide, 
  onConfirm, 
  title = "Confirmar Acción",
  message = "¿Está seguro de que desea continuar?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger" // 'danger', 'warning', 'info', etc.
}) => {
  const handleConfirm = () => {
    onConfirm();
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} title={title}>
      <div className="confirmation-modal-body">
        <p>{message}</p>
        <div className="confirmation-modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
          <Button 
            variant="secondary" 
            onClick={onHide}
            type="button"
          >
            {cancelText}
          </Button>
          <Button 
            variant={variant} 
            onClick={handleConfirm}
            type="button"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
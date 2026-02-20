import { useEffect } from 'react';
import '../Atoms/atoms.css';

// Global counter to handle nested modals
let openModalsCount = 0;

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      openModalsCount++;
      document.body.style.overflow = 'hidden';
      // Optional: prevents layout shift
      document.body.style.paddingRight = 'var(--scrollbar-width, 0px)';

      return () => {
        openModalsCount--;
        if (openModalsCount === 0) {
          document.body.style.overflow = 'unset';
          document.body.style.paddingRight = '0px';
        }
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const sizeClasses = {
    sm: 'modal-sm',
    md: 'modal-md',
    lg: 'modal-lg',
    xl: 'modal-xl'
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className={`modal ${sizeClasses[size]}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h4 className="modal-title">{title}</h4>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">
            &times;
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
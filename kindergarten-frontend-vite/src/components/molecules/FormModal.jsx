import React, { useEffect } from 'react';
import { X } from 'react-bootstrap-icons';

const FormModal = ({ show, onHide, title, children, size = 'md', footer = null }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onHide();
      }
    };

    if (show) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset'; // Restore scrolling
    };
  }, [show, onHide]);

  if (!show) return null;

  const sizeClasses = {
    sm: 'modal-sm',
    md: 'modal-md', 
    lg: 'modal-lg',
    xl: 'modal-xl'
  };

  return (
    <div className="modal-backdrop" onClick={onHide}>
      <div 
        className={`modal-content ${sizeClasses[size] || sizeClasses.md}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h5 className="modal-title">{title}</h5>
          <button 
            className="modal-close-button" 
            onClick={onHide}
            type="button"
          >
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1050;
        }
        
        .modal-content {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          max-height: 90vh;
          overflow-y: auto;
          width: 90%;
          max-width: 800px; /* Default to medium-large size */
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e9ecef;
        }
        
        .modal-title {
          margin: 0;
          font-size: 1.25rem;
        }
        
        .modal-close-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
        }
        
        .modal-close-button:hover {
          background-color: #f8f9fa;
        }
        
        .modal-body {
          padding: 1.5rem;
          flex: 1;
          overflow-y: auto;
        }
        
        .modal-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid #e9ecef;
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
        }
        
        .modal-sm { max-width: 300px; }
        .modal-md { max-width: 500px; }
        .modal-lg { max-width: 800px; }
        .modal-xl { max-width: 1140px; }
      `}</style>
    </div>
  );
};

export default FormModal;
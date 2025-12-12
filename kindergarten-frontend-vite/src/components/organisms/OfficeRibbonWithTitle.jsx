import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X } from 'react-bootstrap-icons';

const OfficeRibbonWithTitle = ({
  title,
  menuItems = [],
  showCloseButton = true,
  showTitle = true, // Added prop to control title visibility
  onClose = null,
  navigate = null, // Accept navigate as a prop
  className = '',
  backPath = null // Optional back path for context-aware navigation
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const navigateLocal = useNavigate(); // Use navigate from this component if not provided
  const effectiveNavigate = navigate || navigateLocal;

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (backPath) {
      // Navigate to the specified back path if provided
      effectiveNavigate(backPath);
    } else {
      // Default to dashboard
      effectiveNavigate('/dashboard');
    }
  };

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleItemClick = (onClick) => {
    setIsMenuOpen(false); // Close menu after clicking an item
    if (onClick) {
      onClick();
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuButtonRef.current && !menuButtonRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Calculate dropdown position
  const getPosition = () => {
    if (menuButtonRef.current) {
      const rect = menuButtonRef.current.getBoundingClientRect();
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;

      return {
        top: rect.bottom + scrollY,
        left: rect.left + scrollX,
      };
    }
    return { top: 0, left: 0 };
  };

  return (
    <>
      <div className={`office-ribbon-container ${className}`}>
        <div className="office-ribbon-content">
          <div className="office-menu-section">
            {menuItems.length > 0 ? (
              <>
              <button
                ref={menuButtonRef}
                className={`office-menu-button ${isMenuOpen ? 'active' : ''}`}
                type="button"
                onClick={handleMenuToggle}
              >
                Archivo
              </button>
              </>
            ) : null}
            {showTitle && (
              <h5 className="office-title-text">{title}</h5>
            )}
          </div>
          {showCloseButton && (
            <button
              className="office-close-button"
              onClick={handleClose}
              title="Cerrar y volver al dashboard"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {isMenuOpen && menuItems.length > 0 && createPortal(
        <ul
          className="office-dropdown-menu show"
          style={{
            position: 'fixed',
            top: `${getPosition().top}px`,
            left: `${getPosition().left}px`,
            zIndex: 9999,
            margin: 0,
            minWidth: '120px',
            maxWidth: '200px',
          }}
        >
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                className="office-dropdown-item"
                onClick={() => handleItemClick(item.onClick)}
                type="button"
              >
                <div className="office-dropdown-item-content">
                  {item.icon && <span className="office-dropdown-item-icon">{item.icon}</span>}
                  <span className="office-dropdown-item-text">{item.label}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>,
        document.body
      )}
    </>
  );
};

export default OfficeRibbonWithTitle;

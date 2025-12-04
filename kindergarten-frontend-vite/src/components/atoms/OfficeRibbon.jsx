import React from 'react';

// These components are kept for backward compatibility
// New development should use OfficeRibbonWithTitle instead
const OfficeMenuButton = ({ children, onClick, className = '', ...props }) => {
  const baseClasses = `btn btn-sm office-menu-button`;
  const combinedClasses = `${baseClasses} ${className}`.trim();

  return (
    <button
      className={combinedClasses}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};

const OfficeDropdownItem = ({ children, onClick, className = '', ...props }) => {
  const baseClasses = 'office-dropdown-item';
  const combinedClasses = `${baseClasses} ${className}`.trim();

  return (
    <button
      className={combinedClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const OfficeDropdownMenu = ({ children, className = '', ...props }) => {
  const baseClasses = `office-dropdown-menu`;
  const combinedClasses = `${baseClasses} ${className}`.trim();

  return (
    <ul
      className={combinedClasses}
      {...props}
    >
      {children}
    </ul>
  );
};

// Export for backward compatibility
export { OfficeMenuButton, OfficeDropdownItem, OfficeDropdownMenu };
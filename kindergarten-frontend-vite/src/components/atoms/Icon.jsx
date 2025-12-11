import React from 'react';

const Icon = ({ 
  type, 
  size = 16, 
  color = 'currentColor', 
  className = '', 
  onClick,
  title,
  ...props 
}) => {
  const getIconPath = () => {
    switch (type) {
      case 'edit':
        return 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z';
      case 'view':
        return 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z';
      case 'delete':
        return 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z';
      default:
        return '';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'edit':
        return 'var(--primary-color)';
      case 'view':
        return 'var(--info-color)';
      case 'delete':
        return 'var(--danger-color)';
      default:
        return color;
    }
  };

  const iconPath = getIconPath();
  const iconColor = getIconColor();

  if (!iconPath) {
    return null;
  }

  const iconClass = `office-icon ${onClick ? 'clickable' : ''} ${className}`.trim();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={iconClass}
      onClick={onClick}
      title={title}
      {...props}
    >
      <path d={iconPath} fill={iconColor} />
    </svg>
  );
};

export default Icon;
import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  style = {},
  ...props 
}) => {
  const getVariantClass = () => {
    switch(variant) {
      case 'primary':
        return 'custom-btn-primary';
      case 'secondary':
        return 'custom-btn-secondary';
      case 'success':
        return 'custom-btn-success';
      case 'danger':
        return 'custom-btn-danger';
      case 'warning':
        return 'custom-btn-warning';
      case 'info':
        return 'custom-btn-info';
      case 'light':
        return 'custom-btn-light';
      case 'dark':
        return 'custom-btn-dark';
      case 'outline-primary':
        return 'custom-btn-outline-primary';
      case 'outline-secondary':
        return 'custom-btn-outline-secondary';
      case 'outline-success':
        return 'custom-btn-outline-success';
      case 'outline-danger':
        return 'custom-btn-outline-danger';
      case 'outline-warning':
        return 'custom-btn-outline-warning';
      case 'outline-info':
        return 'custom-btn-outline-info';
      case 'outline-light':
        return 'custom-btn-outline-light';
      case 'outline-dark':
        return 'custom-btn-outline-dark';
      default:
        return 'custom-btn-primary';
    }
  };

  const getSizeClass = () => {
    switch(size) {
      case 'sm':
        return 'custom-btn-sm';
      case 'lg':
        return 'custom-btn-lg';
      default:
        return 'custom-btn-md';
    }
  };

  const buttonClass = `custom-btn ${getVariantClass()} ${getSizeClass()} ${className}`.trim();
  
  return (
    <button
      className={buttonClass}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
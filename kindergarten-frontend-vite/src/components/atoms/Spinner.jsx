import React from 'react';

const Spinner = ({ 
  animation = 'border', 
  size, 
  className = '', 
  style = {},
  ...props 
}) => {
  const spinnerClass = `custom-spinner ${animation === 'border' ? 'custom-spinner-border' : ''} ${size === 'sm' ? 'custom-spinner-sm' : ''} ${className}`.trim();
  
  if (animation === 'border') {
    return (
      <span
        className={spinnerClass}
        {...props}
      />
    );
  }

  return (
    <span
      className={spinnerClass}
      {...props}
    />
  );
};

export default Spinner;
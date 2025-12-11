import React from 'react';

const Container = ({ 
  children, 
  fluid = false, 
  className = '', 
  style = {},
  ...props 
}) => {
  const containerClass = `custom-container ${fluid ? 'custom-container-fluid' : ''} ${className}`.trim();
  
  return (
    <div
      className={containerClass}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
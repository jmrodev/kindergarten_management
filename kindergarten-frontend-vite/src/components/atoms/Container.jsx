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
      style={{
        width: '100%',
        paddingRight: '15px',
        paddingLeft: '15px',
        marginRight: 'auto',
        marginLeft: 'auto',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
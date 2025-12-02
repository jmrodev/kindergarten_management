import React from 'react';

const Spinner = ({ 
  animation = 'border', 
  size, 
  className = '', 
  style = {},
  ...props 
}) => {
  const spinnerClass = `custom-spinner ${animation === 'border' ? 'custom-spinner-border' : ''} ${size === 'sm' ? 'custom-spinner-sm' : ''} ${className}`.trim();
  
  const spinnerStyle = {
    display: 'inline-block',
    verticalAlign: 'text-bottom',
    width: size === 'sm' ? '1rem' : '2rem',
    height: size === 'sm' ? '1rem' : '2rem',
    ...style
  };

  if (animation === 'border') {
    return (
      <span 
        className={spinnerClass} 
        style={{
          ...spinnerStyle,
          border: '0.25em solid currentColor',
          borderRightColor: 'transparent',
          borderRadius: '50%'
        }}
        {...props}
      />
    );
  }

  return (
    <span 
      className={spinnerClass} 
      style={spinnerStyle}
      {...props}
    />
  );
};

export default Spinner;
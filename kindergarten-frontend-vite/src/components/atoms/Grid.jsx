import React from 'react';

const Row = ({ 
  children, 
  className = '', 
  style = {},
  ...props 
}) => {
  const rowClass = `custom-row ${className}`.trim();
  
  return (
    <div 
      className={rowClass} 
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        marginRight: '-15px',
        marginLeft: '-15px',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};

const Col = ({ 
  children, 
  xs, 
  sm, 
  md, 
  lg, 
  xl, 
  className = '', 
  style = {},
  ...props 
}) => {
  const getFlexValue = (size) => {
    if (size === 'auto') return '0 0 auto';
    if (typeof size === 'number') return `0 0 ${(size / 12) * 100}%`;
    return '1 1 0%';
  };

  const getColClass = () => {
    const baseClass = `custom-col`;
    const sizeClasses = [];

    if (xs !== undefined) sizeClasses.push(`custom-col-xs-${xs}`);
    if (sm !== undefined) sizeClasses.push(`custom-col-sm-${sm}`);
    if (md !== undefined) sizeClasses.push(`custom-col-md-${md}`);
    if (lg !== undefined) sizeClasses.push(`custom-col-lg-${lg}`);
    if (xl !== undefined) sizeClasses.push(`custom-col-xl-${xl}`);

    return `${baseClass} ${sizeClasses.join(' ')} ${className}`.trim();
  };

  const colClass = getColClass();
  
  return (
    <div 
      className={colClass} 
      style={{
        position: 'relative',
        width: '100%',
        paddingRight: '15px',
        paddingLeft: '15px',
        flex: getFlexValue(xs),
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export { Row, Col };
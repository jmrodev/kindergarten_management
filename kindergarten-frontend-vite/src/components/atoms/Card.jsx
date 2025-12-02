import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  style = {},
  ...props 
}) => {
  const cardClass = `custom-card ${className}`.trim();
  
  return (
    <div 
      className={cardClass} 
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        minWidth: '0',
        wordWrap: 'break-word',
        backgroundColor: 'var(--office-white)',
        backgroundClip: 'border-box',
        border: '1px solid var(--pastel-border)',
        borderRadius: '0.5rem',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ 
  children, 
  className = '', 
  style = {},
  ...props 
}) => {
  const headerClass = `custom-card-header ${className}`.trim();
  
  return (
    <div 
      className={headerClass} 
      style={{
        padding: '0.75rem 1.25rem',
        marginBottom: '0',
        backgroundColor: 'var(--pastel-header)',
        borderBottom: '1px solid var(--pastel-border)',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};

const CardBody = ({ 
  children, 
  className = '', 
  style = {},
  ...props 
}) => {
  const bodyClass = `custom-card-body ${className}`.trim();
  
  return (
    <div 
      className={bodyClass} 
      style={{
        flex: '1 1 auto',
        padding: '1.25rem',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;

export default Card;
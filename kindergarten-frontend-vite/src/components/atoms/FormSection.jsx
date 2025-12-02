import React from 'react';

const FormSection = ({ 
  title, 
  subtitle, 
  children, 
  className = '',
  style = {},
  ...props 
}) => {
  const sectionClass = `form-section ${className}`.trim();
  
  return (
    <div className={sectionClass} style={style} {...props}>
      {(title || subtitle) && (
        <div className="form-section-header">
          {title && <h3 className="form-section-title">{title}</h3>}
          {subtitle && <p className="form-section-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="form-section-content">
        {children}
      </div>
    </div>
  );
};

export default FormSection;
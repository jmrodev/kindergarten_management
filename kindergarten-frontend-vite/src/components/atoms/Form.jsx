import React, { useState, useCallback } from 'react';
import { StudentFormValidator } from '../../utils/formValidation';
import Card from '../atoms/Card';

const Form = ({ 
  children, 
  onSubmit, 
  validationSchema = null, 
  className = '',
  title,
  subtitle,
  submitText = 'Submit',
  loading = false,
  disabled = false,
  ...props 
}) => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({});

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Validar datos si hay esquema de validación
    if (validationSchema) {
      const validationErrors = validationSchema(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      } else {
        setErrors({});
      }
    }

    // Ejecutar el submit
    if (onSubmit) {
      onSubmit(formData, e);
    }
  }, [formData, onSubmit, validationSchema]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpiar error cuando se cambia el campo
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const formClass = `custom-form ${className}`.trim();

  return (
    <form onSubmit={handleSubmit} className={formClass} noValidate {...props}>
      <Card>
        {(title || subtitle) && (
          <Card.Header>
            {title && <h2>{title}</h2>}
            {subtitle && <p>{subtitle}</p>}
          </Card.Header>
        )}
        <Card.Body>
          {React.Children.map(children, (child) => {
            return React.isValidElement(child) 
              ? React.cloneElement(child, { 
                  onChange: handleChange,
                  errors,
                  setErrors
                })
              : child;
          })}
        </Card.Body>
        {onSubmit && (
          <Card.Body className="form-footer">
            <button 
              type="submit" 
              disabled={loading || disabled}
              className="form-submit-btn"
            >
              {loading ? 'Cargando...' : submitText}
            </button>
          </Card.Body>
        )}
      </Card>
    </form>
  );
};

export default Form;
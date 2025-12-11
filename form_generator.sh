#!/bin/bash
# Script para generar automáticamente secciones de formulario basado en una definición
# Este script toma un archivo de definición de formulario y genera componentes React paginados

# El script puede tomar como entrada un archivo JSON que define las secciones del formulario
# y generar automáticamente los archivos de componente React correspondientes

echo "Generador Automático de Formulario Paginado"
echo "==========================================="

# Crear un ejemplo de definición de formulario
cat > student_form_definition.json << 'EOF'
{
  "formName": "StudentForm",
  "sections": [
    {
      "id": "personal",
      "title": "Información Personal",
      "subtitle": "Información básica del alumno",
      "fields": [
        {
          "name": "first_name",
          "label": "Nombre(s) *",
          "type": "text",
          "required": true,
          "normalize": true
        },
        {
          "name": "paternal_surname",
          "label": "Apellido Paterno *",
          "type": "text",
          "required": true,
          "normalize": true
        },
        {
          "name": "birth_date",
          "label": "Fecha de Nacimiento *",
          "type": "date",
          "required": true
        }
      ]
    },
    {
      "id": "medical",
      "title": "Información Médica",
      "subtitle": "Datos médicos importantes del alumno",
      "fields": [
        {
          "name": "blood_type",
          "label": "Tipo de Sangre",
          "type": "select",
          "options": [
            {"value": "A+", "label": "A+"},
            {"value": "O-", "label": "O-"}
          ]
        },
        {
          "name": "allergies",
          "label": "Alergias",
          "type": "textarea"
        }
      ]
    }
  ]
}
EOF

echo "Archivo de definición de formulario creado: student_form_definition.json"
echo ""
echo "Este archivo puede ser usado como entrada para:"
echo "- Validar estructura de formulario"
echo "- Generar componentes de formulario automáticamente"
echo "- Documentar campos requeridos por sección"
echo "- Crear formularios dinámicos basados en configuración"

# Mostrar el contenido del archivo
echo ""
echo "Contenido del archivo de definición:"
echo "------------------------------------"
cat student_form_definition.json

# Script para generar formularios basado en definiciones
cat > generate_form.js << 'SCRIPT'
const fs = require('fs');

// Función para generar un componente React basado en una definición
function generateReactComponent(definition) {
  const { formName, sections } = definition;
  
  // Generar imports
  const imports = `import React, { useState, useCallback } from 'react';
import { Row, Col } from '../atoms/Grid';
import Card from '../atoms/Card';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Select from '../atoms/Select';
import TextArea from '../atoms/TextArea';
import Toggle from '../atoms/Toggle';
import Spinner from '../atoms/Spinner';
import { normalizeName } from '../../utils/apiResponseHandler';
import './${formName}.css';`;

  // Generar el componente
  const component = `
// Componente generado automáticamente para ${formName}
const ${formName} = ({ 
  initialData = {}, 
  onSubmit, 
  onCancel, 
  readOnly = false,
  submitButtonText = "Guardar",
  loading = false,
  error = null
}) => {
  // Definir las secciones del formulario desde la definición
  const [sections] = useState(${JSON.stringify(sections, null, 2)});
  
  const [currentPage, setCurrentPage] = useState(0);
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  // Manejar cambio en campos
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    let processedValue = type === 'checkbox' ? checked : value;
    
    // Normalizar nombres si es necesario
    const currentSection = sections.find(s => 
      s.fields.some(f => f.name === name)
    );
    
    if (currentSection?.normalize && ['first_name', 'paternal_surname', 'maternal_surname', 'nickname_optional'].includes(name)) {
      processedValue = normalizeName(processedValue);
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Limpiar error cuando se cambia el campo
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors, sections]);

  // Validar sección actual
  const validateCurrentSection = () => {
    const currentSection = sections[currentPage];
    const newErrors = {};
    
    currentSection.fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = 'Este campo es requerido';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navegar a la siguiente sección
  const goToNextSection = () => {
    if (validateCurrentSection()) {
      if (currentPage < sections.length - 1) {
        setCurrentPage(prev => prev + 1);
      }
    }
  };

  // Navegar a la sección anterior
  const goToPreviousSection = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateCurrentSection()) {
      onSubmit(formData);
    }
  };

  const currentSection = sections[currentPage];
  const isLastPage = currentPage === sections.length - 1;
  const isFirstPage = currentPage === 0;

  return (
    <Card className="student-form-card">
      <Card.Body>
        <div className="form-header">
          <h3 className="form-title">{currentSection.title}</h3>
          <div className="form-progress">
            <span className="form-progress-text">
              Página {{currentPage + 1}} de {{sections.length}}
            </span>
          </div>
        </div>
        
        <p className="form-subtitle">{currentSection.subtitle}</p>

        {error && (
          <div className="alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="student-form">
          <Row className="form-row">
            {currentSection.fields.map((field) => (
              <Col key={field.name} className={field.type === 'textarea' ? 'col-12' : 'col-md-6'}>
                {field.type === 'checkbox' ? (
                  <Toggle
                    label={field.label}
                    name={field.name}
                    checked={formData[field.name] || false}
                    onChange={handleChange}
                    disabled={readOnly || loading}
                  />
                ) : field.type === 'textarea' ? (
                  <TextArea
                    label={field.label}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    error={errors[field.name]}
                    disabled={readOnly || loading}
                    rows={3}
                  />
                ) : field.type === 'select' ? (
                  <Select
                    label={field.label}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    options={field.options || []}
                    error={errors[field.name]}
                    disabled={readOnly || loading}
                  />
                ) : (
                  <Input
                    label={field.label}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    error={errors[field.name]}
                    type={field.type}
                    disabled={readOnly || loading}
                    required={field.required}
                  />
                )}
              </Col>
            ))}
          </Row>

          <div className="form-navigation">
            <Button
              variant="secondary"
              onClick={isFirstPage ? onCancel : goToPreviousSection}
              disabled={loading}
              className="nav-button prev-button"
            >
              {isFirstPage ? 'Cancelar' : 'Anterior'}
            </Button>
            
            {isLastPage ? (
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="nav-button submit-button"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="button-text">{submitButtonText}...</span>
                  </>
                ) : (
                  <span className="button-text">{submitButtonText}</span>
                )}
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={goToNextSection}
                disabled={loading}
                className="nav-button next-button"
              >
                <span className="button-text">Siguiente</span>
              </Button>
            )}
          </div>
        </form>
      </Card.Body>
    </Card>
  );
};

export default ${formName};
`;

  return { imports, component };
}

// Si se proporciona un archivo de definición, generarlo
if (process.argv[2]) {
  const definitionFile = process.argv[2];
  const definition = JSON.parse(fs.readFileSync(definitionFile, 'utf8'));
  const { imports, component } = generateReactComponent(definition);
  
  // Escribir el archivo de componente generado
  fs.writeFileSync(`${definition.formName}.jsx`, imports + component);
  console.log(`Componente generado: ${definition.formName}.jsx`);
}
`;

echo ""
echo "Script de generación creado: generate_form.js"
echo "Este script puede leer archivos de definición JSON y generar componentes React automáticamente"
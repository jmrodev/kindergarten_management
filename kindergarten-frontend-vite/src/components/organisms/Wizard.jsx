import React, { useState } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { ArrowLeft, ArrowRight, Check } from 'react-bootstrap-icons';

const Wizard = ({ steps, initialValues = {}, onSubmit, onCancel, submitButtonText = "Guardar" }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialValues);

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepChange = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const StepComponent = steps[currentStep].component;

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h4>{steps[currentStep].title}</h4>
        <div className="d-flex">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`step-indicator mx-1 d-flex align-items-center justify-content-center rounded-circle ${
                index === currentStep ? 'current' : index < currentStep ? 'completed' : 'pending'
              }`}
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: index === currentStep ? '#007bff' : index < currentStep ? '#28a745' : '#dee2e6',
                color: index <= currentStep ? 'white' : '#6c757d',
                fontSize: '12px',
                cursor: index < currentStep ? 'pointer' : 'default'
              }}
              onClick={() => index < currentStep && handleStepChange(index)}
            >
              {index < currentStep ? <Check size={14} /> : index + 1}
            </div>
          ))}
        </div>
      </Card.Header>
      <Card.Body>
        <StepComponent 
          data={formData} 
          onChange={handleInputChange} 
          errors={null} // Se puede pasar desde el componente padre si se implementa validación
        />
      </Card.Body>
      <Card.Footer className="d-flex justify-content-between">
        <Button 
          variant="secondary" 
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <div className="d-flex gap-2">
          {!isFirstStep && (
            <Button 
              variant="outline-secondary" 
              onClick={handlePrevious}
            >
              <ArrowLeft size={16} className="me-1" />
              Anterior
            </Button>
          )}
          {!isLastStep ? (
            <Button 
              variant="primary" 
              onClick={handleNext}
            >
              Siguiente
              <ArrowRight size={16} className="ms-1" />
            </Button>
          ) : (
            <Button 
              variant="success" 
              onClick={handleSubmit}
            >
              <Check size={16} className="me-1" />
              {submitButtonText}
            </Button>
          )}
        </div>
      </Card.Footer>
    </Card>
  );
};

export default Wizard;
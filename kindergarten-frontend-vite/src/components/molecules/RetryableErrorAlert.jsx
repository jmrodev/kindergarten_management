import React from 'react';
import Button from '../atoms/Button';
import { Col } from '../atoms/Grid'; // Assuming Col is used for layout within the alert

const RetryableErrorAlert = ({ message, onRetry, onClose }) => {
  return (
    <Col>
      <div className="alert alert-danger d-flex justify-content-between align-items-center">
        <div>{message}</div>
        <div>
          {onRetry && (
            <Button variant="outline-light" onClick={onRetry} className="me-2">
              Reintentar
            </Button>
          )}
          {onClose && (
            <Button variant="outline-secondary" onClick={onClose}>
              Cerrar
            </Button>
          )}
        </div>
      </div>
    </Col>
  );
};

export default RetryableErrorAlert;

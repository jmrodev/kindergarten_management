import React from 'react';
import { Col } from '../atoms/Grid';
import Card from '../atoms/Card';

const FeatureCardWrapper = ({ children }) => {
  return (
    <Col md={4}>
      <Card className="h-100">
        <Card.Body className="d-flex flex-column justify-content-center">
          {children}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default FeatureCardWrapper;

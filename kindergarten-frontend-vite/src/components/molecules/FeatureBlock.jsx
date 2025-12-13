import React from 'react';
import Button from '../atoms/Button'; // Assuming custom Button is used if actionElement needs it

const FeatureBlock = ({ Icon, title, description, actionElement }) => {
  return (
    <div className="text-center">
      {Icon && <Icon className="text-primary mb-3" size={48} />} {/* Icon should be a component */}
      <h5>{title}</h5>
      <p className="text-muted">{description}</p>
      {actionElement}
    </div>
  );
};

export default FeatureBlock;

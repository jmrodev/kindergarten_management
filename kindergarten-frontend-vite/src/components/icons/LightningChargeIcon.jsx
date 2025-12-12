import React from 'react';

const LightningChargeIcon = ({ size = 24, color = 'currentColor', className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M5.5 6.06h.868L5.26 8.32h.971l-.957 4.78L7.21 7.38h.968l.957 4.78L8.192 8.32h.971L8.055 6.06h-.868l-.957 4.78L7.197 5.81 5.5 6.06z"/>
  </svg>
);

export default LightningChargeIcon;

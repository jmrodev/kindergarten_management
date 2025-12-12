import React from 'react';

const PersonLinesFillIcon = ({ size = 24, color = 'currentColor', className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
    <path d="M7 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
    <path d="M7 1.414V4.5a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V.5h3a.5.5 0 0 1 .5.5v1.414z"/>
  </svg>
);

export default PersonLinesFillIcon;

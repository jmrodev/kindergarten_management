import React from 'react';

const FileMedicalIcon = ({ size = 24, color = 'currentColor', className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M4 1h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H4z"/>
    <path d="M9.5 4a.5.5 0 0 0-.5.5v1.5H7.5a.5.5 0 0 0 0 1h1.5V8.5a.5.5 0 0 0 1 0V7h1.5a.5.5 0 0 0 0-1H10V4.5a.5.5 0 0 0-.5-.5z"/>
  </svg>
);

export default FileMedicalIcon;

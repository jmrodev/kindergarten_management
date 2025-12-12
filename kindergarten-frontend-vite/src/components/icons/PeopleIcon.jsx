import React from 'react';

const PeopleIcon = ({ size = 24, color = 'currentColor', className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M13 14s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1h10Z"/>
    <path fillRule="evenodd" d="M9 8a3 3 0 1 0-6 0 3 3 0 0 0 6 0ZM9 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-1 9c0 1 1 1 1 1h5s1 0 1-1-1-4-6-4-6 3-6 4z"/>
  </svg>
);

export default PeopleIcon;

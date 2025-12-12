import React from 'react';

const PeopleFillIcon = ({ size = 24, color = 'currentColor', className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Z"/>
    <path d="M.93 8.513c.27.283.53.579.732.893.04.069.035.12.035.12a2.1 2.1 0 0 1-.837 1.471 2.166 2.166 0 0 1-1.58 0 2.03 2.03 0 0 1-.837-1.472 2 2 0 0 1 .035-.12 2.1 2.1 0 0 1 .732-.893A6.983 6.983 0 0 1 7 8.5c.13.006.258.02.385.041Z"/>
  </svg>
);

export default PeopleFillIcon;

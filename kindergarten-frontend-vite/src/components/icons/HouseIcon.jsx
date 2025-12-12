import React from 'react';

const HouseIcon = ({ size = 24, color = 'currentColor', className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z"/>
    <path fillRule="evenodd" d="M13 7.5h-1v-1a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1v1h-1v-1a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v1H4v-.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5Z"/>
  </svg>
);

export default HouseIcon;

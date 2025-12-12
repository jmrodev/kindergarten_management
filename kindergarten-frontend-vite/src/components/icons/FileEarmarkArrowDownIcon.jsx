import React from 'react';

const FileEarmarkArrowDownIcon = ({ size = 24, color = 'currentColor', className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M8 4a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 8.293V4.5A.5.5 0 0 1 8 4z"/>
    <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
  </svg>
);

export default FileEarmarkArrowDownIcon;

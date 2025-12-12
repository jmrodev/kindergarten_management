import React from 'react';

const CalendarPlusIcon = ({ size = 24, color = 'currentColor', className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M8.5 1.5A1.5 1.5 0 1 0 7 0a1.5 1.5 0 0 0 1.5 1.5zM11 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
    <path d="M12.5 0h-11a1.5 1.5 0 0 0-1.5 1.5v13a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5v-13a1.5 1.5 0 0 0-1.5-1.5zM5.5 3h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1zm0 2h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 2h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1z"/>
    <path fillRule="evenodd" d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7z"/>
  </svg>
);

export default CalendarPlusIcon;

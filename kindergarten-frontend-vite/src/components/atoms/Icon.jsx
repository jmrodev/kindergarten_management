import React from 'react';
import { IconEdit, IconView, IconDelete } from '../icons';

const Icon = ({ 
  type, 
  size = 16, 
  color = 'currentColor', 
  className = '', 
  onClick,
  title,
  ...props 
}) => {
  const map = {
    edit: IconEdit,
    view: IconView,
    delete: IconDelete
  };

  const IconComp = map[type];
  if (!IconComp) return null;

  const iconClass = `office-icon ${onClick ? 'clickable' : ''} ${className}`.trim();

  return (
    <span className={iconClass} onClick={onClick} title={title} {...props}>
      <IconComp size={size} color={color} />
    </span>
  );
};

export default Icon;

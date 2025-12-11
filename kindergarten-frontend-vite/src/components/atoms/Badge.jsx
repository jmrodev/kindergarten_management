import React from 'react';

const Badge = ({
  children,
  variant = 'default',
  type = 'generic',
  className = '',
  customColor, // Prop opcional para color personalizado
  capitalize = 'none', // 'none', 'uppercase', 'lowercase', 'capitalize'
  ...props
}) => {
  const getColorBasedOnText = (text) => {
    if (!text) return '';

    // Generar un hash basado en el texto para consistentemente asignar colores
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convertir hash a un valor entre 0 y 360 para el hue en HSL
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 45%)`; // 70% saturation, 45% lightness para buen contraste
  };

  const getBadgeClasses = () => {
    let baseClasses = 'office-badge';

    if (customColor) {
      // Si hay un color personalizado, solo usar la clase base para estilos
      return `${baseClasses} ${className}`.trim();
    }

    // Determinar el tipo de badge
    switch(type) {
      case 'role':
        baseClasses += ` office-role-badge office-${variant}`;
        break;
      case 'classroom':
        baseClasses += ` office-classroom-badge office-${variant}`;
        break;
      case 'status':
        baseClasses += ` office-status-badge office-${variant}`;
        break;
      case 'vaccine':
        baseClasses += ` office-vaccine-badge office-${variant}`;
        break;
      case 'generic':
      default:
        baseClasses += ` office-badge office-${variant}`;
        break;
    }

    return `${baseClasses} ${className}`.trim();
  };

  const badgeVars = {};
  if (customColor) {
    badgeVars['--badge-bg'] = customColor;
    badgeVars['--badge-color'] = '#ffffff';
  } else if (type === 'classroom' && variant === 'default' && typeof children === 'string') {
    const classroomBasedColor = getColorBasedOnText(children);
    badgeVars['--badge-bg'] = classroomBasedColor;
    badgeVars['--badge-color'] = '#ffffff';
  }

  const getCapitalizedChildren = () => {
    if (typeof children !== 'string') return children;

    switch(capitalize) {
      case 'uppercase':
        return children.toUpperCase();
      case 'lowercase':
        return children.toLowerCase();
      case 'capitalize':
        return children.replace(/\b\w/g, l => l.toUpperCase());
      case 'snake':
        return children.toLowerCase().replace(/\s+/g, '_');
      case 'camel':
        return children.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
          return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
      default:
        return children;
    }
  };

  return (
    <span className={getBadgeClasses()} style={badgeVars} {...props}>
      {getCapitalizedChildren()}
    </span>
  );
};

export default Badge;
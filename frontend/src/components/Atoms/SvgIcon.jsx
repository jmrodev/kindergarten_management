import './atoms.css';

const SvgIcon = ({ src, size = 24, className = '', alt = '', ...props }) => {
  // Importar el SVG como React Component si se usa Vite
  // De lo contrario, usarlo como imagen
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`svg-icon ${className}`}
      {...props}
    />
  );
};

export default SvgIcon;
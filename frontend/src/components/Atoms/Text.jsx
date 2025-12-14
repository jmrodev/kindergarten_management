import './atoms.css';

const Text = ({ children, variant = 'paragraph', className = '', ...props }) => {
  const baseClasses = `text-${variant}`;
  const customClasses = className;

  const textClasses = [
    baseClasses,
    customClasses
  ].filter(Boolean).join(' ');

  switch (variant) {
    case 'h1':
      return <h1 className={textClasses} {...props}>{children}</h1>;
    case 'h2':
      return <h2 className={textClasses} {...props}>{children}</h2>;
    case 'h3':
      return <h3 className={textClasses} {...props}>{children}</h3>;
    case 'h4':
      return <h4 className={textClasses} {...props}>{children}</h4>;
    case 'h5':
      return <h5 className={textClasses} {...props}>{children}</h5>;
    case 'h6':
      return <h6 className={textClasses} {...props}>{children}</h6>;
    case 'paragraph':
    default:
      return <p className={textClasses} {...props}>{children}</p>;
  }
};

export default Text;
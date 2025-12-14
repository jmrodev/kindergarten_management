import './atoms.css';

const Header = ({ children, className = '', ...props }) => {
  const baseClasses = 'header';
  const customClasses = className;

  const headerClasses = [
    baseClasses,
    customClasses
  ].filter(Boolean).join(' ');

  return (
    <header className={headerClasses} {...props}>
      {children}
    </header>
  );
};

export default Header;
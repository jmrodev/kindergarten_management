import './atoms.css';

const Navbar = ({ children, className = '', ...props }) => {
  const baseClasses = 'navbar';
  const customClasses = className;

  const navbarClasses = [
    baseClasses,
    customClasses
  ].filter(Boolean).join(' ');

  return (
    <nav className={navbarClasses} {...props}>
      {children}
    </nav>
  );
};

export default Navbar;
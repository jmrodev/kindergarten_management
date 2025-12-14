import './atoms.css';

const NavLink = ({ children, href = '#', active = false, className = '', ...props }) => {
  const baseClasses = 'nav-link';
  const activeClass = active ? 'nav-link-active' : '';
  const customClasses = className;

  const navLinkClasses = [
    baseClasses,
    activeClass,
    customClasses
  ].filter(Boolean).join(' ');

  return (
    <a href={href} className={navLinkClasses} {...props}>
      {children}
    </a>
  );
};

export default NavLink;
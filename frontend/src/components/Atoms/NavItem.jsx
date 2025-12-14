import './atoms.css';

const NavItem = ({ children, active = false, className = '', ...props }) => {
  const baseClasses = 'nav-item';
  const activeClass = active ? 'nav-item-active' : '';
  const customClasses = className;

  const navItemClasses = [
    baseClasses,
    activeClass,
    customClasses
  ].filter(Boolean).join(' ');

  return (
    <li className={navItemClasses} {...props}>
      {children}
    </li>
  );
};

export default NavItem;
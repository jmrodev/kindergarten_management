import { Link, useLocation } from 'react-router-dom';
import '../Atoms/atoms.css';

const MenuItem = ({ children, active = false, href = '#', onClick, className = '', ...props }) => {
  const baseClasses = 'menu-item';
  const activeClass = active ? 'menu-item-active' : '';
  const customClasses = className;

  const menuItemClasses = [
    baseClasses,
    activeClass,
    customClasses
  ].filter(Boolean).join(' ');

  // If href starts with '/', use Link, otherwise use regular anchor
  if (href.startsWith('/')) {
    return (
      <li className={menuItemClasses}>
        <Link
          to={href}
          className="menu-link"
          onClick={onClick}
          {...props}
        >
          {children}
        </Link>
      </li>
    );
  }

  return (
    <li className={menuItemClasses}>
      <a
        href={href}
        className="menu-link"
        onClick={onClick}
        {...props}
      >
        {children}
      </a>
    </li>
  );
};

export default MenuItem;
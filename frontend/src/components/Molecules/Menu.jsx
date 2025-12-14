import '../Atoms/atoms.css';

const Menu = ({ children, vertical = true, className = '', ...props }) => {
  const baseClasses = 'menu';
  const orientationClass = vertical ? 'menu-vertical' : 'menu-horizontal';
  const customClasses = className;

  const menuClasses = [
    baseClasses,
    orientationClass,
    customClasses
  ].filter(Boolean).join(' ');

  return (
    <ul className={menuClasses} {...props}>
      {children}
    </ul>
  );
};

export default Menu;
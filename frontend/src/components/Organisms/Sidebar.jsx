import '../Atoms/atoms.css';

const Sidebar = ({ children, collapsed = false, className = '', ...props }) => {
  const baseClasses = 'sidebar-layout'; // Clase específica para sidebar en layout
  const collapsedClass = collapsed ? 'sidebar-layout-collapsed' : '';
  const customClasses = className;

  const sidebarClasses = [
    baseClasses,
    collapsedClass,
    customClasses
  ].filter(Boolean).join(' ');

  // Determina el ancho basado en el estado colapsado
  const sidebarStyle = {
    width: collapsed ? '60px' : '250px',
    ...props.style
  };

  return (
    <aside className={sidebarClasses} style={sidebarStyle} {...props}>
      {children}
    </aside>
  );
};

export default Sidebar;
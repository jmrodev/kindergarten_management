import '../Atoms/atoms.css';

const Layout = ({ children, sidebar, header, className = '', isMobileMenuOpen = false, sidebarHidden = false, ...props }) => {
  const baseClasses = 'layout';
  const customClasses = className;

  const layoutClasses = [
    baseClasses,
    customClasses
  ].filter(Boolean).join(' ');

  // Determinar clases para el main content basado en estado del sidebar
  let mainContentClasses = "layout-main";
  if (!sidebar) {
    mainContentClasses = "layout-main-full";
  } else if (sidebarHidden) {
    mainContentClasses = "layout-main layout-main-full"; // Ocupa todo el ancho cuando el sidebar está oculto
  }

  return (
    <>
      {isMobileMenuOpen && (
        <div className="mobile-menu-backdrop" onClick={props.onBackdropClick}></div>
      )}
      <div className={layoutClasses}>
        {header && <header className="layout-header">{header}</header>}
        <div className="layout-body">
          {sidebar && <aside className="layout-sidebar">{sidebar}</aside>}
          <main className={mainContentClasses}>{children}</main>
        </div>
      </div>
    </>
  );
};

export default Layout;
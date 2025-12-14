import Layout from './Layout';
import Header from '../Atoms/Header';
import './organisms.css';

const AppLayout = ({ children, sidebar, headerContent, className = '', isMobileMenuOpen = false, onBackdropClick, sidebarHidden, ...props }) => {
  const header = headerContent || <Header className="app-header" />;

  return (
    <Layout
      sidebar={sidebar}
      header={header}
      className={`app-layout ${className}`}
      isMobileMenuOpen={isMobileMenuOpen}
      onBackdropClick={onBackdropClick}
      sidebarHidden={sidebarHidden}
      {...props}
    >
      {children}
    </Layout>
  );
};

export default AppLayout;
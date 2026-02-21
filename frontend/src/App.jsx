import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import PermissionsContext from './context/PermissionsContext';
import permissionsService from './services/permissionsService';
import api from './utils/api';
import AppLayout from './components/Organisms/AppLayout';
import SidebarMenu from './components/Organisms/SidebarMenu';
import HeaderWithMenu from './components/Atoms/HeaderWithMenu';
import Dashboard from './Pages/dashboard';
import ParentDashboard from './Pages/ParentDashboard';
import Login from './Pages/Login';
import Students from './Pages/students';
import Staff from './Pages/staff';
import Classes from './Pages/classes';
import Attendance from './Pages/attendance';
import Enrollments from './Pages/enrollments';
import MobileMenu from './components/Organisms/MobileMenu';
import ParentRegistrationWrapper from './components/Organisms/ParentRegistrationWrapper';
import Contacts from './Pages/Contacts';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [userPermissions, setUserPermissions] = useState({});
  const location = useLocation();

  // Define updateMenuItems before using it
  const normalizeRole = (r) => {
    if (!r) return '';
    const lower = r.toLowerCase();
    const map = {
      'admin': 'administrator',
      'administrator': 'administrator',
      'director': 'director',
      'directivo': 'director',
      'teacher': 'teacher',
      'docente': 'teacher',
      'secretary': 'secretary',
      'secretaria': 'secretary'
    };
    return map[lower] || lower;
  };

  const updateMenuItems = (role, permissions = {}) => {
    const canonicalRole = normalizeRole(role);

    // Parent/Tutor Restricted Menu
    if (canonicalRole === 'parent' || canonicalRole === 'tutor') {
      const parentItems = [
        { path: '/', label: 'Inicio', icon: '/src/assets/svg/dashboard.svg' }, // Parent Dashboard
        { path: '/parent/my-children', label: 'Mis Hijos', icon: '/src/assets/svg/students.svg' },
        { path: '/parent/register', label: 'Inscribir Alumno', icon: '/src/assets/svg/menu.svg' }
      ];
      setMenuItems(parentItems);
      return;
    }

    // Staff / Standard Menu
    const baseItems = [
      { path: '/', label: 'Dashboard', icon: '/src/assets/svg/dashboard.svg' },
      { path: '/contacts', label: 'Contactos', icon: '/src/assets/svg/user.svg' }, // Available to all staff
    ];

    // Helper to check permission from BD (module:action format)
    // ONLY returns true if permission explicitly exists in BD
    const can = (moduleKey, actionKey) => {
      const permKey = `${moduleKey}:${actionKey}`;
      // Return true ONLY if permission exists in BD and is true
      return permissions[permKey] === true;
    };

    // Determine role type for label customization (not for permission fallback)
    const isTeacher = canonicalRole === 'teacher';

    // Students - ONLY if has alumnos:ver permission in BD
    if (can('alumnos', 'ver')) {
      baseItems.push({ path: '/students', label: isTeacher ? 'Mis Estudiantes' : 'Estudiantes', icon: '/src/assets/svg/students.svg' });
    }

    // Teachers/Staff - ONLY if has personal:ver permission in BD
    if (can('personal', 'ver')) {
      baseItems.push({ path: '/staff', label: 'Personal', icon: '/src/assets/svg/user.svg' });
    }

    // Classes - ONLY if has salas:ver permission in BD
    if (can('salas', 'ver')) {
      baseItems.push({ path: '/classes', label: 'Clases', icon: '/src/assets/svg/menu.svg' });
    }

    // Attendance - ONLY if has asistencia:ver permission in BD
    if (can('asistencia', 'ver')) {
      baseItems.push({ path: '/attendance', label: 'Asistencia', icon: '/src/assets/svg/notification.svg' });
    }

    // Enrollments - ONLY if has inscripciones:ver permission in BD
    if (can('inscripciones', 'ver')) {
      baseItems.push({ path: '/enrollments', label: 'Inscripciones', icon: '/src/assets/svg/menu.svg' });
    }

    // Permissions management removed per user request

    // console.log(`[updateMenuItems] Role: ${canonicalRole}, Items: ${baseItems.length}, Perms keys: ${Object.keys(permissions).length}`);
    setMenuItems(baseItems);
  };

  const refreshPermissions = async (userOverride = null) => {
    const targetUser = userOverride || user;
    if (!targetUser || !targetUser.role) {
      // console.log('[refreshPermissions] No user or role yet, using role-based fallback');
      updateMenuItems(targetUser?.role, {});
      return;
    }
    try {
      // console.log('[refreshPermissions] Fetching user permissions...');
      // Get actual user permissions from backend (module:action format)
      const response = await api.get('/api/permissions/user-permissions');
      // console.log('[refreshPermissions] Got response:', response);

      // Convert to object format if needed
      const perms = Array.isArray(response) ? {} : (response || {});
      // console.log('[refreshPermissions] Parsed perms object has', Object.keys(perms).length, 'keys');

      if (Object.keys(perms).length === 0) {
        // console.log('[refreshPermissions] No permissions returned, using role-based fallback');
      }

      setUserPermissions(perms);
      updateMenuItems(targetUser.role, perms);
    } catch (err) {
      console.error('[refreshPermissions] Error fetching permissions:', err.message);
      // console.log('[refreshPermissions] Using role-based fallback');
      // If fetch fails, use fallback based on role
      setUserPermissions({});
      updateMenuItems(targetUser.role, {});
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const authService = await import('./services/authService');
        const me = await authService.default.me();

        // API returns different shapes for parent portal users vs staff
        const normalized = {
          id: me.id,
          email: me.email,
          firstName: me.firstName || me.name || '',
          lastName: me.paternalSurname || me.lastName || '',
          role: me.role || (me.parentPortalUser ? 'Parent' : undefined)
        };

        setUser(normalized);
        await refreshPermissions(normalized);
      } catch (err) {
        console.warn('Autenticación inválida o token expirado, limpiando credenciales', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const handleResize = () => {
      const mobileView = window.innerWidth <= 768;
      setIsMobileView(mobileView);

      if (!mobileView && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }

      if (mobileView) {
        setSidebarCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Removed auto-collapse sidebar logic to keep it fixed

  const handleLogin = (userData) => {
    // After login the Login page already saved token and user in localStorage
    setUser(userData);
    refreshPermissions(userData);
  };

  const handleLogout = () => {
    // Use authService to centralize logout behaviour
    import('./services/authService').then(s => s.default.logout());
    setUser(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleBackdropClick = () => {
    if (isMobileView && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    const handlePermissionsSync = (event) => {
      if (event.key === 'permissions:version') {
        // console.log('[permissions-sync] Detected permissions change, refreshing context');
        refreshPermissions();
      }
    };

    window.addEventListener('storage', handlePermissionsSync);
    return () => window.removeEventListener('storage', handlePermissionsSync);
  }, []);

  // Periodic permission refresh (polling) for cross-device sync
  // Every 30 seconds, check for permission updates
  useEffect(() => {
    if (!user) return;

    const permissionPollInterval = setInterval(() => {
      // console.log('[permission-poll] Checking for permission updates...');
      refreshPermissions();
    }, 30000); // 30 seconds

    return () => clearInterval(permissionPollInterval);
  }, [user]);

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    setSidebarHidden(false);
  };

  const showSidebar = () => {
    // Persistent sidebar, no need to show
  };

  if (loading) {
    return <div className="app-loading">Cargando...</div>;
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <PermissionsContext.Provider value={{ permissions: userPermissions, refreshPermissions }}>
      <AppLayout
        sidebar={isMobileView ? null : (
          <SidebarMenu
            items={menuItems}
            collapsed={sidebarCollapsed}
            onToggleCollapse={toggleSidebarCollapse}
            title={`Sistema de Gestión - ${user.firstName} ${user.lastName}`}
            currentPath={location.pathname}
          />
        )}
        headerContent={
          <HeaderWithMenu
            onMenuToggle={toggleMobileMenu}
            isMenuOpen={isMobileMenuOpen}
            title={`Sistema de Gestión - ${user.firstName} ${user.lastName}`}
            onLogout={handleLogout}
          />
        }
        isMobileMenuOpen={isMobileMenuOpen && isMobileView}
        onBackdropClick={handleBackdropClick}
      >
        {isMobileMenuOpen && isMobileView && (() => {
          // Mobile menu includes all items from menuItems (already filtered by permissions)
          return (
            <>
              <MobileMenu
                items={menuItems}
                title={`${user.firstName} ${user.lastName}`}
                currentPath={location.pathname}
                onClose={() => setIsMobileMenuOpen(false)}
              />
            </>
          );
        })()}
        <Routes>
          <Route path="/" element={
            (user?.role === 'Parent' || user?.role === 'parent' || user?.role === 'Tutor' || user?.role === 'tutor')
              ? <ParentDashboard />
              : <Dashboard />
          } />
          <Route path="/students" element={<Students />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/enrollments" element={<Enrollments />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/parent/register" element={<ParentRegistrationWrapper />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </PermissionsContext.Provider>
  );
}

export default App;
import React, { useState, useEffect } from 'react';

// Simple router implementation without external dependencies
const RouterContext = React.createContext();

const Router = ({ children, initialPath = '/' }) => {
  const [currentPath, setCurrentPath] = useState(initialPath);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    setCurrentPath(window.location.pathname);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const router = {
    currentPath,
    navigate
  };

  return (
    <RouterContext.Provider value={router}>
      {children}
    </RouterContext.Provider>
  );
};

const useNavigate = () => {
  const context = React.useContext(RouterContext);
  if (!context) {
    throw new Error('useNavigate must be used within a Router');
  }
  return context.navigate;
};

const useLocation = () => {
  const context = React.useContext(RouterContext);
  if (!context) {
    throw new Error('useLocation must be used within a Router');
  }
  return context.currentPath;
};

export { Router, useNavigate, useLocation };
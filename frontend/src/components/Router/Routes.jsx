import React from 'react';
import { useLocation } from './Router';

const Routes = ({ children }) => {
  const currentPath = useLocation();

  // Find the route that matches the current path
  const routeToRender = React.Children.toArray(children).find(child => {
    if (child.type && child.type.name === 'Route') {
      return child.props.path === currentPath || 
             (child.props.path === '/' && currentPath === '/');
    }
    return false;
  });

  return routeToRender ? routeToRender.props.children : null;
};

const Route = ({ path, element, children }) => {
  return React.createElement('div', { 
    'data-route-path': path 
  }, element || children);
};

const Link = ({ to, children, className, onClick, ...props }) => {
  const navigate = React.useContext(require('./Router').RouterContext).navigate || (() => {});
  
  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) onClick(e);
    navigate(to);
  };

  return React.createElement('a', {
    href: to,
    className,
    onClick: handleClick,
    ...props
  }, children);
};

export { Routes, Route, Link };
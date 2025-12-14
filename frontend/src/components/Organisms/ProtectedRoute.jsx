import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // This would be used if we had React Router
import Login from './Pages/Login';

const ProtectedRoute = ({ children, user }) => {
  const navigate = useNavigate();

  if (!user) {
    // If no user is authenticated, redirect to login
    return <Login onLogin={(userData) => console.log("User logged in:", userData)} />;
  }

  return children;
};

export default ProtectedRoute;
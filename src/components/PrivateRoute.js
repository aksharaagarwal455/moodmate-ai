import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
  const token = localStorage.getItem('token');

  // Both conditions must be true — loggedIn flag AND a real token must exist
  if (!isLoggedIn || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
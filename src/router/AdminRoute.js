import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminRoute = () => {
  
  const { isAuthenticated, user, loading } = useAuth();

  
  if (loading) {
    return <div>Loading authentication...</div>; 
  }

  
  if (isAuthenticated && user && user.role === 'admin') {
    return <Outlet />; 
  }

  
  if (isAuthenticated) {
     console.warn('AdminRoute: Access denied. User is not an admin.');
     return <Navigate to="/courses" replace />; 
  }

  
  return <Navigate to="/login" replace />;
};

export default AdminRoute;
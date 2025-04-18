import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; 

const PrivateRoute = () => {
  
  const { isAuthenticated, loading } = useAuth();

  console.log(`PrivateRoute Check: loading=${loading}, isAuthenticated=${isAuthenticated}`); 

  
  if (loading) {
    
    
    console.log("PrivateRoute: Waiting for auth check (loading)...");
    return <div>Loading...</div>; 
  }

  
  if (!isAuthenticated) {
     console.log("PrivateRoute: Not authenticated after check, redirecting to /login.");
     
     return <Navigate to="/login" replace />;
  }

  
  console.log("PrivateRoute: Authenticated, rendering nested route (Outlet).");
  return <Outlet />;
};

export default PrivateRoute;
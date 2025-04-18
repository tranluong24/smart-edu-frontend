import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext'; 


export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  if (context === null) {
     
     console.warn('AuthContext is null, ensure AuthProvider wraps the component tree.');
     return { 
        token: null,
        user: null,
        isAuthenticated: false,
        loading: true,
        loginUser: async () => ({ success: false, message: "Context not ready" }),
        registerUser: async () => ({ success: false, message: "Context not ready" }),
        logoutUser: () => {},
     };
  }
  return context; 
};
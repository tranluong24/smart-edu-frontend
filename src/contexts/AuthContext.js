import React, { createContext, useState, useEffect, useCallback } from "react";
import * as api from "../api/apiService"; 


const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
  
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 

  
  const loginUser = useCallback(async (email, password) => {
    try {
      setLoading(true);
      const response = await api.login({ email, password });
      if (response.data && response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user); 
        localStorage.setItem("authToken", response.data.token); 
        return { success: true };
      } else {
        
        return {
          success: false,
          message: "Login failed: Invalid server response",
        };
      }
    } catch (error) {
      console.error(
        "Login context error:",
        error.response?.data?.message || error.message
      );
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  }, []); 

  
  const registerUser = useCallback(async (email, username, password, role) => {
    try {
      setLoading(true);
      
      await api.register({ email, username, password, role });
      return { success: true };
    } catch (error) {
      console.error(
        "Register context error:",
        error.response?.data?.message || error.message
      );
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  }, []);

  
  const logoutUser = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken"); 
    
  }, []);

  
  useEffect(() => {
    const currentToken = localStorage.getItem("authToken");
    if (currentToken) {
      setToken(currentToken);
      const verifyTokenAndFetchUser = async () => {
        console.log("Token found, attempting to fetch user profile..."); 
        try {
          
          const response = await api.fetchUserProfile();
          if (response.data && response.data.user) {
            console.log("User profile fetched:", response.data.user); 
            setUser(response.data.user); 
          } else {
            console.warn("Fetched profile but no user data found.");
            logoutUser(); 
          }
          setLoading(false);
        } catch (error) {
          
          console.error(
            "Failed to fetch user profile on load:",
            error.response?.data?.message || error.message
          );
          logoutUser(); 
        }
      };
      verifyTokenAndFetchUser();
    } else {
      setLoading(false); 
      logoutUser();
    }
    
  }, []); 

  
  const value = {
    token,
    user,
    isAuthenticated: !!token && !!user, 
    loading, 
    loginUser,
    registerUser,
    logoutUser,
  };

  
  return (
    <AuthContext.Provider value={value}>
      {}
      {children} {}
    </AuthContext.Provider>
  );
};


export default AuthContext;

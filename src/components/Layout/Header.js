import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; 
import "../../assets/css/App.css"; 

const Header = () => {
  const { isAuthenticated, user, logoutUser } = useAuth(); 
  const navigate = useNavigate(); 

  const handleLogout = () => {
    logoutUser(); 
    navigate("/login"); 
  };

  return (
    <header className="app-header">
      <Link to="/" className="header-logo">
        Tekmonk Course
      </Link>
      <nav className="header-nav">
        {}

        {isAuthenticated ? (
          <>
            {}
            <Link to="/courses">Courses</Link>
            {isAuthenticated && <Link to="/my-classes">Classes</Link>}{" "}
            
            <span className="user-greeting">Welcome, {user?.username}!</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-button">
              Login
            </Link>
            <Link to="/register" className="register-button">
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;

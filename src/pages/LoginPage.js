import React, { useState,useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import LoginForm from "../components/Auth/LoginForm";
import { useAuth } from "../hooks/useAuth";
import "./LoginPage.css"; 

const LoginPage = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError(""); // Xóa lỗi cũ
    const result = await loginUser(credentials.email, credentials.password);
    setLoading(false);

    if (result.success) {
      navigate("/courses"); 
    } else {
      setError(
        result.message || "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="login-page">
      <LoginForm onSubmit={handleLogin} error={error} loading={loading} />
      <p className="switch-auth-link">
        Don't have an account? <Link to="/register">Join for Free</Link>
      </p>
    </div>
  );
};

export default LoginPage;

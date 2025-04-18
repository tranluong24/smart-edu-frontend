import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import RegisterForm from '../components/Auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';
import './RegisterPage.css'; 

const RegisterPage = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { registerUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // ---- THÊM useEffect ĐỂ KIỂM TRA ĐĂNG NHẬP ----
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is already authenticated. Redirecting from register page...');
      navigate('/', { replace: true }); // Chuyển hướng nếu đã đăng nhập
    }
  }, [isAuthenticated, navigate]);

  const handleRegister = async (userData) => {
    setLoading(true);
    setError('');
    setSuccessMessage(''); // Xóa thông báo thành công cũ
    const result = await registerUser(
      userData.email, 
      userData.username,
      userData.password,
      userData.role
    );
    setLoading(false);

    if (result.success) {
      setSuccessMessage('Registration successful! Redirecting to login...');
      // Chờ một chút để user đọc thông báo rồi chuyển trang
      setTimeout(() => {
        navigate('/login');
      }, 2000); 
    } else {
      setError(result.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-page">
       {!successMessage ? (
          <RegisterForm onSubmit={handleRegister} error={error} loading={loading} />
       ) : (
           <div className="success-message">{successMessage}</div>
       )}
        <p className="switch-auth-link">
            Already have an account? <Link to="/login">Log In</Link>
        </p>
    </div>
  );
};

export default RegisterPage;
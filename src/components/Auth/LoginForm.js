import React, { useState } from 'react';
import './AuthForm.css'; 

const LoginForm = ({ onSubmit, error, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // Ngăn form submit theo cách truyền thống
    if (!loading) { // Chỉ submit nếu không đang loading
        onSubmit({ email, password }); // Gọi hàm submit được truyền từ cha
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Log In</h2>
      {error && <p className="error-message">{error}</p>} {/* Hiển thị lỗi nếu có */}
      <div className="form-group">
        <label htmlFor="login-email">Email</label>
        <input
          type="email"
          id="login-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading} // Vô hiệu hóa khi đang loading
        />
      </div>
      <div className="form-group">
        <label htmlFor="login-password">Password</label>
        <input
          type="password"
          id="login-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <button type="submit" className="submit-button" disabled={loading}>
        {loading ? 'Logging in...' : 'Log In'}
      </button>
    </form>
  );
};

export default LoginForm;
import React, { useState } from "react";
import "./AuthForm.css";

const RegisterForm = ({ onSubmit, error, loading }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState("student");
  const [formError, setFormError] = useState('');


  const validateUsername = (uname) => {
    if (/\s/.test(uname)) {
      return "Username cannot contain spaces";
    }

    return '';
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError('');

    // Validate username trước khi submit
    const usernameValidationError = validateUsername(username);
    if (usernameValidationError) {
      setFormError(usernameValidationError);
      return; // Dừng submit nếu username không hợp lệ
    }
    // Kiểm tra password khớp nhau
    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return; // Dừng submit
    }
    // Kiểm tra độ dài password (có thể thêm ở đây hoặc để backend xử lý)
    if (password.length < 6) {
      setFormError("Password must be at least 6 characters long");
      return;
    }

    setFormError(''); // Xóa lỗi nếu hợp lệ
    if (!loading) {
      onSubmit({ email, username, password, role }); // Gọi hàm submit từ cha
    }
  };

  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);

    if ((formError == "Username cannot contain spaces") && !/\s/.test(newUsername)) {
      setFormError('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Create Account</h2>
      {error && <p className="error-message">{error}</p>} {}
      <div className="form-group">
        <label htmlFor="register-email">Email</label>
        <input
          type="email"
          id="register-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      {}
      <div className="form-group">
        <label htmlFor="register-username">Username</label>
        <input
          type="text"
          id="register-username"
          value={username}
          onChange={handleUsernameChange}
          required
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label htmlFor="register-password">Password (min. 6 characters)</label>
        <input
          type="password"
          id="register-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength="6"
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label htmlFor="register-confirm-password">Confirm Password</label>
        <input
          type="password"
          id="register-confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      {}
      <div className="form-group">
        <label htmlFor="register-role">Register as:</label>
        <select
          id="register-role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          disabled={loading}
          className="role-select" 
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
      </div>
      {formError && <p className="error-message">{formError}</p>}{" "}
      {}
      <button type="submit" className="submit-button" disabled={loading}>
        {loading ? "Creating Account..." : "Join for Free"}
      </button>
    </form>
  );
};

export default RegisterForm;

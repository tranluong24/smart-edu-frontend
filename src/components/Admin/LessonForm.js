import React, { useState } from 'react';
import '../Auth/AuthForm.css'; 

const LessonForm = ({ onSubmit, error, loading, buttonText = "Add Lesson" }) => {
  const [title, setTitle] = useState('');
  const [externalUrl, setExternalUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loading && title && externalUrl) {
      onSubmit({ title, externalUrl });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form lesson-form">
      <h2>{buttonText}</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <label htmlFor="lesson-title">Lesson Title *</label>
        <input
          type="text" id="lesson-title" value={title}
          onChange={(e) => setTitle(e.target.value)}
          required disabled={loading}
        />
      </div>
      <div className="form-group">
        <label htmlFor="lesson-url">External URL *</label>
        <input
          type="url" id="lesson-url" value={externalUrl} // Dùng type="url" để trình duyệt hỗ trợ validation
          onChange={(e) => setExternalUrl(e.target.value)}
          placeholder="https://www.example.com/lesson"
          required disabled={loading}
        />
      </div>
      <button type="submit" className="submit-button" disabled={loading || !title || !externalUrl}>
        {loading ? 'Saving...' : buttonText}
      </button>
    </form>
  );
};

export default LessonForm;
import React, { useState } from 'react';

import '../Auth/AuthForm.css';

const CourseForm = ({ onSubmit, initialData = { title: '', description: '' }, error, loading, buttonText = "Create Course" }) => {
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loading && title) { // Ít nhất phải có title
      onSubmit({ title, description });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form course-form"> {/* Thêm class course-form nếu cần style riêng */}
      <h2>{buttonText === "Create Course" ? "Create New Course" : "Edit Course"}</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <label htmlFor="course-title">Course Title *</label>
        <input
          type="text" id="course-title" value={title}
          onChange={(e) => setTitle(e.target.value)}
          required disabled={loading}
        />
      </div>
      <div className="form-group">
        <label htmlFor="course-description">Description</label>
        <textarea
          id="course-description" value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4" disabled={loading}
        />
      </div>
      <button type="submit" className="submit-button" disabled={loading || !title}>
        {loading ? 'Saving...' : buttonText}
      </button>
    </form>
  );
};

export default CourseForm;
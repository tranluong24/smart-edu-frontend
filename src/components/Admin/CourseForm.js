import React, { useState } from 'react';

import '../Auth/AuthForm.css';

const CourseForm = ({ onSubmit, initialData = { title: '', description: '' ,img_url: ''}, error, loading, buttonText = "Create Course" }) => {
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);
  const [img_url, setImgURL] = useState(initialData.img_url);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loading && title) { // Ít nhất phải có title
      onSubmit({ title, description, img_url });
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
      <div className="form-group">
        <label htmlFor="course-img-url">Image URL</label>
        <input
                type="url"
                id="img_url"
                name="img_url"
                value={img_url}
                onChange={(e) => setImgURL(e.target.value)}
                placeholder="https://example.com/image.jpg"
                disabled={loading}
              />
      </div>
      <button type="submit" className="submit-button" disabled={loading || !title}>
        {loading ? 'Saving...' : buttonText}
      </button>
    </form>
  );
};

export default CourseForm;
import React, { useState, useEffect } from "react";
import "./EditCourseModal.css";

const EditCourseModal = ({
  isOpen,
  onClose,
  onSave,
  course,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    img_url: "",
  });
  const [errors, setErrors] = useState({});

  // Update form data when course prop changes
  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || "",
        description: course.description || "",
        img_url: course.img_url || "",
      });
    }
  }, [course]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Course title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (formData.img_url && !isValidUrl(formData.img_url)) {
      newErrors.img_url = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content edit-course-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Edit Course</h3>
          <button
            className="modal-close"
            onClick={handleClose}
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <div className="modal-scroll-content">
          <form onSubmit={handleSubmit} className="edit-course-form">
            <div className="form-group">
              <label htmlFor="title">Course Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={errors.title ? "error" : ""}
                placeholder="Enter course title"
                disabled={isLoading}
              />
              {errors.title && (
                <span className="error-message">{errors.title}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={errors.description ? "error" : ""}
                placeholder="Enter course description"
                rows="4"
                disabled={isLoading}
              />
              {errors.description && (
                <span className="error-message">{errors.description}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="img_url">Image URL</label>
              <input
                type="url"
                id="img_url"
                name="img_url"
                value={formData.img_url}
                onChange={handleInputChange}
                className={errors.img_url ? "error" : ""}
                placeholder="https://example.com/image.jpg"
                disabled={isLoading}
              />
              {errors.img_url && (
                <span className="error-message">{errors.img_url}</span>
              )}
            </div>

            {formData.img_url && (
              <div className="form-group">
                <label>Image Preview</label>
                <div className="image-preview">
                  <img
                    src={formData.img_url}
                    alt="Course preview"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "block";
                    }}
                  />
                  <div className="image-error" style={{ display: "none" }}>
                    Failed to load image
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-cancel"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="btn-save"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCourseModal;

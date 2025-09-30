import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { deleteCourse, fetchCourseDetails } from "../api/apiService";
import LessonItem from "../components/Course/LessonItem";
import "./CourseDetailPage.css";
import { useAuth } from "../hooks/useAuth";
import ConfirmationModal from "../components/Common/ConfirmationModal";
import { useProgressSync } from "../hooks/useProgressSync";

const PLACEHOLDER_IMAGE_URL =
  "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State cho modal xác nhận xóa
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sử dụng custom hook cho real-time progress sync
  const {
    completedLessonIds,
    lastSyncTime
  } = useProgressSync(courseId, user?.id, user?.role);

  // useEffect để fetch chi tiết khóa học (không bao gồm progress)
  useEffect(() => {
    const loadCourseData = async () => {
      setLoading(true);
      setError("");
      setCourse(null);

      try {
        const courseDetailsRes = await fetchCourseDetails(courseId);
        setCourse(courseDetailsRes.data);
      } catch (err) {
        console.error(`Failed to load course ${courseId}:`, err);

        if (err.response && err.response.status === 404) {
          setError("Course not found.");
        } else {
          setError("Failed to load course data. Please try again later.");
        }
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      loadCourseData();
    } else {
      setError("Invalid Course ID.");
      setLoading(false);
    }
  }, [courseId]);

  const calculateProgress = () => {
    const lessonsArray = course?.lessons || [];
    if (!lessonsArray || lessonsArray.length === 0) {
      return { count: 0, total: 0, percentage: 0 };
    }
    const completedCount = completedLessonIds.size;
    const totalCount = lessonsArray.length;
    const percentage =
      totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    return { count: completedCount, total: totalCount, percentage };
  };

  // Function để xử lý xóa khóa học
  const handleDeleteCourse = async () => {
    setIsDeleting(true);
    console.log("đã ấn xóa");
    try {
      await deleteCourse(courseId);
      // Xóa thành công, chuyển về trang danh sách khóa học
      navigate("/courses", {
        state: { message: "Course deleted successfully" },
      });
    } catch (error) {
      console.error("Failed to delete course:", error);
      setError("Failed to delete course. Please try again.");
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading)
    return <div className="loading-message">Loading course details...</div>;

  if (error && !course) return <div className="error-message">{error}</div>;

  if (!course)
    return <div className="error-message">Course data is not available.</div>;

  const progress = calculateProgress();

  const headerImageUrl = course.img_url || PLACEHOLDER_IMAGE_URL;

  return (
    <div className="course-detail-page">
      {}
      <section className="course-header">
        <img
          src={headerImageUrl}
          alt={course.title || "Course Header Image"}
          className="course-detail-header-image"
          onError={(e) => {
            console.warn(
              `Failed to load header image: ${headerImageUrl}, using placeholder.`
            );
            e.target.onerror = null;
            e.target.src = PLACEHOLDER_IMAGE_URL;
          }}
        />
        <h1>{course.title}</h1>
        <p className="course-description">
          {course.description || "No description available."}
        </p>
      </section>

      {/* Progress Section */}
      <div className="course-progess">
        {user &&
          user.role === "student" &&
          course.lessons &&
          course.lessons.length > 0 && (
            <div className="student-progress-bar-section">
              <div className="progress-header">
                <h3>Your Progress</h3>
                <div className="progress-controls">
                  {lastSyncTime > 0 && (
                    <span className="last-sync">
                      Last updated:{" "}
                      {new Date(lastSyncTime).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>

              {(
                <div className="progress-container">
                  <div className="progress-bar-wrapper">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${progress.percentage}%` }}
                      aria-valuenow={progress.percentage}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      title={`${progress.percentage}% Complete`}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {progress.count}/{progress.total} ({progress.percentage}%)
                  </span>
                </div>
              )}
            </div>
          )}
      </div>

      {}
      <section className="lessons-section">
        <div className="lessons-header">
          <h2>Lessons</h2>
          {}
          {user && user.role === "admin" && (
            <div className="admin-buttons">
              <Link
                to={`/admin/courses/${courseId}/lessons/new`}
                className="add-lesson-button"
              >
                + Add Lesson
              </Link>
              <button
                className="delete-course-button"
                onClick={() => setShowDeleteModal(true)}
                title="Delete Course"
              >
                🗑️ Delete Course
              </button>
            </div>
          )}
        </div>

        {}
        {!loading && course.lessons && course.lessons.length > 0 ? (
          <ul className="lessons-list">
            {}
            {course.lessons.map((lesson, index) => (
              <LessonItem
                key={lesson.id}
                lesson={lesson}
                isCompleted={completedLessonIds.has(lesson.id)}
                index={index}
              />
            ))}
          </ul>
        ) : (
          !loading && <p>No lessons available for this course yet.</p>
        )}
      </section>
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteCourse}
        title="Delete Course"
        message={`Are you sure you want to delete the course "${course?.title}"?`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default CourseDetailPage;

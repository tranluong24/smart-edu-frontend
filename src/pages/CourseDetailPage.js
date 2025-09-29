import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom"; 
import {
  deleteCourse,
  fetchCourseDetails,
  getStudentCourseCompletion, 
} from "../api/apiService";
import LessonItem from "../components/Course/LessonItem"; 
import "./CourseDetailPage.css"; 
import { useAuth } from "../hooks/useAuth"; 
import ConfirmationModal from "../components/Common/ConfirmationModal";


const PLACEHOLDER_IMAGE_URL =
  "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

const CourseDetailPage = () => {
  const { courseId } = useParams(); 
  const { user } = useAuth(); 
  const navigate = useNavigate();

  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState("");

  // State riêng cho tiến độ hoàn thành của student
  const [completedLessonIds, setCompletedLessonIds] = useState(new Set());
  const [loadingCompletion, setLoadingCompletion] = useState(false); // Loading cho tiến độ

  // State cho modal xác nhận xóa
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // useEffect để fetch dữ liệu khi courseId hoặc user thay đổi
  useEffect(() => {
    const loadData = async () => {
      // Reset trạng thái khi bắt đầu load
      setLoading(true);
      // Chỉ set loading completion nếu là student
      if (user?.role === "student") {
        setLoadingCompletion(true);
      }
      setError("");
      setCourse(null); // Xóa dữ liệu cũ
      setCompletedLessonIds(new Set()); // Reset tiến độ

      try {
        // 1. Luôn fetch chi tiết khóa học (lessons, title, description,...)
        const courseDetailsPromise = fetchCourseDetails(courseId);

        // 2. Chỉ fetch tiến độ hoàn thành nếu user là student
        let completionPromise = Promise.resolve({ data: { completedLessonIds: [] } }); // Giá trị mặc định
        if (user && user.role === "student" && user.id) {
          completionPromise = getStudentCourseCompletion(user.id, courseId);
        }

        
        const [courseDetailsRes, completionRes] = await Promise.all([
          courseDetailsPromise,
          completionPromise,
        ]);

        
        setCourse(courseDetailsRes.data);
        
        setCompletedLessonIds(
          new Set(Array.isArray(completionRes.data?.completedLessonIds) ? completionRes.data.completedLessonIds : [])
        );

      } catch (err) {
        console.error(`Failed to load data for course ${courseId}:`, err);
        
        if (err.response && err.response.status === 404) {
          setError("Course not found.");
        } else if (err.response && err.response.status === 403 && user?.role === 'student') {
          
          setError("Could not load your completion status for this course.");
          
          try {
              const courseDetailsRes = await fetchCourseDetails(courseId); 
              setCourse(courseDetailsRes.data);
          } catch (courseErr) {
              setError("Course not found or failed to load details."); 
              setCourse(null);
          }
        } else {
          setError("Failed to load course data. Please try again later.");
          setCourse(null); 
        }
        setCompletedLessonIds(new Set()); 
      } finally {
        
        setLoading(false);
        setLoadingCompletion(false);
      }
    };

    
    if (courseId) {
      loadData();
    } else {
      setError("Invalid Course ID.");
      setLoading(false);
    }
  
  
  }, [courseId, user]);

  
  const calculateProgress = () => {
    const lessonsArray = course?.lessons || [];
    if (!lessonsArray || lessonsArray.length === 0) {
      return { count: 0, total: 0, percentage: 0 };
    }
    const completedCount = completedLessonIds.size;
    const totalCount = lessonsArray.length;
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    return { count: completedCount, total: totalCount, percentage };
  };

  
  // Function để xử lý xóa khóa học
  const handleDeleteCourse = async () => {
    setIsDeleting(true);
    console.log('đã ấn xóa')
    try {
      await deleteCourse(courseId);
      // Xóa thành công, chuyển về trang danh sách khóa học
      navigate('/courses', { 
        state: { message: 'Course deleted successfully' } 
      });
    } catch (error) {
      console.error('Failed to delete course:', error);
      setError('Failed to delete course. Please try again.');
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
            console.warn(`Failed to load header image: ${headerImageUrl}, using placeholder.`);
            e.target.onerror = null; 
            e.target.src = PLACEHOLDER_IMAGE_URL;
          }}
        />
        <h1>{course.title}</h1>
        <p className="course-description">
          {course.description || "No description available."}
        </p>
      </section>

      {}
      <div className="course-progess"> {}
        {user && user.role === 'student' && course.lessons && course.lessons.length > 0 && (
          <div className="student-progress-bar-section">
            {}
            {!loadingCompletion ? (
              <>
                <h3>Your Progress</h3>
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
              </>
            ) : (
              <p className="loading-text">Loading your progress...</p>
            )}
             {}
             {error && !loading && !loadingCompletion && (
                 <p className="error-text-inline">{error}</p>
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
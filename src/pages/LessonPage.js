
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; 
import { fetchLessonDetails } from "../api/apiService";
import "./LessonPage.css";

const LessonPage = () => {
  
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLesson = async () => {
      setLoading(true);
      setError("");
      try {
        // Vẫn dùng lessonId để fetch vì API backend hiện tại là /lessons/:lessonId
        const response = await fetchLessonDetails(courseId, lessonId);
        setLesson(response.data);
      } catch (err) {
        console.error(`Failed to fetch lesson ${lessonId}:`, err);
        if (err.response && err.response.status === 404) {
          setError("Lesson not found.");
        } else {
          setError("Failed to load lesson content. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
    // THAY ĐỔI Ở ĐÂY: Chỉ cần phụ thuộc vào lessonId để fetch
  }, [lessonId]);

  if (loading) return <div className="loading-message">Loading lesson...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!lesson)
    return <div className="error-message">Lesson data unavailable.</div>;

  return (
    
    <div className="lesson-page lesson-page-full-iframe">
      <div className="lesson-page-header"> {}
        <Link to={`/courses/${courseId}`} className="back-to-course">
           ← Back to Course
        </Link>
        {}
      </div>

      {}
      <div className="lesson-content-wrapper">
        {lesson.external_url ? (
          <iframe
            src={lesson.external_url}
            title={lesson.title} 
            
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="lesson-iframe" 
            sandbox="
            allow-scripts          
            allow-same-origin 
            allow-forms            
            allow-modals           
            allow-pointer-lock  "   
          
          >
          </iframe>
        ) : (
          <p className="iframe-placeholder">Lesson content URL is missing.</p>
        )}
      </div>
    </div>
  );
};

export default LessonPage;

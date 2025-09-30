import React from 'react';
import { useAuth } from '../../hooks/useAuth'; 
import './LessonItem.css'; 

const LessonItem = ({ lesson, index, isCompleted: propIsCompleted }) => { 
  const { user, isAuthenticated } = useAuth(); 
  
  const isCompleted = propIsCompleted || false;
  
  const createLessonUrlWithUserId = () => {
    let finalUrl = lesson.external_url; 
    if (isAuthenticated && user?.id && finalUrl) { 
      const userIdParam = `pageId=${user.id}`;
      try {
        
        const urlObject = new URL(finalUrl);
        urlObject.searchParams.set('pageId', user.id);
        finalUrl = urlObject.toString();
      } catch (e) {
        
        console.warn(`Could not parse URL object for: ${finalUrl}. Falling back to string append. Error: ${e.message}`);
        if (finalUrl.includes('?')) {
          finalUrl += `&${userIdParam}`; 
        } else {
          finalUrl += `?${userIdParam}`; 
        }
      }
    }
    
    return finalUrl || '#'; 
  };
  const finalLessonUrl = createLessonUrlWithUserId();
  const lessonNumber = (typeof index === 'number' && !isNaN(index)) ? index + 1 : '?';
  return (
    
    <li
      className={`lesson-item ${isCompleted ? "completed" : ""}`}
    >
      {}
      <div className="lesson-info">
        {}
        {}
        <a
            href={finalLessonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="lesson-title-link" 
        >
          {lesson.title ? lesson.title : lessonNumber}
        </a>
      </div>

      {}
      {}
      {
          <span className="completion-status">
            {isCompleted ? 'Completed' : 'Not Completed'}
          </span>
      }
    </li>
  );
};

export default LessonItem;
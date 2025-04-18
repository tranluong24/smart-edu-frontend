import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth'; 
import { checkLessonCompletion } from '../../api/apiService'; 
import './LessonItem.css'; 

const LessonItem = ({ lesson, index }) => { 
  const { user, isAuthenticated } = useAuth(); 
  const [isCompleted, setIsCompleted] = useState(false); 
  const [isLoading, setIsLoading] = useState(true);    
  

  
  useEffect(() => {
    
    if (isAuthenticated && lesson?.id && user?.id) {
      setIsLoading(true);

      const fetchCompletionStatus = async () => {
        try {
          
          
          const response = await checkLessonCompletion(lesson.id); 
          setIsCompleted(response.data.completed);
        } catch (err) {
          console.error(`Error fetching completion status for lesson ${lesson.id}:`, err);
          
          setIsCompleted(false);
        } finally {
          setIsLoading(false); 
        }
      };

      fetchCompletionStatus();
    } else {
      
      setIsCompleted(false);
      setIsLoading(false);
    }
    
  }, [lesson?.id, user?.id, isAuthenticated]);


  
  
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
  


  
  const handleLessonClick = () => {
      console.log(`Clicked lesson ${index + 1}: ${lesson.title}`);
      if (finalLessonUrl && finalLessonUrl !== '#') {
          window.open(finalLessonUrl, '_blank', 'noopener,noreferrer');
      }
      
  };

  
  const lessonNumber = (typeof index === 'number' && !isNaN(index)) ? index + 1 : '?';

  return (
    
    <li
      className={`lesson-item ${isCompleted ? "completed" : ""}`}
      
      role="listitem" 
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
          {lesson.title}
        </a>
      </div>

      {}
      {}
      {!isLoading ? (
          <span className="completion-status">
            {isCompleted ? 'Completed' : 'Not Completed'}
          </span>
      ) : (
          <span className="completion-status loading">Loading...</span> 
      )}
    </li>
  );
};

export default LessonItem;
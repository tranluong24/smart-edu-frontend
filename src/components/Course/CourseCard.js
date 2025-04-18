import React from "react";
import { Link } from "react-router-dom";
import "./CourseCard.css"; 


const PLACEHOLDER_IMAGE_URL = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"; 

const CourseCard = ({ course }) => {
  
  const truncateDescription = (text, length) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  const imageUrl = course.img_url || PLACEHOLDER_IMAGE_URL;

  return (
    <Link to={`/courses/${course.id}`} className="course-card-link">
      <div className="course-card">
        <img
          src={imageUrl}
          alt={course.title || "Course Image"} 
          className="course-card-image"
          
          onError={(e) => {
            console.warn(
              `Failed to load image: ${imageUrl}, using placeholder.`
            );
            e.target.onerror = null; 
            e.target.src = PLACEHOLDER_IMAGE_URL;
          }}
        />
        <div className="course-card-content">
          <h3 className="course-card-title">{course.title}</h3>
          <p className="course-card-description">
            {truncateDescription(course.description, 100)}
          </p>
          {}
          {}
        </div>
        {}
      </div>
    </Link>
  );
};

export default CourseCard;

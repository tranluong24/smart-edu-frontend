import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./HomePage.css"; 
import { useAuth } from "../hooks/useAuth"; 
import CourseCard from "../components/Course/CourseCard";
import { fetchCoursesTop } from "../api/apiService"; 


const platformLogos = [
  {
    id: 1,
    name: "Codecombat",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRCnbKCayYl5QVcDNBp_ZB81hOHQsGK-A9dA&s",
    alt: "Codecombat Logo",
  },
  {
    id: 2,
    name: "Scratch",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt0UlJUvLLMrRxceySJK7mszAWuQh0xE9yUA&s",
    alt: "Scratch Logo",
  },
  {
    id: 3,
    name: "Thunkable",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHoNYYjRo2couGfwCRS1KLOWUbbzvu8ZwowQ&s",
    alt: "Thunkable Logo",
  },
  {
    id: 4,
    name: "Replit",
    src: "https://logowik.com/content/uploads/images/replit4759.logowik.com.webp",
    alt: "Replit Logo",
  },
  {
    id: 5,
    name: "Kodu",
    src: "https://faculty.eng.ufl.edu/engaging-learning-lab/wp-content/uploads/sites/112/2018/11/Kodu-logo-300x269.png",
    alt: "Kodu Logo",
  },
  {
    id: 6,
    name: "Codecombat",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRCnbKCayYl5QVcDNBp_ZB81hOHQsGK-A9dA&s",
    alt: "Codecombat Logo",
  },
  {
    id: 7,
    name: "Scratch",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt0UlJUvLLMrRxceySJK7mszAWuQh0xE9yUA&s",
    alt: "Scratch Logo",
  },
  {
    id: 8,
    name: "Thunkable",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHoNYYjRo2couGfwCRS1KLOWUbbzvu8ZwowQ&s",
    alt: "Thunkable Logo",
  },
  {
    id: 9,
    name: "Replit",
    src: "https://logowik.com/content/uploads/images/replit4759.logowik.com.webp",
    alt: "Replit Logo",
  },
  {
    id: 10,
    name: "Kodu",
    src: "https://faculty.eng.ufl.edu/engaging-learning-lab/wp-content/uploads/sites/112/2018/11/Kodu-logo-300x269.png",
    alt: "Kodu Logo",
  },
];

const heroBackgroundImages = [
  "/images/hero/hero-bg-1.jpg",
  "/images/hero/hero-bg-2.jpg",
  "/images/hero/hero-bg-3.jpg",
];

const HomePage = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [errorCourses, setErrorCourses] = useState("");
  const { isAuthenticated } = useAuth(); // Lấy trạng thái đăng nhập
  const navigate = useNavigate(); // Hook để điều hướng
  const logoCarouselRef = useRef(null); // Ref cho container logo

  // --- State và Effect cho Background Slider ---
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  useEffect(() => {
    // Thiết lập interval để thay đổi ảnh nền
    const intervalId = setInterval(() => {
      setCurrentBgIndex(
        (prevIndex) => (prevIndex + 1) % heroBackgroundImages.length // Quay vòng lại ảnh đầu tiên
      );
    }, 5000); // Thay đổi ảnh mỗi 5 giây (điều chỉnh nếu cần)

    // Cleanup function: Xóa interval khi component unmount
    return () => clearInterval(intervalId);
  }, []); // Chỉ chạy một lần khi component mount
  // -------------------------------------------

  useEffect(() => {
    const loadFeaturedCourses = async () => {
      setLoadingCourses(true);
      setErrorCourses("");
      try {
        const response = await fetchCoursesTop(1, 6); // Lấy 6 khóa học
        setFeaturedCourses(response.data.courses || []); // API trả về object có key 'courses'
      } catch (err) {
        console.error("Failed to fetch featured courses:", err);
        setErrorCourses("Could not load featured courses.");
      } finally {
        setLoadingCourses(false);
      }
    };
    loadFeaturedCourses();
  }, []); // Chỉ chạy 1 lần

  // Hàm xử lý click vào thẻ khóa học nổi bật
  const handleFeaturedCourseClick = (courseId) => {
    if (isAuthenticated) {
      navigate(`/courses/${courseId}`); // Đã đăng nhập -> đi đến chi tiết khóa học
    } else {
      navigate("/login"); 
    }
  };

  
  const scrollCarousel = (direction) => {
    if (logoCarouselRef.current) {
      const scrollAmount = 300; 
      logoCarouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth", 
      });
    }
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        {}
        <div className="hero-background-slider">
          {heroBackgroundImages.map((imgSrc, index) => (
            <div
              key={index}
              className={`hero-background-image ${
                index === currentBgIndex ? "active" : ""
              }`}
              style={{ backgroundImage: `url(${imgSrc})` }} 
              aria-hidden={index !== currentBgIndex} 
            />
          ))}
        </div>

        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h1>Learn without limits</h1>
          <p>
            Start, switch, or advance your career with professional courses and
            degrees from world-class universities and companies.
          </p>

          <div className="hero-buttons">
            {}
            <Link to="/register" className="cta-button">
              Join for Free
            </Link>
            <Link to="/courses" className="secondary-button">
              Explore Courses
            </Link>
          </div>
        </div>
      </section>

      <section className="platforms-section">
        <h2>Programming Learning Platforms</h2>
        <div className="logo-carousel-wrapper">
          <button
            className="scroll-arrow left-arrow"
            onClick={() => scrollCarousel("left")}
            aria-label="Scroll Left"
          ></button>
          <div className="logo-carousel-container" ref={logoCarouselRef}>
            <div className="logo-carousel">
              {platformLogos.map((logo) => (
                <div key={logo.id} className="logo-item">
                  <img src={logo.src} alt={logo.alt} />
                  <span>
                    <strong>{logo.name}</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <button
            className="scroll-arrow right-arrow"
            onClick={() => scrollCarousel("right")}
            aria-label="Scroll Right"
          ></button>
        </div>
      </section>
      {}
      <section className="featured-courses-section">
        <h2>Featured Courses</h2>
        {loadingCourses && <p>Loading courses...</p>}
        {errorCourses && <p className="error-message">{errorCourses}</p>}
        {!loadingCourses &&
          !errorCourses &&
          (featuredCourses.length > 0 ? (
            <div className="featured-courses-grid">
              {featuredCourses.map((course) => (
                
                <div
                  key={course.id}
                  className="featured-course-item"
                  onClick={() => handleFeaturedCourseClick(course.id)}
                  role="link" 
                  tabIndex={0} 
                >
                  {}
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          ) : (
            <p>No featured courses available right now.</p>
          ))}
        <div className="view-all-courses-link">
          <Link to="/courses">View All Courses →</Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

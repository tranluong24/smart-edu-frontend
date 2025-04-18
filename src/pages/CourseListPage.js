import React, { useState, useEffect } from "react";
import { fetchCourses } from "../api/apiService";
import CourseCard from "../components/Course/CourseCard";
import Pagination from "../components/Common/Pagination"; 
import "./CourseListPage.css"; 
import { useAuth } from '../hooks/useAuth'; 
import {Link } from "react-router-dom"; 

const CourseListPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 10, // Giữ limit đồng bộ với backend
  });
  const { user } = useAuth(); // Lấy thông tin user để kiểm tra role

  const loadCourses = async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      // Gọi API với trang và giới hạn
      const response = await fetchCourses(page, pagination.limit);
      setCourses(response.data.courses);
      setPagination(response.data.pagination); // Cập nhật thông tin phân trang
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setError("Failed to load courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses(pagination.currentPage); // Load lần đầu hoặc khi page thay đổi
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage]); // Chỉ chạy lại khi currentPage thay đổi

  const handlePageChange = (newPage) => {
    if (newPage !== pagination.currentPage) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="course-list-page">
      <div className="page-header">
        {}
        <h1>Codecombat Courses</h1>
        {}
        {user && user.role === "admin" && (
          <Link
            to={`/admin/courses/new`}
            className="add-course-button"
          >
            + Add Course
          </Link>
        )}
      </div>

      <div className="course-grid">
        {courses.length > 0 ? (
          courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        ) : (
          <p>No courses available at the moment.</p>
        )}
      </div>
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default CourseListPage;

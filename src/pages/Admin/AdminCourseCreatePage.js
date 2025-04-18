import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseForm from '../../components/Admin/CourseForm';
import { createCourse } from '../../api/apiService';



const AdminCourseCreatePage = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateCourse = async (courseData) => {
    setLoading(true);
    setError('');
    try {
      const response = await createCourse(courseData);
      console.log('Course created:', response.data);
      // Chuyển hướng đến trang quản lý khóa học hoặc trang chi tiết khóa học vừa tạo
      // Ví dụ: chuyển về trang danh sách khóa học
      navigate('/courses');
      
      
    } catch (err) {
      console.error('Failed to create course:', err);
      setError(err.response?.data?.message || 'Failed to create course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page course-create-page"> {}
      {}
      <CourseForm onSubmit={handleCreateCourse} error={error} loading={loading} />
    </div>
  );
};

export default AdminCourseCreatePage;
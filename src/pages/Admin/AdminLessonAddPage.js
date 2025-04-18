import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import LessonForm from '../../components/Admin/LessonForm';
import { createLesson, fetchCourseDetails } from '../../api/apiService'; 


const AdminLessonAddPage = () => {
  const { courseId } = useParams(); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [courseTitle, setCourseTitle] = useState(''); // State để lưu title khóa học
  const navigate = useNavigate();

  // Lấy title khóa học để hiển thị (tùy chọn nhưng tốt cho UX)
   useEffect(() => {
       const loadCourseTitle = async () => {
           try {
               const response = await fetchCourseDetails(courseId);
               setCourseTitle(response.data.title);
           } catch (err) {
               console.error("Failed to fetch course title for lesson page:", err);
               // Không cần báo lỗi nghiêm trọng, chỉ là không hiển thị title
           }
       };
       loadCourseTitle();
   }, [courseId]);


  const handleAddLesson = async (lessonData) => {
    setLoading(true);
    setError('');
    try {
      await createLesson(courseId, lessonData);
      console.log('Lesson added to course:', courseId);
      // Chuyển hướng về trang chi tiết khóa học sau khi thêm thành công
      navigate(`/courses/${courseId}`);
    } catch (err) {
      console.error('Failed to add lesson:', err);
      setError(err.response?.data?.message || 'Failed to add lesson. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page lesson-add-page">
       {/* Link quay lại trang chi tiết khóa học */}
       {/* <Link to={`/courses/${courseId}`} style={{marginBottom: '20px', display: 'inline-block'}}>« Back to Course Details</Link> */}
       <LessonForm onSubmit={handleAddLesson} error={error} loading={loading} />
    </div>
  );
};

export default AdminLessonAddPage;
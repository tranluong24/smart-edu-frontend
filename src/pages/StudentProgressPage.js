
import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  fetchStudentInfo,          
  fetchCourses,             
  fetchCourseDetails,        
  fetchClassMembers,         
  getClassCourseCompletions, 
} from "../api/apiService";
import "./StudentProgressPage.css"; 


const generateAvatarPlaceholder = (nameOrEmail) => {
    if (!nameOrEmail) return "?";
    const text = (typeof nameOrEmail === 'object' ? nameOrEmail.username : nameOrEmail) ||
                 (typeof nameOrEmail === 'object' ? nameOrEmail.email?.split('@')[0] : String(nameOrEmail).split('@')[0]) ||
                 '';
    const words = text.split(' ').filter(Boolean);
    if (words.length >= 2) { return (words[0][0] + words[words.length - 1][0]).toUpperCase(); }
    else if (words.length === 1 && words[0].length > 0) { return words[0][0].toUpperCase(); }
    return "?";
};


const StudentProgressPage = () => {
  
  const{classId} = useParams();

  const { studentId } = useParams(); 
  const [studentInfo, setStudentInfo] = useState(null);
  const FIXED_CLASS_ID = classId 
  const [allCourses, setAllCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedCourseTitle, setSelectedCourseTitle] = useState("");
  const [lessons, setLessons] = useState([]);
  const [members, setMembers] = useState([]);
  const [completions, setCompletions] = useState({});
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingCourseData, setLoadingCourseData] = useState(false);
  const [error, setError] = useState("");

  // Map member để tra cứu nhanh bằng ID
  const memberMap = useMemo(() => {
    const map = new Map();
    if (Array.isArray(members)) {
      members.forEach(member => map.set(member.id, member));
    }
    return map;
  }, [members]);

  // Load thông tin student (chỉ để hiển thị tên) và danh sách courses ban đầu
  useEffect(() => {
    const loadInitialData = async () => {
      setLoadingInitial(true);
      setError("");
      setAllCourses([]);
      try {
        // Fetch student info chỉ để lấy tên hiển thị
        // const profileRes = await fetchStudentInfo(studentId);
        // Không cần kiểm tra classId từ response nữa
        // if (!profileRes.data) {
        //     throw new Error("Student not found.");
        // }
        // setStudentInfo(profileRes.data); // Lưu thông tin student

        // Fetch courses (không cần lọc theo classId từ student nữa)
        const coursesRes = await fetchCourses(); // Lấy tất cả courses hoặc courses cho class 4 nếu API hỗ trợ
        setAllCourses(Array.isArray(coursesRes.data?.courses) ? coursesRes.data.courses : []);

      } catch (err) {
        console.error("Error loading initial data:", err);
        setError(err.message || "Failed to load student or course list.");
        setStudentInfo(null); // Vẫn reset student nếu lỗi
      } finally {
        setLoadingInitial(false);
      }
    };
    loadInitialData();
  }, []); // Chỉ phụ thuộc studentId

  // Load dữ liệu chi tiết (lessons, members, completions) khi chọn course, sử dụng FIXED_CLASS_ID
  useEffect(() => {
    // Chỉ thực hiện nếu đã chọn course
    if (!selectedCourseId) {
      setLessons([]);
      setMembers([]);
      setCompletions({});
      setSelectedCourseTitle("");
      return;
    }

    const loadDetailedCourseData = async () => {
      setLoadingCourseData(true);
      setError(""); // Xóa lỗi cũ liên quan đến course data
      try {
        // Cập nhật tên khóa học đang chọn
         const course = allCourses.find(c => c.id === parseInt(selectedCourseId));
         setSelectedCourseTitle(course?.title || "");

        // Gọi song song các API, LUÔN DÙNG FIXED_CLASS_ID
        const [lessonsRes, membersRes, completionsRes] = await Promise.all([
          fetchCourseDetails(selectedCourseId),            // Lấy lessons
          fetchClassMembers(FIXED_CLASS_ID),               // Lấy members của Class 4
          getClassCourseCompletions(FIXED_CLASS_ID, selectedCourseId), // Lấy completions Class 4
        ]);

        const lessonData = lessonsRes.data?.lessons || lessonsRes.data;
        setLessons(Array.isArray(lessonData) ? lessonData : []);
        setMembers(Array.isArray(membersRes.data) ? membersRes.data : []);
        setCompletions(completionsRes.data?.completions || completionsRes.data || {});
        // setError(""); // Không cần set lại error ở đây nếu không có lỗi

      } catch (err) {
        console.error(`Error loading detailed data for course ${selectedCourseId}:`, err);
        setError(`Failed to load details for course: ${selectedCourseTitle || selectedCourseId}.`);
        // Reset state liên quan đến course
        setLessons([]);
        setMembers([]);
        setCompletions({});
      } finally {
        setLoadingCourseData(false);
      }
    };

    loadDetailedCourseData();
  // Phụ thuộc vào course đã chọn và danh sách courses (để lấy title)
  // KHÔNG phụ thuộc vào classId state nữa vì nó cố định
  }, [selectedCourseId, allCourses]); // Bỏ classId khỏi dependencies

  // --- Render ---
  if (loadingInitial) {
    return <div className="loading-message">Loading student and course data...</div>;
  }

  
  
  
  

  const courseDataError = error && !loadingCourseData && selectedCourseId;

  return (
    
    <div className="student-progress-page">
      <h1>Class Progress</h1> {}
      <p className="sub-header-info">
        {}
        {}
      </p>
      {courseDataError && <div className="error-message">{error}</div>}

      {}
      <div className="selection-container">
        <section className="course-selector">
          {}
          {loadingCourseData ? (
            <p>Loading courses...</p>
          ) : (
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="course-select-dropdown"
              disabled={allCourses.length === 0}
              aria-label="Select a course to view class progress"
            >
              <option value="">-- Select a Course --</option>
              {allCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          )}
        </section>
        {/* --- KHÔNG CÓ PROGRESS BAR CÁ NHÂN --- */}
      </div>

      {/* === Phần Danh Sách Bài Học và AVATAR === */}
      {selectedCourseId && (
        <section className="lessons-overview-section">
           <h2>{selectedCourseTitle}</h2>
          {loadingCourseData ? (
            <p className="loading-text">Loading lessons and completion status...</p>
          ) : lessons.length > 0 ? (
            <ul className="lessons-progress-list-overview">
              {lessons.map((lesson, index) => {
                
                const completedStudentIdsForLesson = completions[lesson.id] || [];
                
                const completedStudents = completedStudentIdsForLesson
                  .map(studentId => memberMap.get(studentId)) 
                  .filter(student => !!student);

                
                return (
                  <li key={lesson.id} className="lesson-progress-overview-item">
                    <div className="lesson-info-overview">
                      {}
                      {(
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                          <span className="lesson-title-overview">{lesson.title}</span>
                      )}
                    </div>
                    <div className="completion-avatars-container">
                      {completedStudents.length > 0 ? (
                        completedStudents.slice(0, 7).map((s) => (
                          <div
                            key={s.id}
                            className="avatar-placeholder"
                            title={s.username || s.email}
                          >
                            {s.avatar_url ? (
                              <img src={s.avatar_url} alt={s.username || s.email} className="avatar-image"/>
                            ) : (
                              generateAvatarPlaceholder(s.username || s.email)
                            )}
                          </div>
                        ))
                      ) : (
                        <span className="no-completions-placeholder">-</span>
                      )}
                      {completedStudents.length > 7 && (
                        <div className="avatar-placeholder more-avatars" title={`${completedStudents.length - 7} more completed`}>
                          +{completedStudents.length - 7}
                        </div>
                      )}
                      <span className="completion-count">({completedStudents.length})</span>
                    </div>
                  </li>
                );
                 
              })}
            </ul>
          ) : (
            !loadingCourseData && !courseDataError && <p>No lessons found for this course.</p>
          )}
        </section>
      )}
      {}
      {!selectedCourseId && !loadingInitial && (
          <p className="instruction-text">
              Please select a course above to view lesson completion status for Class {FIXED_CLASS_ID}.
          </p>
      )}
    </div>
  );
};

export default StudentProgressPage; 
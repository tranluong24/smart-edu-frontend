import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL; 

const apiClient = axios.create({
  baseURL: API_URL,
  
  
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const register = (userData) =>
  apiClient.post("/auth/register", userData);
export const login = (credentials) =>
  apiClient.post("/auth/login", credentials);
export const fetchUserProfile = () => apiClient.get("/auth/me");


export const createCourse = (courseData) =>
  apiClient.post("/courses", courseData);

export const deleteCourse = (courseId) => 
  apiClient.delete(`/courses/${courseId}`)

export const createLesson = (courseId, lessonData) =>
  apiClient.post(`/courses/${courseId}/lessons`, lessonData);


export const fetchCourses = (page = 1, limit = 9) =>
  apiClient.get(`/courses?page=${page}&limit=${limit}`);

export const fetchCoursesTop = (page = 1, limit = 9) =>
  apiClient.get(`/courses/top?page=${page}&limit=${limit}`);

export const fetchCourseDetails = (id) => apiClient.get(`/courses/${id}`);

export const fetchLessonDetails = (courseId, lessonId) =>
  apiClient.get(`/courses/${courseId}/lessons/${lessonId}`);

export const checkLessonCompletion = (lessonId) =>
  apiClient.get(`/completions/complete-lesson/${lessonId}`);

export const getStudentCourseCompletion = (studentId, courseId) =>
  apiClient.get(`/completions/complete-lesson/${studentId}/${courseId}`);

export const getClassCourseCompletions = (classId, courseId) =>
  apiClient.get(`/class/${classId}/courses/${courseId}/completions`);


export const createClass = (classData) => apiClient.post("/class", classData); 

export const fetchMyClasses = () => apiClient.get("/class/myclasses"); 

export const joinClass = (joinCode) => apiClient.post("/class/join", joinCode); 

export const fetchClassDetails = (classId) =>
  apiClient.get(`/class/${classId}`);

export const fetchClassMembers = (classId) =>
  apiClient.get(`/class/${classId}/members`);

export const fetchStudentInfo = (studentId) => apiClient.get(`/students/${studentId}/info`);

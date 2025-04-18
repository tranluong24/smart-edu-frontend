import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import CourseListPage from "../pages/CourseListPage";
import CourseDetailPage from "../pages/CourseDetailPage";
import LessonPage from "../pages/LessonPage";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import PrivateRoute from "./PrivateRoute"; 

import AdminRoute from "./AdminRoute"; 
import AdminCourseCreatePage from "../pages/Admin/AdminCourseCreatePage"; 
import AdminLessonAddPage from "../pages/Admin/AdminLessonAddPage"; 
import ClassDetailPage from "../pages/ClassDetailPage";
import MyClassesPage from "../pages/MyClassesPage";
import StudentProgressPage from "../pages/StudentProgressPage";

const AppRouter = () => {
  return (
    <>
      <Header /> {}
      <main className="main-content">
        {" "}
        {}
        <Routes>
          {}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<PrivateRoute />}>
            <Route path="/courses" element={<CourseListPage />} />
            <Route path="/courses/:courseId" element={<CourseDetailPage />} />
            <Route
              path="/courses/:courseId/lessons/:lessonId"
              element={<LessonPage />}
            />
          </Route>

          {}
          <Route element={<AdminRoute />}>
            {" "}
            {}
            {}
            <Route
              path="/admin/courses/new"
              element={<AdminCourseCreatePage />}
            />
            {}
            <Route
              path="/admin/courses/:courseId/lessons/new"
              element={<AdminLessonAddPage />}
            />
          </Route>

          <Route path="/my-classes" element={<PrivateRoute />}>
            {" "}
            {}
            <Route index element={<MyClassesPage />} />
          </Route>
          <Route path="/classes/:classId" element={<PrivateRoute />}>
            {" "}
            {}
            <Route index element={<ClassDetailPage />} />
          </Route>

          <Route
            path="/classes/:classId/progress"
            element={<PrivateRoute />}
          >
            {" "}
            {}
            <Route index element={<StudentProgressPage />} />
          </Route>

          {}
          <Route
            path="*"
            element={
              <div style={{ textAlign: "center", marginTop: "50px" }}>
                <h1>404 - Page Not Found</h1>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer /> {}
    </>
  );
};

export default AppRouter;

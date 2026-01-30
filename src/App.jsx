import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ExamProvider } from './context/ExamContext';
import { AdminProvider } from './context/AdminContext';
import ProtectedRoute from './components/ProtectedRoute';
import { AnimatePresence } from 'framer-motion';

import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import CreateExam from './pages/Admin/CreateExam';
import StudentList from './pages/Admin/StudentList';
import Timetable from './pages/Admin/Timetable';
import NoticeBoard from './pages/Admin/NoticeBoard';
import SeatingArrangement from './pages/Admin/SeatingArrangement';
import ForgotPassword from './pages/Auth/ForgotPassword';
import TakeExam from './pages/Student/TakeExam';
import Profile from './pages/Shared/Profile';
import StudentTimetable from './pages/Student/StudentTimetable';
import StudentSeating from './pages/Student/StudentSeating';
import StudentNoticeBoard from './pages/Student/StudentNoticeBoard';
import StudentDashboard from './pages/Dashboard/StudentDashboard';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-exam"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <CreateExam />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <StudentList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/timetable"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Timetable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notices"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <NoticeBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/seating"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SeatingArrangement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/take-exam/:examId"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <TakeExam />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/timetable"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentTimetable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/seating"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentSeating />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/notices"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentNoticeBoard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Root Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <ExamProvider>
        <AdminProvider>
          <Router>
            <AnimatedRoutes />
          </Router>
        </AdminProvider>
      </ExamProvider>
    </AuthProvider>
  );
}

export default App;

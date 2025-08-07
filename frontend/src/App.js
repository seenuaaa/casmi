import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import TestPage from './pages/TestPage';
import CreateRoom from './pages/CreateRoom';
import Rooms from './pages/Rooms';
import VideoRoom from './pages/VideoRoom';
import ResumeTemplates from './pages/ResumeTemplates';
import ResumeBuilder from './pages/ResumeBuilder';
import ResumeReview from './pages/ResumeReview';
import Profile from './pages/Profile';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/signin" />;
};

const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/dashboard" /> : children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 text-white font-syne">
          <Routes>
            <Route path="/signin" element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            } />
            
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            
            <Route path="/practice/courses" element={
              <PrivateRoute>
                <Courses />
              </PrivateRoute>
            } />
            
            <Route path="/practice/courses/:courseId" element={
              <PrivateRoute>
                <CourseDetail />
              </PrivateRoute>
            } />
            
            <Route path="/practice/courses/:courseId/tests/:testId" element={
              <PrivateRoute>
                <TestPage />
              </PrivateRoute>
            } />
            
            <Route path="/rooms/create" element={
              <PrivateRoute>
                <CreateRoom />
              </PrivateRoute>
            } />
            
            <Route path="/rooms" element={
              <PrivateRoute>
                <Rooms />
              </PrivateRoute>
            } />
            
            <Route path="/rooms/:roomId" element={
              <PrivateRoute>
                <VideoRoom />
              </PrivateRoute>
            } />
            
            <Route path="/resume/templates" element={
              <PrivateRoute>
                <ResumeTemplates />
              </PrivateRoute>
            } />
            
            <Route path="/resume/builder/:templateId" element={
              <PrivateRoute>
                <ResumeBuilder />
              </PrivateRoute>
            } />
            
            <Route path="/resume/review/:resumeId" element={
              <PrivateRoute>
                <ResumeReview />
              </PrivateRoute>
            } />
            
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import CreateRoom from './pages/CreateRoom';
import VideoRoom from './pages/VideoRoom';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import PublicRooms from './pages/PublicRooms';
import Discover from './pages/Discover';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/signin" />;
};

const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/dashboard" /> : children;
};

const AppLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white font-syne">
      <Sidebar />
      <div className="flex-1 ml-80">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signin" element={
            <PublicRoute>
              <div className="min-h-screen bg-gray-900 text-white font-syne">
                <SignIn />
              </div>
            </PublicRoute>
          } />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </PrivateRoute>
          } />
          
          <Route path="/rooms" element={
            <PrivateRoute>
              <AppLayout>
                <Rooms />
              </AppLayout>
            </PrivateRoute>
          } />
          
          <Route path="/rooms/create" element={
            <PrivateRoute>
              <AppLayout>
                <CreateRoom />
              </AppLayout>
            </PrivateRoute>
          } />

          <Route path="/rooms/public" element={
            <PrivateRoute>
              <AppLayout>
                <PublicRooms />
              </AppLayout>
            </PrivateRoute>
          } />
          
          <Route path="/rooms/:roomId" element={
            <PrivateRoute>
              <VideoRoom />
            </PrivateRoute>
          } />
          
          <Route path="/profile" element={
            <PrivateRoute>
              <AppLayout>
                <Profile />
              </AppLayout>
            </PrivateRoute>
          } />

          <Route path="/settings" element={
            <PrivateRoute>
              <AppLayout>
                <Settings />
              </AppLayout>
            </PrivateRoute>
          } />

          <Route path="/discover" element={
            <PrivateRoute>
              <AppLayout>
                <Discover />
              </AppLayout>
            </PrivateRoute>
          } />
          
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { 
  BookOpenIcon, 
  VideoCameraIcon, 
  DocumentTextIcon, 
  UserIcon,
  ChartBarIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [currentUser]);

  const completedTests = userProfile?.completedTests?.length || 0;
  const totalTests = 20; // Mock total tests
  const progress = Math.round((completedTests / totalTests) * 100);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {userProfile?.displayName || currentUser?.email?.split('@')[0]}!
            </h1>
            <p className="text-gray-400">Continue your learning journey</p>
          </div>
          <Link to="/profile" className="btn-secondary">
            <UserIcon className="w-5 h-5" />
            <span>Profile</span>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Tests Completed</p>
                <p className="text-2xl font-bold text-white">{completedTests}</p>
              </div>
              <ChartBarIcon className="w-8 h-8 text-indigo-500" />
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Overall Progress</p>
                <p className="text-2xl font-bold text-white">{progress}%</p>
              </div>
              <div className="w-8 h-8 relative">
                <div className="w-8 h-8 rounded-full border-4 border-gray-600"></div>
                <div 
                  className="w-8 h-8 rounded-full border-4 border-indigo-500 absolute top-0 left-0"
                  style={{
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(2 * Math.PI * progress / 100 - Math.PI/2)}% ${50 + 50 * Math.sin(2 * Math.PI * progress / 100 - Math.PI/2)}%, 50% 50%)`
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Video Sessions</p>
                <p className="text-2xl font-bold text-white">3</p>
              </div>
              <VideoCameraIcon className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Resumes Created</p>
                <p className="text-2xl font-bold text-white">2</p>
              </div>
              <DocumentTextIcon className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <Link to="/practice/courses" className="card p-6 hover:bg-gray-750 transition-colors group">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-indigo-600 rounded-xl">
                <BookOpenIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white group-hover:text-indigo-300">Practice Tests</h3>
                <p className="text-gray-400 text-sm mt-1">Take coding tests in Python, Java, C++, and JavaScript</p>
                <div className="mt-3">
                  <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-lg">
                    {completedTests} completed
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/rooms" className="card p-6 hover:bg-gray-750 transition-colors group">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-green-600 rounded-xl">
                <VideoCameraIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white group-hover:text-green-300">Video Rooms</h3>
                <p className="text-gray-400 text-sm mt-1">Join or create study rooms for collaborative learning</p>
                <div className="mt-3 flex space-x-2">
                  <Link to="/rooms" className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-lg hover:bg-green-500/20">
                    Join Room
                  </Link>
                  <Link to="/rooms/create" className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-lg hover:bg-green-500/20">
                    Create Room
                  </Link>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/resume/templates" className="card p-6 hover:bg-gray-750 transition-colors group">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-600 rounded-xl">
                <DocumentTextIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white group-hover:text-blue-300">Resume Builder</h3>
                <p className="text-gray-400 text-sm mt-1">Create professional resumes with our templates</p>
                <div className="mt-3">
                  <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-lg">
                    Choose Template
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-750 rounded-xl">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                <BookOpenIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Completed Python Basics Test</p>
                <p className="text-gray-400 text-sm">Score: 85% • 2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gray-750 rounded-xl">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <VideoCameraIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Joined Study Room: JavaScript Fundamentals</p>
                <p className="text-gray-400 text-sm">Duration: 45 minutes • 1 day ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-750 rounded-xl">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <DocumentTextIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Created Resume: Software Developer</p>
                <p className="text-gray-400 text-sm">Template: Modern Tech • 3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
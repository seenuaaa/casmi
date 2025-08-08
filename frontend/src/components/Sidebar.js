import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logOut } from '../firebase';
import cosmivityLogo from '../assets/cosmivity-logo.png';
import {
  HomeIcon,
  VideoCameraIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  UserGroupIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  VideoCameraIcon as VideoCameraIconSolid,
  UserIcon as UserIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid
} from '@heroicons/react/24/solid';

const Sidebar = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/signin');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: HomeIcon, 
      iconSolid: HomeIconSolid,
      description: 'Overview & Stats'
    },
    { 
      name: 'Rooms', 
      href: '/rooms', 
      icon: VideoCameraIcon, 
      iconSolid: VideoCameraIconSolid,
      description: 'Video Meetings',
      badge: 'Live'
    },
    { 
      name: 'Profile', 
      href: '/profile', 
      icon: UserIcon, 
      iconSolid: UserIconSolid,
      description: 'Your Portfolio'
    },
    { 
      name: 'Settings', 
      href: '/settings', 
      icon: Cog6ToothIcon, 
      iconSolid: Cog6ToothIconSolid,
      description: 'Preferences'
    }
  ];

  const quickActions = [
    { 
      name: 'Create Room', 
      href: '/rooms/create', 
      icon: PlusIcon,
      color: 'bg-indigo-600 hover:bg-indigo-700',
      description: 'Start a meeting'
    },
    { 
      name: 'Browse Rooms', 
      href: '/rooms/public', 
      icon: UserGroupIcon,
      color: 'bg-green-600 hover:bg-green-700',
      description: 'Join public rooms'
    },
    { 
      name: 'Find People', 
      href: '/discover', 
      icon: MagnifyingGlassIcon,
      color: 'bg-purple-600 hover:bg-purple-700',
      description: 'Connect with others'
    }
  ];

  const isActive = (href) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const defaultProfilePic = cosmivityLogo;

  return (
    <div className={`bg-gray-900 border-r border-gray-700 h-screen flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-80'
    } fixed left-0 top-0 z-50`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <img 
            src={cosmivityLogo} 
            alt="Cosmivity" 
            className="w-10 h-10 rounded-lg"
          />
          {!isCollapsed && (
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">Cosmivity</h1>
              <p className="text-sm text-gray-400">Connect & Collaborate</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <img
            src={currentUser?.photoURL || defaultProfilePic}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold truncate">
                {currentUser?.displayName || 'Anonymous User'}
              </h3>
              <p className="text-gray-400 text-sm truncate">
                {currentUser?.email}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">Online</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = isActive(item.href) ? item.iconSolid : item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                  isActive(item.href)
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span>{item.name}</span>
                      {item.badge && (
                        <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 group-hover:text-gray-300">
                      {item.description}
                    </p>
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="pt-6">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Quick Actions
            </h4>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  to={action.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-white transition-all ${action.color}`}
                >
                  <action.icon className="w-5 h-5" />
                  <div className="flex-1">
                    <div>{action.name}</div>
                    <p className="text-xs opacity-80">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
        
        {!isCollapsed && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              © 2025 Cosmivity
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/api';
import {
  VideoCameraIcon,
  PlusIcon,
  UserGroupIcon,
  ClockIcon,
  ChartBarIcon,
  TrendingUpIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    activeRooms: 0,
    totalParticipants: 0,
    myRooms: 0,
    hoursSpent: 0
  });
  const [recentRooms, setRecentRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch public rooms for stats
      const publicRooms = await ApiService.getPublicRooms();
      
      // Fetch user's created rooms
      let userRooms = [];
      try {
        userRooms = await ApiService.getUserCreatedRooms();
      } catch (error) {
        console.log('Could not fetch user rooms:', error);
      }

      setStats({
        activeRooms: publicRooms.length,
        totalParticipants: publicRooms.reduce((sum, room) => sum + (room.participants?.length || 0), 0),
        myRooms: userRooms.length,
        hoursSpent: Math.floor(Math.random() * 50) + 10 // Mock data
      });

      setRecentRooms(publicRooms.slice(0, 3));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Active Rooms',
      value: stats.activeRooms,
      icon: VideoCameraIcon,
      change: '+12%',
      changeType: 'increase',
      color: 'bg-indigo-500'
    },
    {
      name: 'Total Participants',
      value: stats.totalParticipants,
      icon: UserGroupIcon,
      change: '+8%',
      changeType: 'increase',
      color: 'bg-green-500'
    },
    {
      name: 'My Rooms',
      value: stats.myRooms,
      icon: ChartBarIcon,
      change: '+3',
      changeType: 'increase',
      color: 'bg-purple-500'
    },
    {
      name: 'Hours Spent',
      value: stats.hoursSpent,
      icon: ClockIcon,
      change: '+2h',
      changeType: 'increase',
      color: 'bg-yellow-500'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome back, {currentUser?.displayName?.split(' ')[0] || 'there'}! 👋
              </h1>
              <p className="text-gray-400 mt-2">
                Ready to connect and collaborate? Here's what's happening today.
              </p>
            </div>
            
            <div className="flex space-x-4">
              <Link to="/rooms/create" className="btn-primary">
                <PlusIcon className="w-5 h-5" />
                <span>Create Room</span>
              </Link>
              
              <Link to="/rooms" className="btn-secondary">
                <VideoCameraIcon className="w-5 h-5" />
                <span>Browse Rooms</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={stat.name} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="flex items-center mt-4">
                <TrendingUpIcon className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-sm text-green-400">{stat.change}</span>
                <span className="text-sm text-gray-400 ml-1">from last week</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Rooms */}
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Active Rooms</h2>
              <Link to="/rooms" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                View all
              </Link>
            </div>

            {recentRooms.length === 0 ? (
              <div className="text-center py-12">
                <VideoCameraIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-300 mb-2">No Active Rooms</h3>
                <p className="text-gray-500 mb-6">Start your first room to begin collaborating!</p>
                <Link to="/rooms/create" className="btn-primary">
                  <PlusIcon className="w-5 h-5" />
                  <span>Create Room</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentRooms.map((room) => (
                  <div key={room.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-xl hover:bg-gray-750 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                        <VideoCameraIcon className="w-6 h-6 text-white" />
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-white">{room.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>Host: {room.hostName}</span>
                          <span className="flex items-center">
                            <UserGroupIcon className="w-4 h-4 mr-1" />
                            {room.participants?.length || 0}/{room.maxParticipants}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-400">Live</span>
                      </div>
                      
                      <Link
                        to={`/rooms/${room.id}`}
                        className="btn-primary text-sm px-4 py-2"
                      >
                        Join
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions & Tips */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/rooms/create" className="flex items-center space-x-3 p-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors">
                  <PlusIcon className="w-5 h-5 text-white" />
                  <div className="text-white">
                    <div className="font-medium">Create Room</div>
                    <div className="text-xs opacity-80">Start a new meeting</div>
                  </div>
                </Link>
                
                <Link to="/rooms" className="flex items-center space-x-3 p-3 bg-green-600 hover:bg-green-700 rounded-xl transition-colors">
                  <UserGroupIcon className="w-5 h-5 text-white" />
                  <div className="text-white">
                    <div className="font-medium">Join Room</div>
                    <div className="text-xs opacity-80">Browse active rooms</div>
                  </div>
                </Link>
                
                <Link to="/profile" className="flex items-center space-x-3 p-3 bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors">
                  <UserGroupIcon className="w-5 h-5 text-white" />
                  <div className="text-white">
                    <div className="font-medium">Update Profile</div>
                    <div className="text-xs opacity-80">Manage your portfolio</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Activity Summary */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-white mb-4">This Week</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Rooms Created</span>
                  <span className="text-white font-medium">{stats.myRooms}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Sessions Joined</span>
                  <span className="text-white font-medium">7</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Time Spent</span>
                  <span className="text-white font-medium">{stats.hoursSpent}h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Connections Made</span>
                  <span className="text-white font-medium">12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
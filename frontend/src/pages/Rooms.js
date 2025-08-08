import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/api';
import { 
  VideoCameraIcon,
  PlusIcon,
  UserGroupIcon,
  LockClosedIcon,
  GlobeAltIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const Rooms = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [publicRooms, setPublicRooms] = useState([]);
  const [myRooms, setMyRooms] = useState([]);
  const [privateRoomCode, setPrivateRoomCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [joinError, setJoinError] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      // Fetch public rooms
      const publicRoomsData = await ApiService.getPublicRooms();
      setPublicRooms(publicRoomsData);

      // Fetch user's rooms
      try {
        const myRoomsData = await ApiService.getUserCreatedRooms();
        setMyRooms(myRoomsData);
      } catch (error) {
        console.log('Could not fetch user rooms:', error);
        setMyRooms([]);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinPrivateRoom = async () => {
    if (privateRoomCode.length !== 6) {
      setJoinError('Please enter a 6-character access code');
      return;
    }

    try {
      setJoinError('');
      const room = await ApiService.joinRoomByCode(privateRoomCode);
      window.location.href = `/rooms/${room.id}`;
    } catch (error) {
      setJoinError(error.message || 'Invalid access code');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      return;
    }

    try {
      await ApiService.deleteRoom(roomId);
      fetchRooms(); // Refresh the list
    } catch (error) {
      alert('Failed to delete room: ' + error.message);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const created = new Date(timestamp);
    const diffInMinutes = Math.floor((now - created) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getRoomsToDisplay = () => {
    switch (activeTab) {
      case 'public':
        return publicRooms;
      case 'mine':
        return myRooms;
      default:
        return [...publicRooms, ...myRooms];
    }
  };

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Meeting Rooms</h1>
            <p className="text-gray-400">Connect, collaborate, and create together in real-time</p>
          </div>
          
          <Link to="/rooms/create" className="btn-primary">
            <PlusIcon className="w-5 h-5" />
            <span>Create Room</span>
          </Link>
        </div>

        {/* Join Private Room */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <LockClosedIcon className="w-5 h-5 mr-2 text-yellow-400" />
            Join Private Room
          </h2>
          <div className="flex space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={privateRoomCode}
                onChange={(e) => {
                  setPrivateRoomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6));
                  setJoinError('');
                }}
                className="input-field"
                placeholder="Enter 6-character access code"
                maxLength={6}
              />
              {joinError && (
                <p className="text-red-400 text-sm mt-2">{joinError}</p>
              )}
            </div>
            <button
              onClick={handleJoinPrivateRoom}
              disabled={privateRoomCode.length !== 6}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LockClosedIcon className="w-5 h-5" />
              <span>Join</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-800 p-1 rounded-xl w-fit">
          {[
            { key: 'all', label: 'All Rooms', count: publicRooms.length + myRooms.length },
            { key: 'public', label: 'Public', count: publicRooms.length },
            { key: 'mine', label: 'My Rooms', count: myRooms.length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                activeTab === tab.key 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className="bg-gray-700 text-xs px-2 py-1 rounded-full">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getRoomsToDisplay().map((room) => (
            <div key={room.id} className="card p-6 hover:bg-gray-750 transition-colors group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    room.isPrivate ? 'bg-yellow-600' : 'bg-green-600'
                  }`}>
                    {room.isPrivate ? (
                      <LockClosedIcon className="w-6 h-6 text-white" />
                    ) : (
                      <GlobeAltIcon className="w-6 h-6 text-white" />
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      {room.isPrivate ? (
                        <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded-full">
                          Private
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                          Public
                        </span>
                      )}
                      {room.hostId === currentUser.uid && (
                        <span className="px-2 py-1 bg-indigo-600 text-white text-xs rounded-full">
                          Host
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-sm text-gray-400">
                    <UserGroupIcon className="w-4 h-4" />
                    <span>{room.participants?.length || 0}/{room.maxParticipants}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatTimeAgo(room.createdAt)}
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-300">
                {room.name}
              </h3>
              
              {room.description && (
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {room.description}
                </p>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-400">
                  Host: {room.hostName}
                </div>
                
                {room.isPrivate && room.accessCode && (
                  <div className="text-xs text-gray-500 font-mono">
                    Code: {room.accessCode}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400">Active</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {room.hostId === currentUser.uid && (
                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                      title="Delete room"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                  
                  <Link
                    to={`/rooms/${room.id}`}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    <EyeIcon className="w-4 h-4" />
                    <span>Join</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {getRoomsToDisplay().length === 0 && (
          <div className="card p-12 text-center">
            <VideoCameraIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {activeTab === 'mine' ? 'No Rooms Created' : 'No Active Rooms'}
            </h3>
            <p className="text-gray-400 mb-6">
              {activeTab === 'mine' 
                ? 'Create your first room to start collaborating!'
                : 'Be the first to create a room and start connecting!'}
            </p>
            <Link to="/rooms/create" className="btn-primary">
              <PlusIcon className="w-5 h-5" />
              <span>Create Room</span>
            </Link>
          </div>
        )}

        {/* Room Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-indigo-400 mb-2">{publicRooms.length}</div>
            <div className="text-gray-400">Public Rooms</div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-green-400 mb-2">
              {publicRooms.reduce((acc, room) => acc + (room.participants?.length || 0), 0)}
            </div>
            <div className="text-gray-400">Active Participants</div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-2">{myRooms.length}</div>
            <div className="text-gray-400">Your Rooms</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
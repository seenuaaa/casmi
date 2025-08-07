import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { 
  VideoCameraIcon,
  PlusIcon,
  UserGroupIcon,
  LockClosedIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const Rooms = () => {
  const [publicRooms, setPublicRooms] = useState([]);
  const [privateRoomCode, setPrivateRoomCode] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to public rooms
    const publicRoomsQuery = query(
      collection(db, 'rooms'),
      where('isPrivate', '==', false),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(publicRoomsQuery, (snapshot) => {
      const rooms = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPublicRooms(rooms);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleJoinPrivateRoom = () => {
    if (privateRoomCode.length === 6) {
      // In a real implementation, you'd verify the room code exists first
      window.location.href = `/rooms/private-${privateRoomCode}`;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const created = timestamp.toDate();
    const diffInMinutes = Math.floor((now - created) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Study Rooms</h1>
            <p className="text-gray-400">Join or create video study sessions</p>
          </div>
          
          <Link to="/rooms/create" className="btn-primary">
            <PlusIcon className="w-5 h-5" />
            <span>Create Room</span>
          </Link>
        </div>

        {/* Join Private Room */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Join Private Room</h2>
          <div className="flex space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={privateRoomCode}
                onChange={(e) => setPrivateRoomCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="input-field"
                placeholder="Enter 6-digit room code"
                maxLength={6}
              />
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

        {/* Public Rooms */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <GlobeAltIcon className="w-6 h-6 text-green-400" />
            <span>Public Rooms ({publicRooms.length})</span>
          </h2>
        </div>

        {publicRooms.length === 0 ? (
          <div className="card p-12 text-center">
            <VideoCameraIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Active Rooms</h3>
            <p className="text-gray-400 mb-6">Be the first to create a study room!</p>
            <Link to="/rooms/create" className="btn-primary">
              <PlusIcon className="w-5 h-5" />
              <span>Create First Room</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicRooms.map((room) => (
              <div key={room.id} className="card p-6 hover:bg-gray-750 transition-colors group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                    <VideoCameraIcon className="w-6 h-6 text-white" />
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

                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-300">
                  {room.name}
                </h3>
                
                {room.description && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {room.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Host: {room.hostName}
                  </div>
                  
                  <Link
                    to={`/rooms/${room.id}`}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    Join Room
                  </Link>
                </div>
                
                {/* Room Status Indicator */}
                <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-700">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400">Live Now</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-green-400 mb-2">{publicRooms.length}</div>
            <div className="text-gray-400">Active Rooms</div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-indigo-400 mb-2">
              {publicRooms.reduce((acc, room) => acc + (room.participants?.length || 0), 0)}
            </div>
            <div className="text-gray-400">Online Users</div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-2">247</div>
            <div className="text-gray-400">Sessions This Week</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
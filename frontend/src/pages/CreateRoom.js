import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createRoom } from '../firebase';
import { 
  VideoCameraIcon,
  LockClosedIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const CreateRoom = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [roomData, setRoomData] = useState({
    name: '',
    description: '',
    isPrivate: false,
    maxParticipants: 4
  });

  const generateRoomCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const roomCode = roomData.isPrivate ? generateRoomCode() : null;
      
      const newRoomData = {
        ...roomData,
        hostId: currentUser.uid,
        hostName: currentUser.displayName || currentUser.email.split('@')[0],
        roomCode,
        isActive: true,
        createdAt: new Date(),
        participants: []
      };

      const roomId = await createRoom(newRoomData);
      if (roomId) {
        navigate(`/rooms/${roomId}`);
      } else {
        alert('Error creating room');
      }
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Error creating room');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <VideoCameraIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Study Room</h1>
          <p className="text-gray-400">Start a video session for collaborative learning</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Room Name */}
            <div>
              <label className="label">Room Name</label>
              <input
                type="text"
                value={roomData.name}
                onChange={(e) => setRoomData(prev => ({ ...prev, name: e.target.value }))}
                className="input-field"
                placeholder="e.g., JavaScript Study Group"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="label">Description</label>
              <textarea
                value={roomData.description}
                onChange={(e) => setRoomData(prev => ({ ...prev, description: e.target.value }))}
                className="input-field resize-none"
                rows={3}
                placeholder="What will you be studying or discussing?"
              />
            </div>

            {/* Max Participants */}
            <div>
              <label className="label">Maximum Participants</label>
              <select
                value={roomData.maxParticipants}
                onChange={(e) => setRoomData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                className="input-field"
              >
                <option value={2}>2 people</option>
                <option value={4}>4 people</option>
                <option value={6}>6 people</option>
                <option value={8}>8 people</option>
              </select>
            </div>

            {/* Privacy Settings */}
            <div className="space-y-4">
              <label className="label">Room Privacy</label>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="privacy"
                    checked={!roomData.isPrivate}
                    onChange={() => setRoomData(prev => ({ ...prev, isPrivate: false }))}
                    className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
                  />
                  <div className="flex items-center space-x-3">
                    <GlobeAltIcon className="w-5 h-5 text-green-400" />
                    <div>
                      <div className="text-white font-medium">Public Room</div>
                      <div className="text-sm text-gray-400">Anyone can join and see this room</div>
                    </div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="privacy"
                    checked={roomData.isPrivate}
                    onChange={() => setRoomData(prev => ({ ...prev, isPrivate: true }))}
                    className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
                  />
                  <div className="flex items-center space-x-3">
                    <LockClosedIcon className="w-5 h-5 text-yellow-400" />
                    <div>
                      <div className="text-white font-medium">Private Room</div>
                      <div className="text-sm text-gray-400">Only people with the room code can join</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6 border-t border-gray-700">
              <button
                type="button"
                onClick={() => navigate('/rooms')}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <>
                    <VideoCameraIcon className="w-5 h-5" />
                    <span>Create Room</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="card p-4">
            <h3 className="font-semibold text-white mb-2">Room Features</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• HD video and audio</li>
              <li>• Screen sharing</li>
              <li>• Chat messaging</li>
              <li>• Mute controls</li>
            </ul>
          </div>
          
          <div className="card p-4">
            <h3 className="font-semibold text-white mb-2">Best Practices</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Use headphones to avoid echo</li>
              <li>• Good lighting helps</li>
              <li>• Stable internet connection</li>
              <li>• Mute when not speaking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
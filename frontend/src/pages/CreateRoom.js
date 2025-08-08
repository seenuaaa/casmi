import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/api';
import {
  VideoCameraIcon,
  LockClosedIcon,
  GlobeAltIcon,
  UserGroupIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const CreateRoom = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: false,
    maxParticipants: 10
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Room name is required');
      return;
    }

    if (formData.name.length < 3) {
      setError('Room name must be at least 3 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const roomData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        isPrivate: formData.isPrivate,
        maxParticipants: parseInt(formData.maxParticipants)
      };

      const room = await ApiService.createRoom(roomData);
      
      // Redirect to the newly created room
      navigate(`/rooms/${room.id}`);
    } catch (error) {
      console.error('Error creating room:', error);
      setError(error.message || 'Failed to create room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <VideoCameraIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create New Room</h1>
          <p className="text-gray-400">Start a video meeting and invite others to join</p>
        </div>

        {/* Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 flex items-center space-x-3">
                <InformationCircleIcon className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="text-red-400">{error}</span>
              </div>
            )}

            {/* Room Name */}
            <div>
              <label className="label">Room Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="input-field"
                placeholder="Enter a memorable room name"
                maxLength={100}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Choose a clear name that describes your meeting purpose
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="label">Description (Optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="input-field resize-none"
                rows={3}
                placeholder="What's this meeting about? (optional)"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                Help others understand what you'll be discussing
              </p>
            </div>

            {/* Room Type */}
            <div>
              <label className="label">Room Type</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleInputChange('isPrivate', false)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    !formData.isPrivate
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      !formData.isPrivate ? 'bg-green-600' : 'bg-gray-600'
                    }`}>
                      <GlobeAltIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-white">Public Room</div>
                      <div className="text-sm text-gray-400">Anyone can join</div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleInputChange('isPrivate', true)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.isPrivate
                      ? 'border-yellow-500 bg-yellow-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      formData.isPrivate ? 'bg-yellow-600' : 'bg-gray-600'
                    }`}>
                      <LockClosedIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-white">Private Room</div>
                      <div className="text-sm text-gray-400">Invitation only</div>
                    </div>
                  </div>
                </button>
              </div>
              
              {formData.isPrivate && (
                <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500 rounded-lg">
                  <div className="flex items-center space-x-2 text-yellow-400">
                    <LockClosedIcon className="w-4 h-4" />
                    <span className="text-sm">
                      Private room will generate a 6-character access code that you can share with invitees
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Max Participants */}
            <div>
              <label className="label">Maximum Participants</label>
              <div className="flex items-center space-x-4">
                <UserGroupIcon className="w-5 h-5 text-gray-400" />
                <select
                  value={formData.maxParticipants}
                  onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                  className="input-field flex-1"
                >
                  {[2, 4, 6, 8, 10, 15, 20, 25, 30, 50].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'participant' : 'participants'}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Including yourself. You can always change this later.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-700">
              <button
                type="button"
                onClick={() => navigate('/rooms')}
                className="btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading || !formData.name.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="loading-spinner"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <VideoCameraIcon className="w-5 h-5" />
                    <span>Create Room</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tips */}
        <div className="mt-8 card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">💡 Pro Tips</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>• Use descriptive room names like "Project Alpha Planning" instead of "Meeting"</li>
            <li>• Private rooms are great for sensitive discussions or team-only meetings</li>
            <li>• You can delete rooms you created at any time from the Rooms page</li>
            <li>• Room participants can see each other's profiles and connect</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
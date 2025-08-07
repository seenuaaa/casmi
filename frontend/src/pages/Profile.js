import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, storage, logOut } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { 
  UserCircleIcon, 
  CameraIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState({
    displayName: '',
    email: '',
    college: '',
    bio: '',
    photoURL: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setProfile({
              displayName: userData.displayName || currentUser.displayName || '',
              email: currentUser.email,
              college: userData.college || '',
              bio: userData.bio || '',
              photoURL: userData.photoURL || currentUser.photoURL || ''
            });
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, [currentUser]);

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUpdating(true);
    try {
      const imageRef = ref(storage, `avatars/${currentUser.uid}`);
      await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(imageRef);
      
      setProfile(prev => ({
        ...prev,
        photoURL: downloadURL
      }));

      await updateDoc(doc(db, 'users', currentUser.uid), {
        photoURL: downloadURL
      });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
    setUpdating(false);
  };

  const handleSave = async () => {
    setUpdating(true);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        displayName: profile.displayName,
        college: profile.college,
        bio: profile.bio
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
    setUpdating(false);
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/signin');
    } catch (error) {
      console.error('Error logging out:', error);
    }
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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
          <button
            onClick={handleLogout}
            className="btn-secondary"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

        <div className="card p-8 space-y-8">
          {/* Avatar Section */}
          <div className="text-center">
            <div className="relative inline-block">
              {profile.photoURL ? (
                <img
                  src={profile.photoURL}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-600"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center border-4 border-gray-600">
                  <UserCircleIcon className="w-20 h-20 text-gray-400" />
                </div>
              )}
              
              <label className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 rounded-full p-2 cursor-pointer transition-colors">
                <CameraIcon className="w-5 h-5 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            
            <h2 className="text-xl font-semibold text-white mt-4">
              {profile.displayName || 'Anonymous User'}
            </h2>
            <p className="text-gray-400">{profile.email}</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                value={profile.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                className="input-field"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="label">Email</label>
              <input
                type="email"
                value={profile.email}
                className="input-field opacity-50 cursor-not-allowed"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="label">College/University</label>
              <input
                type="text"
                value={profile.college}
                onChange={(e) => handleInputChange('college', e.target.value)}
                className="input-field"
                placeholder="Enter your college or university"
              />
            </div>

            <div>
              <label className="label">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="input-field resize-none"
                rows={4}
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-700">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
            >
              Cancel
            </button>
            
            <button
              onClick={handleSave}
              disabled={updating}
              className="btn-primary"
            >
              {updating ? (
                <div className="loading-spinner"></div>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </div>

        {/* Account Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-indigo-400 mb-2">12</div>
            <div className="text-gray-400">Tests Completed</div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-green-400 mb-2">85%</div>
            <div className="text-gray-400">Average Score</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
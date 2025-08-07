import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db, joinRoom } from '../firebase';
import { doc, onSnapshot, collection, updateDoc } from 'firebase/firestore';
import {
  VideoCameraIcon,
  MicrophoneIcon,
  PhoneXMarkIcon,
  ChatBubbleLeftEllipsisIcon,
  ComputerDesktopIcon,
  VideoCameraSlashIcon as VideoCameraOffIcon,
  SpeakerXMarkIcon as MicrophoneOffIcon
} from '@heroicons/react/24/outline';

const VideoRoom = () => {
  const { roomId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  
  const localVideoRef = useRef();
  const remoteVideosRef = useRef({});

  useEffect(() => {
    if (!currentUser || !roomId) return;

    // Listen to room data
    const roomRef = doc(db, 'rooms', roomId);
    const unsubscribeRoom = onSnapshot(roomRef, (doc) => {
      if (doc.exists()) {
        setRoom(doc.data());
      } else {
        navigate('/rooms');
      }
    });

    // Listen to participants
    const participantsRef = collection(db, `rooms/${roomId}/participants`);
    const unsubscribeParticipants = onSnapshot(participantsRef, (snapshot) => {
      const participantList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setParticipants(participantList);
    });

    // Join the room
    joinRoom(roomId, currentUser.uid);

    // Initialize local video
    initializeLocalVideo();

    return () => {
      unsubscribeRoom();
      unsubscribeParticipants();
      cleanupVideo();
    };
  }, [roomId, currentUser, navigate]);

  const initializeLocalVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      setIsVideoEnabled(false);
      setIsAudioEnabled(false);
    }
  };

  const cleanupVideo = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const tracks = localVideoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const toggleVideo = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const videoTrack = localVideoRef.current.srcObject.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setIsVideoEnabled(!isVideoEnabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const audioTrack = localVideoRef.current.srcObject.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
        setIsAudioEnabled(!isAudioEnabled);
      }
    }
  };

  const leaveRoom = () => {
    cleanupVideo();
    navigate('/rooms');
  };

  const sendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: Date.now(),
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email.split('@')[0],
        message: chatMessage.trim(),
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, newMessage]);
      setChatMessage('');
    }
  };

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white">{room.name}</h1>
            <p className="text-sm text-gray-400">{participants.length} participants</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowChat(!showChat)}
              className={`p-2 rounded-lg transition-colors ${showChat ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 p-6">
          {/* Main Video Grid */}
          <div className="video-grid h-full">
            {/* Local Video */}
            <div className="video-container relative">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              
              {!isVideoEnabled && (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <VideoCameraOffIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-white font-medium">You (Camera Off)</p>
                  </div>
                </div>
              )}
              
              <div className="absolute bottom-4 left-4 bg-black/50 text-white text-sm px-2 py-1 rounded">
                You {!isAudioEnabled && '(Muted)'}
              </div>
            </div>

            {/* Remote Videos */}
            {participants.filter(p => p.id !== currentUser.uid).map(participant => (
              <div key={participant.id} className="video-container relative">
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <VideoCameraIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-white font-medium">{participant.userId}</p>
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-4 bg-black/50 text-white text-sm px-2 py-1 rounded">
                  {participant.userId}
                </div>
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: Math.max(0, room.maxParticipants - participants.length) }, (_, i) => (
              <div key={`empty-${i}`} className="video-container border-2 border-dashed border-gray-600">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="w-12 h-12 border-2 border-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <VideoCameraIcon className="w-6 h-6" />
                    </div>
                    <p className="text-sm">Waiting for participant</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-4 bg-gray-800 rounded-2xl p-4 shadow-lg">
              <button
                onClick={toggleAudio}
                className={`p-3 rounded-xl transition-colors ${
                  isAudioEnabled 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {isAudioEnabled ? (
                  <MicrophoneIcon className="w-6 h-6" />
                ) : (
                  <MicrophoneOffIcon className="w-6 h-6" />
                )}
              </button>

              <button
                onClick={toggleVideo}
                className={`p-3 rounded-xl transition-colors ${
                  isVideoEnabled 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {isVideoEnabled ? (
                  <VideoCameraIcon className="w-6 h-6" />
                ) : (
                  <VideoCameraOffIcon className="w-6 h-6" />
                )}
              </button>

              <button className="p-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white transition-colors">
                <ComputerDesktopIcon className="w-6 h-6" />
              </button>

              <button
                onClick={leaveRoom}
                className="p-3 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                <PhoneXMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Chat</h3>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map(msg => (
                <div key={msg.id} className="text-sm">
                  <div className="font-medium text-indigo-400">{msg.userName}</div>
                  <div className="text-white">{msg.message}</div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="input-field flex-1 text-sm"
                  placeholder="Type a message..."
                />
                <button
                  onClick={sendMessage}
                  className="btn-primary px-4"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoRoom;
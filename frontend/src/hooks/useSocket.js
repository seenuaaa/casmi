import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';

const useSocket = () => {
  const socketRef = useRef(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      
      socketRef.current = io(BACKEND_URL, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
      });

      socketRef.current.on('connect', () => {
        console.log('🔗 Connected to server');
      });

      socketRef.current.on('disconnect', () => {
        console.log('🔌 Disconnected from server');
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Connection error:', error);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, [currentUser]);

  return socketRef.current;
};

export default useSocket;
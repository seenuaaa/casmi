const { db } = require('../config/firebase-admin');

const socketHandler = (io) => {
  // Store active connections
  const activeConnections = new Map();
  const roomParticipants = new Map();

  io.on('connection', (socket) => {
    console.log(`👤 User connected: ${socket.id}`);

    // User joins a room
    socket.on('join-room', async (data) => {
      try {
        const { roomId, userId, userInfo } = data;
        
        // Join socket room
        socket.join(roomId);
        
        // Store user info
        activeConnections.set(socket.id, {
          userId,
          roomId,
          userInfo: {
            name: userInfo.name || 'Anonymous',
            photoURL: userInfo.photoURL || '',
            email: userInfo.email || ''
          }
        });

        // Add to room participants map
        if (!roomParticipants.has(roomId)) {
          roomParticipants.set(roomId, new Map());
        }
        roomParticipants.get(roomId).set(userId, {
          socketId: socket.id,
          ...userInfo,
          joinedAt: new Date()
        });

        // Update Firestore
        const roomRef = db.collection('rooms').doc(roomId);
        const roomDoc = await roomRef.get();
        
        if (roomDoc.exists) {
          const participants = roomParticipants.get(roomId);
          const participantsList = Array.from(participants.values()).map(p => ({
            userId: p.userId,
            name: p.name,
            photoURL: p.photoURL,
            joinedAt: p.joinedAt
          }));

          await roomRef.update({
            participants: participantsList,
            updatedAt: new Date()
          });
        }

        // Notify others in the room
        socket.to(roomId).emit('user-joined', {
          userId,
          userInfo: activeConnections.get(socket.id).userInfo
        });

        // Send current participants to the new user
        const currentParticipants = roomParticipants.get(roomId);
        socket.emit('room-participants', Array.from(currentParticipants.values()));

        console.log(`👥 User ${userId} joined room ${roomId}`);
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Handle WebRTC signaling
    socket.on('webrtc-offer', (data) => {
      const { to, offer, from } = data;
      socket.to(to).emit('webrtc-offer', {
        from: socket.id,
        offer,
        fromUserId: from
      });
    });

    socket.on('webrtc-answer', (data) => {
      const { to, answer, from } = data;
      socket.to(to).emit('webrtc-answer', {
        from: socket.id,
        answer,
        fromUserId: from
      });
    });

    socket.on('webrtc-ice-candidate', (data) => {
      const { to, candidate, from } = data;
      socket.to(to).emit('webrtc-ice-candidate', {
        from: socket.id,
        candidate,
        fromUserId: from
      });
    });

    // Chat messages
    socket.on('chat-message', (data) => {
      const userConnection = activeConnections.get(socket.id);
      if (userConnection) {
        const messageData = {
          id: Date.now().toString(),
          message: data.message,
          userId: userConnection.userId,
          userName: userConnection.userInfo.name,
          userPhoto: userConnection.userInfo.photoURL,
          timestamp: new Date(),
          type: 'text'
        };

        // Broadcast to all users in the room
        io.to(userConnection.roomId).emit('chat-message', messageData);
        console.log(`💬 Chat message in room ${userConnection.roomId}: ${data.message}`);
      }
    });

    // Video/Audio status updates
    socket.on('toggle-video', (data) => {
      const userConnection = activeConnections.get(socket.id);
      if (userConnection) {
        socket.to(userConnection.roomId).emit('user-video-toggle', {
          userId: userConnection.userId,
          isVideoEnabled: data.isVideoEnabled
        });
      }
    });

    socket.on('toggle-audio', (data) => {
      const userConnection = activeConnections.get(socket.id);
      if (userConnection) {
        socket.to(userConnection.roomId).emit('user-audio-toggle', {
          userId: userConnection.userId,
          isAudioEnabled: data.isAudioEnabled
        });
      }
    });

    // Screen sharing
    socket.on('start-screen-share', () => {
      const userConnection = activeConnections.get(socket.id);
      if (userConnection) {
        socket.to(userConnection.roomId).emit('user-started-screen-share', {
          userId: userConnection.userId
        });
      }
    });

    socket.on('stop-screen-share', () => {
      const userConnection = activeConnections.get(socket.id);
      if (userConnection) {
        socket.to(userConnection.roomId).emit('user-stopped-screen-share', {
          userId: userConnection.userId
        });
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log(`👤 User disconnected: ${socket.id}`);
      
      const userConnection = activeConnections.get(socket.id);
      if (userConnection) {
        const { roomId, userId } = userConnection;
        
        // Remove from room participants
        if (roomParticipants.has(roomId)) {
          roomParticipants.get(roomId).delete(userId);
          
          // Update Firestore
          try {
            const roomRef = db.collection('rooms').doc(roomId);
            const participants = roomParticipants.get(roomId);
            const participantsList = Array.from(participants.values()).map(p => ({
              userId: p.userId,
              name: p.name,
              photoURL: p.photoURL,
              joinedAt: p.joinedAt
            }));

            await roomRef.update({
              participants: participantsList,
              updatedAt: new Date()
            });

            // If room is empty, you might want to deactivate it
            if (participants.size === 0) {
              roomParticipants.delete(roomId);
              // Optionally mark room as inactive if empty for too long
            }
          } catch (error) {
            console.error('Error updating room on disconnect:', error);
          }
        }
        
        // Notify others in the room
        socket.to(roomId).emit('user-left', {
          userId,
          userInfo: userConnection.userInfo
        });
        
        console.log(`👥 User ${userId} left room ${roomId}`);
      }
      
      activeConnections.delete(socket.id);
    });

    // Explicit leave room
    socket.on('leave-room', async () => {
      const userConnection = activeConnections.get(socket.id);
      if (userConnection) {
        const { roomId, userId } = userConnection;
        
        socket.leave(roomId);
        
        // Remove from room participants
        if (roomParticipants.has(roomId)) {
          roomParticipants.get(roomId).delete(userId);
        }
        
        socket.to(roomId).emit('user-left', {
          userId,
          userInfo: userConnection.userInfo
        });
        
        activeConnections.delete(socket.id);
        console.log(`👥 User ${userId} explicitly left room ${roomId}`);
      }
    });
  });

  // Cleanup inactive connections periodically
  setInterval(() => {
    const now = new Date();
    roomParticipants.forEach((participants, roomId) => {
      participants.forEach((participant, userId) => {
        // Remove participants inactive for more than 1 hour
        if (now - participant.joinedAt > 60 * 60 * 1000) {
          participants.delete(userId);
          console.log(`🧹 Cleaned up inactive participant ${userId} from room ${roomId}`);
        }
      });
      
      if (participants.size === 0) {
        roomParticipants.delete(roomId);
        console.log(`🧹 Cleaned up empty room ${roomId}`);
      }
    });
  }, 10 * 60 * 1000); // Run every 10 minutes
};

module.exports = socketHandler;
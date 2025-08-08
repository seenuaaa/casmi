const express = require('express');
const { db } = require('../config/firebase-admin');
const { authenticateUser } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Get all public rooms
router.get('/public', async (req, res) => {
  try {
    const snapshot = await db.collection('rooms')
      .where('isPrivate', '==', false)
      .where('isActive', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const rooms = [];
    snapshot.forEach(doc => {
      rooms.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
      });
    });

    res.json(rooms);
  } catch (error) {
    console.error('Error fetching public rooms:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Get room by ID
router.get('/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const roomDoc = await db.collection('rooms').doc(roomId).get();
    
    if (!roomDoc.exists) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const roomData = roomDoc.data();
    res.json({
      id: roomDoc.id,
      ...roomData,
      createdAt: roomData.createdAt?.toDate?.() || roomData.createdAt
    });
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ error: 'Failed to fetch room' });
  }
});

// Create a new room
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { name, description, isPrivate, maxParticipants = 10 } = req.body;
    
    if (!name?.trim()) {
      return res.status(400).json({ error: 'Room name is required' });
    }

    const roomData = {
      name: name.trim(),
      description: description?.trim() || '',
      isPrivate: Boolean(isPrivate),
      isActive: true,
      maxParticipants: Math.max(2, Math.min(maxParticipants, 50)),
      hostId: req.user.uid,
      hostName: req.user.name || req.user.email?.split('@')[0] || 'Anonymous',
      accessCode: isPrivate ? Math.random().toString(36).substr(2, 6).toUpperCase() : null,
      participants: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const roomRef = await db.collection('rooms').add(roomData);
    
    res.status(201).json({
      id: roomRef.id,
      ...roomData
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// Join room by access code (for private rooms)
router.post('/join/:accessCode', authenticateUser, async (req, res) => {
  try {
    const { accessCode } = req.params;
    
    const snapshot = await db.collection('rooms')
      .where('accessCode', '==', accessCode.toUpperCase())
      .where('isActive', '==', true)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'Invalid access code or room not found' });
    }

    const roomDoc = snapshot.docs[0];
    const roomData = roomDoc.data();

    // Check if room is full
    if (roomData.participants && roomData.participants.length >= roomData.maxParticipants) {
      return res.status(400).json({ error: 'Room is full' });
    }

    res.json({
      id: roomDoc.id,
      ...roomData,
      createdAt: roomData.createdAt?.toDate?.() || roomData.createdAt
    });
  } catch (error) {
    console.error('Error joining room:', error);
    res.status(500).json({ error: 'Failed to join room' });
  }
});

// Delete room (only host can delete)
router.delete('/:roomId', authenticateUser, async (req, res) => {
  try {
    const { roomId } = req.params;
    const roomDoc = await db.collection('rooms').doc(roomId).get();
    
    if (!roomDoc.exists) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const roomData = roomDoc.data();
    
    // Check if user is the host
    if (roomData.hostId !== req.user.uid) {
      return res.status(403).json({ error: 'Only the host can delete the room' });
    }

    // Soft delete by setting isActive to false
    await db.collection('rooms').doc(roomId).update({
      isActive: false,
      updatedAt: new Date()
    });

    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ error: 'Failed to delete room' });
  }
});

// Get user's created rooms
router.get('/user/created', authenticateUser, async (req, res) => {
  try {
    const snapshot = await db.collection('rooms')
      .where('hostId', '==', req.user.uid)
      .where('isActive', '==', true)
      .orderBy('createdAt', 'desc')
      .get();

    const rooms = [];
    snapshot.forEach(doc => {
      rooms.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
      });
    });

    res.json(rooms);
  } catch (error) {
    console.error('Error fetching user rooms:', error);
    res.status(500).json({ error: 'Failed to fetch user rooms' });
  }
});

module.exports = router;
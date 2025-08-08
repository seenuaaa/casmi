const express = require('express');
const { db } = require('../config/firebase-admin');
const { authenticateUser } = require('../middleware/auth');
const router = express.Router();

// Get user profile
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    
    if (!userDoc.exists) {
      // Create default profile if doesn't exist
      const defaultProfile = {
        uid: req.user.uid,
        email: req.user.email,
        displayName: req.user.name || req.user.email?.split('@')[0] || 'Anonymous',
        photoURL: req.user.picture || '',
        bio: '',
        skills: [],
        experience: [],
        education: [],
        portfolio: [],
        social: {
          linkedin: '',
          github: '',
          website: ''
        },
        preferences: {
          isProfilePublic: true,
          allowMessages: true
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await db.collection('users').doc(req.user.uid).set(defaultProfile);
      return res.json(defaultProfile);
    }

    const userData = userDoc.data();
    res.json({
      ...userData,
      createdAt: userData.createdAt?.toDate?.() || userData.createdAt,
      updatedAt: userData.updatedAt?.toDate?.() || userData.updatedAt
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', authenticateUser, async (req, res) => {
  try {
    const {
      displayName,
      bio,
      skills = [],
      experience = [],
      education = [],
      portfolio = [],
      social = {},
      preferences = {}
    } = req.body;

    const updates = {
      displayName: displayName?.trim() || req.user.name || 'Anonymous',
      bio: bio?.trim() || '',
      skills: Array.isArray(skills) ? skills.slice(0, 20) : [], // Limit skills
      experience: Array.isArray(experience) ? experience.slice(0, 10) : [],
      education: Array.isArray(education) ? education.slice(0, 10) : [],
      portfolio: Array.isArray(portfolio) ? portfolio.slice(0, 10) : [],
      social: {
        linkedin: social.linkedin?.trim() || '',
        github: social.github?.trim() || '',
        website: social.website?.trim() || ''
      },
      preferences: {
        isProfilePublic: Boolean(preferences.isProfilePublic),
        allowMessages: Boolean(preferences.allowMessages)
      },
      updatedAt: new Date()
    };

    await db.collection('users').doc(req.user.uid).update(updates);
    
    // Get updated profile
    const updatedDoc = await db.collection('users').doc(req.user.uid).get();
    const updatedData = updatedDoc.data();
    
    res.json({
      ...updatedData,
      createdAt: updatedData.createdAt?.toDate?.() || updatedData.createdAt,
      updatedAt: updatedData.updatedAt?.toDate?.() || updatedData.updatedAt
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get public user profile (for viewing other users)
router.get('/:userId/public', async (req, res) => {
  try {
    const { userId } = req.params;
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    
    // Check if profile is public
    if (!userData.preferences?.isProfilePublic) {
      return res.status(403).json({ error: 'Profile is private' });
    }

    // Return only public information
    const publicProfile = {
      uid: userData.uid,
      displayName: userData.displayName || 'Anonymous',
      photoURL: userData.photoURL || '',
      bio: userData.bio || '',
      skills: userData.skills || [],
      experience: userData.experience || [],
      education: userData.education || [],
      portfolio: userData.portfolio || [],
      social: userData.social || {},
      createdAt: userData.createdAt?.toDate?.() || userData.createdAt
    };

    res.json(publicProfile);
  } catch (error) {
    console.error('Error fetching public profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Search users by skills or name
router.get('/search', async (req, res) => {
  try {
    const { q, skills } = req.query;
    
    if (!q && !skills) {
      return res.status(400).json({ error: 'Search query or skills required' });
    }

    let query = db.collection('users')
      .where('preferences.isProfilePublic', '==', true);

    // Note: Firestore doesn't support full-text search
    // In production, you'd use Algolia, Elasticsearch, or Cloud Search
    const snapshot = await query.limit(50).get();
    
    let users = [];
    snapshot.forEach(doc => {
      const userData = doc.data();
      users.push({
        uid: userData.uid,
        displayName: userData.displayName || 'Anonymous',
        photoURL: userData.photoURL || '',
        bio: userData.bio || '',
        skills: userData.skills || []
      });
    });

    // Client-side filtering for demo purposes
    if (q) {
      const searchTerm = q.toLowerCase();
      users = users.filter(user => 
        user.displayName.toLowerCase().includes(searchTerm) ||
        user.bio.toLowerCase().includes(searchTerm) ||
        user.skills.some(skill => skill.toLowerCase().includes(searchTerm))
      );
    }

    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim().toLowerCase());
      users = users.filter(user =>
        user.skills.some(skill => 
          skillsArray.includes(skill.toLowerCase())
        )
      );
    }

    res.json(users.slice(0, 20)); // Limit results
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

module.exports = router;
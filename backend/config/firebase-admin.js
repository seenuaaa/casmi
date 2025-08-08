const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    // In production, you would use a service account key file
    // For development/testing, we'll use a mock setup if credentials fail
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID || 'cosmivity'
    });
    console.log('🔥 Firebase Admin initialized successfully');
  } catch (error) {
    console.warn('⚠️ Firebase Admin initialization failed, using mock setup for testing:', error.message);
    // Fallback initialization for development/testing
    try {
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'cosmivity'
      });
      console.log('🔥 Firebase Admin initialized with basic config');
    } catch (fallbackError) {
      console.error('❌ Firebase Admin fallback initialization failed:', fallbackError.message);
    }
  }
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
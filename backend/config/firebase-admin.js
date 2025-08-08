const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    // In production, you would use a service account key file
    // For development, we'll use the default credentials
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID || 'cosmivity'
    });
    console.log('🔥 Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
    // Fallback initialization for development
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'cosmivity'
    });
  }
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
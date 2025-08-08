const admin = require('firebase-admin');

// Mock Firestore for testing when Firebase is not available
class MockFirestore {
  constructor() {
    this.collections = new Map();
  }

  collection(name) {
    if (!this.collections.has(name)) {
      this.collections.set(name, new MockCollection());
    }
    return this.collections.get(name);
  }
}

class MockCollection {
  constructor() {
    this.docs = new Map();
    this.queryConstraints = [];
  }

  where(field, operator, value) {
    const newCollection = new MockCollection();
    newCollection.docs = this.docs;
    newCollection.queryConstraints = [...this.queryConstraints, { field, operator, value }];
    return newCollection;
  }

  orderBy(field, direction = 'asc') {
    const newCollection = new MockCollection();
    newCollection.docs = this.docs;
    newCollection.queryConstraints = [...this.queryConstraints, { type: 'orderBy', field, direction }];
    return newCollection;
  }

  limit(count) {
    const newCollection = new MockCollection();
    newCollection.docs = this.docs;
    newCollection.queryConstraints = [...this.queryConstraints, { type: 'limit', count }];
    return newCollection;
  }

  async get() {
    // Return empty results for mock
    return {
      empty: true,
      docs: [],
      forEach: () => {}
    };
  }

  doc(id) {
    return new MockDocument(id);
  }

  async add(data) {
    const id = 'mock-' + Date.now();
    return { id };
  }
}

class MockDocument {
  constructor(id) {
    this.id = id;
  }

  async get() {
    return {
      exists: false,
      id: this.id,
      data: () => null
    };
  }

  async set(data) {
    return { writeTime: new Date() };
  }

  async update(data) {
    return { writeTime: new Date() };
  }
}

// Initialize Firebase Admin SDK
let db, auth;
let isFirebaseAvailable = false;

if (!admin.apps.length) {
  try {
    // In production, you would use a service account key file
    // For development/testing, we'll use a mock setup if credentials fail
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID || 'cosmivity'
    });
    console.log('🔥 Firebase Admin initialized successfully');
    isFirebaseAvailable = true;
  } catch (error) {
    console.warn('⚠️ Firebase Admin initialization failed, using mock setup for testing:', error.message);
    // Fallback initialization for development/testing
    try {
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'cosmivity'
      });
      console.log('🔥 Firebase Admin initialized with basic config');
      isFirebaseAvailable = true;
    } catch (fallbackError) {
      console.error('❌ Firebase Admin fallback initialization failed, using mock Firestore:', fallbackError.message);
      isFirebaseAvailable = false;
    }
  }
}

// Set up db and auth
if (isFirebaseAvailable) {
  try {
    db = admin.firestore();
    auth = admin.auth();
    console.log('✅ Firebase Firestore and Auth initialized');
  } catch (error) {
    console.warn('⚠️ Firebase services not available, using mock implementations');
    db = new MockFirestore();
    auth = null;
    isFirebaseAvailable = false;
  }
} else {
  console.log('🧪 Using mock Firestore for testing');
  db = new MockFirestore();
  auth = null;
}

module.exports = { admin, db, auth, isFirebaseAvailable };
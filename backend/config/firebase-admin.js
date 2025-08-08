const admin = require('firebase-admin');

// Initialize Firebase Admin SDK with project-only approach for development
let db, auth;
let isFirebaseAvailable = false;

if (!admin.apps.length) {
  try {
    // Simple project-based initialization for Firebase
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'cosmivity',
      // Use the Firebase project without authentication for basic operations
    });
    
    console.log('🔥 Firebase Admin initialized with project ID');
    
    // Try to access Firestore
    db = admin.firestore();
    auth = admin.auth();
    
    // Test Firestore connection
    db.collection('test').limit(1).get()
      .then(() => {
        console.log('✅ Firestore connection successful');
        isFirebaseAvailable = true;
      })
      .catch(error => {
        console.warn('⚠️ Firestore connection failed, using read-only mode:', error.message);
        // Keep db reference but mark as limited functionality
        isFirebaseAvailable = false;
      });
      
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error.message);
    
    // Create mock implementations for development
    console.log('🧪 Creating mock Firebase services for development');
    
    db = createMockFirestore();
    auth = null;
    isFirebaseAvailable = false;
  }
} else {
  // Use existing app
  const app = admin.app();
  db = admin.firestore();
  auth = admin.auth();
  isFirebaseAvailable = true;
}

// Mock Firestore implementation for development
function createMockFirestore() {
  const mockData = {
    rooms: [
      {
        id: 'mock-room-1',
        name: 'Development Test Room',
        description: 'A test room for development',
        isPrivate: false,
        isActive: true,
        hostId: 'mock-user-1',
        hostName: 'Test User',
        maxParticipants: 10,
        participants: [],
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date()
      },
      {
        id: 'mock-room-2',
        name: 'Private Meeting Room',
        description: 'A private test room',
        isPrivate: true,
        isActive: true,
        hostId: 'mock-user-2',
        hostName: 'Another User',
        accessCode: 'ABC123',
        maxParticipants: 6,
        participants: [{
          userId: 'mock-user-3',
          name: 'Participant',
          joinedAt: new Date()
        }],
        createdAt: new Date('2025-01-02T00:00:00.000Z'),
        updatedAt: new Date()
      }
    ],
    users: [
      {
        uid: 'mock-user-1',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: '',
        bio: 'A test user for development',
        skills: ['JavaScript', 'React', 'Node.js'],
        preferences: { isProfilePublic: true, allowMessages: true },
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date()
      }
    ]
  };

  return {
    collection: (name) => ({
      where: (field, operator, value) => ({
        where: () => ({ where: () => ({ orderBy: () => ({ limit: () => ({
          get: async () => {
            let results = mockData[name] || [];
            // Simple filtering for mock data
            if (field === 'isPrivate' && value === false) {
              results = results.filter(item => !item.isPrivate);
            }
            if (field === 'isActive' && value === true) {
              results = results.filter(item => item.isActive);
            }
            return {
              empty: results.length === 0,
              docs: results.map(item => ({
                id: item.id || 'mock-id',
                data: () => item,
                exists: true
              })),
              forEach: (callback) => {
                results.forEach((item, index) => {
                  callback({
                    id: item.id || `mock-id-${index}`,
                    data: () => item
                  });
                });
              }
            };
          }
        })})})})
      }),
      orderBy: () => ({
        limit: (count) => ({
          get: async () => {
            const results = mockData[name] || [];
            return {
              empty: results.length === 0,
              docs: results.slice(0, count).map(item => ({
                id: item.id || 'mock-id',
                data: () => item,
                exists: true
              })),
              forEach: (callback) => {
                results.slice(0, count).forEach((item, index) => {
                  callback({
                    id: item.id || `mock-id-${index}`,
                    data: () => item
                  });
                });
              }
            };
          }
        })
      }),
      limit: (count) => ({
        get: async () => {
          const results = mockData[name] || [];
          return {
            empty: results.length === 0,
            docs: results.slice(0, count).map(item => ({
              id: item.id || 'mock-id',
              data: () => item,
              exists: true
            })),
            forEach: (callback) => {
              results.slice(0, count).forEach((item, index) => {
                callback({
                  id: item.id || `mock-id-${index}`,
                  data: () => item
                });
              });
            }
          };
        }
      }),
      doc: (id) => ({
        get: async () => {
          const items = mockData[name] || [];
          const item = items.find(i => i.id === id || i.uid === id);
          return {
            exists: !!item,
            id,
            data: () => item || null
          };
        },
        set: async (data) => {
          console.log(`Mock set operation on ${name}/${id}:`, data);
          return { writeTime: new Date() };
        },
        update: async (data) => {
          console.log(`Mock update operation on ${name}/${id}:`, data);
          return { writeTime: new Date() };
        }
      }),
      add: async (data) => {
        const id = `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        console.log(`Mock add operation on ${name}:`, data);
        return { id };
      }
    })
  };
}

module.exports = { admin, db, auth, isFirebaseAvailable };
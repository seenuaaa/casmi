import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, query, where, getDocs, addDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Auth functions
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signUpWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const signInWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const logOut = () => signOut(auth);

// Firestore functions
export const createUserProfile = async (user, additionalData = {}) => {
  if (!user) return;
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    const { displayName, email, photoURL } = user;
    const createdAt = new Date();
    
    try {
      await setDoc(userRef, {
        displayName: displayName || '',
        email,
        photoURL: photoURL || '',
        createdAt,
        college: '',
        bio: '',
        testResults: {},
        completedTests: [],
        ...additionalData
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  }
  
  return userRef;
};

// Room functions
export const createRoom = async (roomData) => {
  try {
    const roomRef = await addDoc(collection(db, 'rooms'), {
      ...roomData,
      createdAt: new Date(),
      participants: []
    });
    return roomRef.id;
  } catch (error) {
    console.error('Error creating room:', error);
    return null;
  }
};

export const joinRoom = async (roomId, userId) => {
  try {
    const participantRef = doc(db, `rooms/${roomId}/participants`, userId);
    await setDoc(participantRef, {
      userId,
      joinedAt: new Date(),
      signal: null
    });
  } catch (error) {
    console.error('Error joining room:', error);
  }
};

// Test functions  
export const saveTestResult = async (userId, courseId, testId, result) => {
  try {
    const userRef = doc(db, 'users', userId);
    const testResultRef = await addDoc(collection(db, 'testResults'), {
      userId,
      courseId,
      testId,
      ...result,
      completedAt: new Date()
    });
    
    // Update user's completed tests
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const completedTests = userData.completedTests || [];
      if (!completedTests.includes(`${courseId}-${testId}`)) {
        await updateDoc(userRef, {
          completedTests: [...completedTests, `${courseId}-${testId}`]
        });
      }
    }
    
    return testResultRef.id;
  } catch (error) {
    console.error('Error saving test result:', error);
    return null;
  }
};

export default app;
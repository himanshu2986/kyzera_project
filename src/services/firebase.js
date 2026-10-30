// Firebase Cloud Database Integration for Kyzera
// Connects real-time Cloud Firestore for complaints, suggestions, clusters, and live presence.

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

// 1. Default Firebase Configuration
// Can be populated via environment variables (.env) or via the in-app Firebase Settings modal
export const getStoredFirebaseConfig = () => {
  const custom = localStorage.getItem('kyzera_firebase_config');
  if (custom) {
    try {
      return JSON.parse(custom);
    } catch {}
  }

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
  };
};

let app = null;
let db = null;
let auth = null;

export const initializeFirebase = (customConfig = null) => {
  const config = customConfig || getStoredFirebaseConfig();

  if (!config || !config.apiKey || !config.projectId) {
    return { isConfigured: false, db: null, app: null, auth: null };
  }

  try {
    app = getApps().length > 0 ? getApp() : initializeApp(config);
    db = getFirestore(app);
    auth = getAuth(app);
    return { isConfigured: true, db, app, auth };
  } catch (error) {
    console.warn('Firebase initialization error:', error.message);
    return { isConfigured: false, db: null, app: null, auth: null, error };
  }
};

// Initial attempt
const initResult = initializeFirebase();
db = initResult.db;
app = initResult.app;
auth = initResult.auth;

export const isFirebaseReady = () => {
  const cfg = getStoredFirebaseConfig();
  return Boolean(cfg.apiKey && cfg.projectId && db);
};

export { db, app, auth };

// Sign in with Google Workspace / Gmail Account
export const signInWithGoogle = async () => {
  if (!app) {
    return { success: false, error: 'Firebase is not initialized' };
  }
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth || getAuth(app), provider);
    return {
      success: true,
      user: {
        email: result.user.email,
        name: result.user.displayName || 'Google User',
        photoURL: result.user.photoURL,
        uid: result.user.uid
      }
    };
  } catch (err) {
    console.warn('Google Sign-In Error:', err.message);
    return { success: false, error: err.message };
  }
};

// Realtime Firestore Subscriptions & Operations
export const subscribeToTicketsRealtime = (onUpdate, onError) => {
  if (!isFirebaseReady()) return () => {};

  try {
    const q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const ticketList = [];
        snapshot.forEach((doc) => {
          ticketList.push({ id: doc.id, ...doc.data() });
        });
        onUpdate(ticketList);
      },
      (err) => {
        console.warn('Firestore tickets subscription note:', err.message);
        // Fallback to basic collection query if index is building
        try {
          return onSnapshot(collection(db, 'tickets'), (snapshot) => {
            const ticketList = [];
            snapshot.forEach((doc) => {
              ticketList.push({ id: doc.id, ...doc.data() });
            });
            onUpdate(ticketList);
          });
        } catch {}
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn('Failed to attach Firestore snapshot:', err);
    return () => {};
  }
};

export const addTicketToFirebase = async (ticket) => {
  if (!isFirebaseReady()) return false;
  try {
    const ticketRef = doc(db, 'tickets', ticket.id);
    await setDoc(ticketRef, {
      ...ticket,
      firestoreTimestamp: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error saving ticket to Firebase:', error);
    throw error;
  }
};

export const updateTicketStatusInFirebase = async (ticketId, newStatus) => {
  if (!isFirebaseReady()) return false;
  try {
    const ticketRef = doc(db, 'tickets', ticketId);
    await updateDoc(ticketRef, {
      status: newStatus,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error updating ticket in Firebase:', error);
    throw error;
  }
};

export const saveFirebaseConfig = (config) => {
  localStorage.setItem('kyzera_firebase_config', JSON.stringify(config));
  const res = initializeFirebase(config);
  return res.isConfigured;
};

export const clearFirebaseConfig = () => {
  localStorage.removeItem('kyzera_firebase_config');
  db = null;
  app = null;
};


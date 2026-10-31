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
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyD3IahRv4T-l1ulJq87lUw-UfTwgQZ8GDU',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'planning-with-ai-7ade4.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'planning-with-ai-7ade4',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'planning-with-ai-7ade4.firebasestorage.app',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '518079060102',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:518079060102:web:97b80e047bb5b853165907'
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
    return onSnapshot(
      collection(db, 'tickets'),
      (snapshot) => {
        const ticketList = [];
        snapshot.forEach((doc) => {
          ticketList.push({ id: doc.id, ...doc.data() });
        });
        ticketList.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
        onUpdate(ticketList);
      },
      (err) => {
        console.warn('Firestore tickets subscription note:', err.message);
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

export const updateTicketStatusInFirebase = async (ticketId, newStatus, note = '') => {
  if (!isFirebaseReady()) return false;
  try {
    const ticketRef = doc(db, 'tickets', ticketId);
    await updateDoc(ticketRef, {
      status: newStatus,
      resolutionNote: note,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error updating ticket status in Firebase:', error);
    throw error;
  }
};

export const updateTicketUpvotesInFirebase = async (ticketId, newUpvotes, newPriority) => {
  if (!isFirebaseReady()) return false;
  try {
    const ticketRef = doc(db, 'tickets', ticketId);
    await updateDoc(ticketRef, {
      upvotes: newUpvotes,
      priority: newPriority,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error updating upvotes in Firebase:', error);
    throw error;
  }
};

export const updateTicketRatingInFirebase = async (ticketId, rating, comment = '') => {
  if (!isFirebaseReady()) return false;
  try {
    const ticketRef = doc(db, 'tickets', ticketId);
    await updateDoc(ticketRef, {
      rating,
      ratingComment: comment,
      ratedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error updating rating in Firebase:', error);
    throw error;
  }
};

export const addCommentToFirebase = async (ticketId, comment) => {
  if (!isFirebaseReady()) return false;
  try {
    const ticketRef = doc(db, 'tickets', ticketId);
    const snap = await getDocs(query(collection(db, 'tickets')));
    // Update comments array on ticket
    const currentTicket = snap.docs.find(d => d.id === ticketId);
    const existingComments = currentTicket ? (currentTicket.data().comments || []) : [];
    await updateDoc(ticketRef, {
      comments: [comment, ...existingComments],
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error adding comment in Firebase:', error);
    throw error;
  }
};

export const subscribeToPresenceRealtime = (tabId, role, onUpdate) => {
  if (!isFirebaseReady()) return () => {};
  try {
    const presenceRef = doc(db, 'presence', tabId);
    setDoc(presenceRef, {
      role,
      updatedAt: serverTimestamp()
    }).catch(() => {});

    const interval = setInterval(() => {
      setDoc(presenceRef, {
        role,
        updatedAt: serverTimestamp()
      }, { merge: true }).catch(() => {});
    }, 6000);

    const unsubscribe = onSnapshot(collection(db, 'presence'), (snapshot) => {
      let students = 0;
      let teachers = 0;
      snapshot.forEach((d) => {
        const data = d.data();
        if (data.role === 'Student') students++;
        if (data.role === 'Teacher') teachers++;
      });
      onUpdate({ students, teachers });
    }, () => {});

    return () => {
      clearInterval(interval);
      deleteDoc(presenceRef).catch(() => {});
      unsubscribe();
    };
  } catch (err) {
    return () => {};
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


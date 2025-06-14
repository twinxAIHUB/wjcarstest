'use client';

import { initializeApp, getApps, FirebaseOptions, FirebaseApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import type { FirebaseClient } from '@/types/firebase';

// Check required environment variables
if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  throw new Error('NEXT_PUBLIC_FIREBASE_API_KEY is not set');
}
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  throw new Error('NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set');
}

// Firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyDUf3RttfMAYC8p1-SCiFc9sjDCPEPBcNg',
  authDomain: 'wjcar-6dba9.firebaseapp.com',
  projectId: 'wjcar-6dba9',
  storageBucket: 'wjcar-6dba9.firebasestorage.app',
  messagingSenderId: '561539716627',
  appId: '1:561539716627:web:5b154a789d67ddb60011e6'
};

// Validate required config
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'] as const;
const missingFields = requiredFields.filter(field => !firebaseConfig[field]);

if (missingFields.length > 0) {
  throw new Error(`Missing required Firebase configuration fields: ${missingFields.join(', ')}`);
}

// Log config for debugging (excluding sensitive values)
console.log('Firebase Config:', {
  hasApiKey: !!firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  hasMessagingSenderId: !!firebaseConfig.messagingSenderId,
  hasAppId: !!firebaseConfig.appId
});

// Initialize Firebase
let app: FirebaseApp;
try {
  if (!getApps().length) {
    console.log('Initializing new Firebase app...');
    app = initializeApp(firebaseConfig);
    console.log('Firebase app initialized with config:', {
      projectId: app.options.projectId,
      authDomain: app.options.authDomain
    });
  } else {
    console.log('Reusing existing Firebase app...');
    app = getApps()[0];
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Set auth persistence to local
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Auth persistence set to local');
  })
  .catch((error) => {
    console.error('Error setting auth persistence:', error);
  });

console.log('Firebase services initialized:', {
  hasAuth: !!auth,
  hasDb: !!db,
  hasStorage: !!storage,
  currentUser: auth.currentUser
});

const firebase: FirebaseClient = { app, auth, db, storage };
export { app, auth, db, storage }; 
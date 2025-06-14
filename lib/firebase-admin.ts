import { initializeApp, getApps, cert, AppOptions } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import type { FirebaseAdmin } from '@/types/firebase';

// Check required environment variables
if (!process.env.FIREBASE_PROJECT_ID) {
  throw new Error('FIREBASE_PROJECT_ID is not set');
}
if (!process.env.FIREBASE_CLIENT_EMAIL) {
  throw new Error('FIREBASE_CLIENT_EMAIL is not set');
}
if (!process.env.FIREBASE_PRIVATE_KEY) {
  throw new Error('FIREBASE_PRIVATE_KEY is not set');
}

// Log environment variables (without sensitive values)
console.log('Firebase Admin Config:', {
  hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
  hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
  hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
  projectId: process.env.FIREBASE_PROJECT_ID
});

// Prepare the private key
const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

// Prepare admin configuration
const adminConfig: AppOptions = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: privateKey
  }),
  projectId: process.env.FIREBASE_PROJECT_ID
};

console.log('Initializing Firebase Admin with config:', {
  projectId: adminConfig.projectId,
  hasCredential: !!adminConfig.credential
});

let app;
let adminAuth: Auth;
let adminDb: Firestore;

try {
  // Initialize Firebase Admin
  if (!getApps().length) {
    app = initializeApp(adminConfig);
  } else {
    app = getApps()[0];
  }

  adminAuth = getAuth(app);
  adminDb = getFirestore(app);
  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  if (error instanceof Error) {
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
  }
  throw error;
}

const admin: FirebaseAdmin = { adminAuth, adminDb };
export { adminAuth, adminDb }; 
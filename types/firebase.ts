import { Auth, User } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { FirebaseApp } from 'firebase/app';
import { Auth as AdminAuth } from 'firebase-admin/auth';
import { Firestore as AdminFirestore } from 'firebase-admin/firestore';
import { FirebaseStorage } from 'firebase/storage';

export interface FirebaseClient {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
}

export interface FirebaseAdmin {
  adminAuth: AdminAuth;
  adminDb: AdminFirestore;
}

export interface AdminUser extends User {
  role?: 'admin' | 'super_admin';
} 
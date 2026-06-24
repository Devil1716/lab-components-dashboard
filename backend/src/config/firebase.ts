import { getApps, initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';

export function initializeFirebase() {
  if (getApps().length === 0) {
    try {
      initializeApp({
        credential: applicationDefault()
      });
      console.log('Firebase Admin Initialized successfully.');
    } catch (error) {
      console.error('Firebase Admin Initialization error', error);
    }
  }
}

export const getFirestore = () => getAdminFirestore();
export const getAuth = () => getAdminAuth();

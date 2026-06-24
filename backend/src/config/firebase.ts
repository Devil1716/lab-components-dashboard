import * as admin from 'firebase-admin';

export function initializeFirebase() {
  if (admin.apps.length === 0) {
    try {
      // For local development, if you have a serviceAccountKey.json, you can use it:
      // const serviceAccount = require('../../serviceAccountKey.json');
      // admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
      
      // If deployed or using default environment credentials (e.g. GOOGLE_APPLICATION_CREDENTIALS):
      admin.initializeApp({
        credential: admin.credential.applicationDefault()
      });
      console.log('Firebase Admin Initialized successfully.');
    } catch (error) {
      console.error('Firebase Admin Initialization error', error);
    }
  }
}

export const getFirestore = () => admin.firestore();
export const getAuth = () => admin.auth();

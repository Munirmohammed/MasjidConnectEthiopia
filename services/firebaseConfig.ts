import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
// @ts-ignore - Firebase v11/v12 has a known TypeScript issue where getReactNativePersistence is missing from standard types but exists at runtime in React Native
import { getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// These should be set in your .env file (e.g. .env.local)
// EXPO_PUBLIC_FIREBASE_API_KEY=xxxx
// EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=xxxx
// etc.

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth: any;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  console.warn('Firebase Auth could not be initialized. Invalid API Key. Setup your .env file with real credentials.');
  // Provide a dummy mock for auth to prevent immediate crashes when importing `auth`
  auth = { currentUser: null, onAuthStateChanged: (cb: any) => cb(null) } as any;
}

export { app, auth };


import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Helper to safely get environment variables or fallback to provided keys
const getEnv = (key: string, fallback: string) => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return fallback;
};

const firebaseConfig = {
  apiKey: getEnv('REACT_APP_FIREBASE_API_KEY', "AIzaSyB0HawM1PAsRuLpECAc3pJ-T9rKhrMvt8s"),
  authDomain: getEnv('REACT_APP_FIREBASE_AUTH_DOMAIN', "lerzo-app.firebaseapp.com"),
  projectId: getEnv('REACT_APP_FIREBASE_PROJECT_ID', "lerzo-app"),
  storageBucket: getEnv('REACT_APP_FIREBASE_STORAGE_BUCKET', "lerzo-app.firebasestorage.app"),
  messagingSenderId: getEnv('REACT_APP_FIREBASE_MESSAGING_SENDER_ID', "776236870752"),
  appId: getEnv('REACT_APP_FIREBASE_APP_ID', "1:776236870752:web:abac08b3fb3bc7dd4e2705"),
  measurementId: getEnv('REACT_APP_FIREBASE_MEASUREMENT_ID', "G-HNEYPJKYB1")
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;

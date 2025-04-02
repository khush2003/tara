// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: Bun.env.FIREBASE_API_KEY,
  authDomain: Bun.env.AUTH_DOMAIN,
  projectId: Bun.env.PROJECT_ID,
  storageBucket: Bun.env.STORAGE_BUCKET,
  messagingSenderId: Bun.env.MESSAGING_SENDER_ID,
  appId: Bun.env.APP_ID,
  measurementId: Bun.env.MEASUREMENT_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
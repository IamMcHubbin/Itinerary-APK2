import { initializeApp } from 'firebase/app'
import { initializeFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
}

export const firebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

const app = firebaseConfigured ? initializeApp(firebaseConfig) : null

// Auto-detect long-polling instead of always assuming Firestore's normal
// streaming connection works — some networks (corporate proxies, certain
// mobile carriers/VPNs) block that, and this falls back transparently.
export const db = app
  ? initializeFirestore(app, { experimentalAutoDetectLongPolling: true })
  : null

// Realtime Database backs presence (who else has the app open right now) —
// a separate Firebase product from Firestore, so it only activates once
// VITE_FIREBASE_DATABASE_URL is set (Firestore keeps working without it).
export const rtdb = app && firebaseConfig.databaseURL ? getDatabase(app) : null

/** Single shared document holding the whole trip. */
export const TRIP_ID = 'japan-2026'

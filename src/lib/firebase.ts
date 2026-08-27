import { initializeApp } from 'firebase/app'
import { initializeFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const firebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

const app = firebaseConfigured ? initializeApp(firebaseConfig) : null

// Auto-detect long-polling instead of always assuming Firestore's normal
// streaming connection works — some networks (corporate proxies, certain
// mobile carriers/VPNs) block that, and this falls back transparently.
export const db = app
  ? initializeFirestore(app, { experimentalAutoDetectLongPolling: true })
  : null

/** Single shared document holding the whole trip. */
export const TRIP_ID = 'japan-2026'

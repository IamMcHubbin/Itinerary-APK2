// One-time seed: pushes the local tripData.ts into Firestore as the
// starting point for collaborative editing. Won't overwrite an existing
// document, so it's safe to leave around / re-run by accident.
//
// Usage: node --env-file=.env.local ./node_modules/.bin/tsx scripts/seedFirestore.ts
import { initializeApp } from 'firebase/app'
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'
import { trip } from '../src/data/tripData'

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}

const TRIP_ID = 'japan-2026'

async function main() {
  if (!firebaseConfig.projectId) {
    console.error(
      'Missing Firebase env vars. Run with:\n  node --env-file=.env.local ./node_modules/.bin/tsx scripts/seedFirestore.ts',
    )
    process.exit(1)
  }

  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)
  const ref = doc(db, 'trips', TRIP_ID)

  const existing = await getDoc(ref)
  if (existing.exists()) {
    console.log(`trips/${TRIP_ID} already exists — not overwriting. Delete it first to reseed.`)
    return
  }

  await setDoc(ref, trip)
  console.log(`Seeded trips/${TRIP_ID} with ${trip.days.length} days.`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

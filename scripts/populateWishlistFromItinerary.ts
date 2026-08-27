// Seeds the Wishlist tab from what's already in the itinerary:
// - Scheduled activities (excluding pure transport legs) become "planned"
//   wishlist items, linked to the day they're on.
// - Each day's food *options* (the still-undecided candidates) become
//   "unplanned" food wishlist items — they're already a wishlist, really.
//
// Reads the live trip document (not the local tripData.ts seed), so it
// reflects whatever's actually been edited in the app. Uses deterministic
// doc IDs (activity-<id>, food-<id>) so it's safe to re-run any time the
// itinerary changes — it only touches auto-populated items, never ones
// people added by hand in the Wishlist tab (those get random Firestore IDs).
//
// Usage: node --env-file=.env.local ./node_modules/.bin/tsx scripts/populateWishlistFromItinerary.ts
import { initializeApp } from 'firebase/app'
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'
import type { ActivityCategory, Trip, WishlistCategory, WishlistItem } from '../src/types'

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}

const TRIP_ID = 'japan-2026'
const AUTO_AUTHOR = 'Trip plan'

function wishlistCategoryFor(category: ActivityCategory): WishlistCategory | null {
  switch (category) {
    case 'lodging':
      return 'lodging'
    case 'food':
      return 'food'
    case 'sightseeing':
    case 'shopping':
    case 'experience':
      return 'sightseeing'
    case 'transport':
      return null
  }
}

async function main() {
  if (!firebaseConfig.projectId) {
    console.error(
      'Missing Firebase env vars. Run with:\n  node --env-file=.env.local ./node_modules/.bin/tsx scripts/populateWishlistFromItinerary.ts',
    )
    process.exit(1)
  }

  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)
  const tripSnap = await getDoc(doc(db, 'trips', TRIP_ID))
  if (!tripSnap.exists()) {
    console.error(`trips/${TRIP_ID} doesn't exist — run seedFirestore.ts first.`)
    process.exit(1)
  }
  const trip = tripSnap.data() as Trip

  const items: Omit<WishlistItem, 'id'>[] = []
  const ids: string[] = []

  for (const day of trip.days) {
    for (const activity of day.activities) {
      const category = wishlistCategoryFor(activity.category)
      if (!category) continue
      ids.push(`activity-${activity.id}`)
      items.push({
        category,
        title: activity.title,
        notes: activity.description ?? '',
        addedBy: AUTO_AUTHOR,
        createdAt: Date.now(),
        planned: true,
        linkedDayId: day.id,
      })
    }

    for (const option of day.foodOptions ?? []) {
      ids.push(`food-${option.id}`)
      items.push({
        category: 'food',
        title: option.name,
        notes: option.description ?? '',
        addedBy: AUTO_AUTHOR,
        createdAt: Date.now(),
        planned: false,
      })
    }
  }

  await Promise.all(
    items.map((item, i) => setDoc(doc(db, 'trips', TRIP_ID, 'wishlist', ids[i]), item)),
  )

  const planned = items.filter((i) => i.planned).length
  console.log(
    `Populated ${items.length} wishlist items (${planned} planned, ${items.length - planned} still open).`,
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

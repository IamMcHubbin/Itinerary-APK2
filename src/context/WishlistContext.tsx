import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore'
import { db, TRIP_ID, firebaseConfigured } from '../lib/firebase'
import type { WishlistCategory, WishlistItem } from '../types'

interface WishlistContextValue {
  items: WishlistItem[]
  ready: boolean
  addItem: (category: WishlistCategory, title: string, notes: string, author: string) => void
  setPlanned: (itemId: string, planned: boolean, linkedDayId?: string) => void
  deleteItem: (itemId: string) => void
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [ready, setReady] = useState(!firebaseConfigured)

  useEffect(() => {
    if (!db) return
    const q = query(collection(db, 'trips', TRIP_ID, 'wishlist'), orderBy('createdAt', 'asc'))
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as WishlistItem))
        setReady(true)
      },
      (error) => {
        console.error('Wishlist sync error', error)
        setReady(true)
      },
    )
    return unsubscribe
  }, [])

  const addItem = useCallback(
    (category: WishlistCategory, title: string, notes: string, author: string) => {
      if (!db) return
      addDoc(collection(db, 'trips', TRIP_ID, 'wishlist'), {
        category,
        title,
        notes,
        addedBy: author,
        createdAt: Date.now(),
        planned: false,
      }).catch((error) => console.error('Failed to add wishlist item', error))
    },
    [],
  )

  const setPlanned = useCallback((itemId: string, planned: boolean, linkedDayId?: string) => {
    if (!db) return
    updateDoc(doc(db, 'trips', TRIP_ID, 'wishlist', itemId), {
      planned,
      linkedDayId: planned ? (linkedDayId ?? null) : null,
    }).catch((error) => console.error('Failed to update wishlist item', error))
  }, [])

  const deleteItem = useCallback((itemId: string) => {
    if (!db) return
    deleteDoc(doc(db, 'trips', TRIP_ID, 'wishlist', itemId)).catch((error) =>
      console.error('Failed to delete wishlist item', error),
    )
  }, [])

  return (
    <WishlistContext.Provider value={{ items, ready, addItem, setPlanned, deleteItem }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db, TRIP_ID, firebaseConfigured } from '../lib/firebase'
import { trip as seedTrip } from '../data/tripData'
import { recomputeDates } from '../lib/recomputeDates'
import { makeId } from '../lib/id'
import type { Activity, Day, Trip } from '../types'

export interface UseTripResult {
  trip: Trip
  loading: boolean
  /** True once we've received a real snapshot from Firestore (vs. showing the local seed). */
  synced: boolean
  reorderDays: (fromIndex: number, toIndex: number) => void
  addDay: (afterIndex: number) => string
  deleteDay: (dayId: string) => void
  updateDayField: (dayId: string, patch: Partial<Pick<Day, 'city' | 'region' | 'summary'>>) => void
  addActivity: (dayId: string) => string
  updateActivity: (dayId: string, activityId: string, patch: Partial<Activity>) => void
  deleteActivity: (dayId: string, activityId: string) => void
}

function emptyDay(): Day {
  return {
    id: makeId('day'),
    date: '',
    city: 'New day',
    summary: '',
    activities: [],
  }
}

function emptyActivity(): Activity {
  return {
    id: makeId('act'),
    time: '09:00',
    title: 'New activity',
    category: 'experience',
  }
}

export function useTrip(): UseTripResult {
  const [trip, setTrip] = useState<Trip>(seedTrip)
  const [loading, setLoading] = useState(firebaseConfigured)
  const [synced, setSynced] = useState(false)
  const tripRef = useRef(trip)
  tripRef.current = trip

  useEffect(() => {
    if (!db) {
      setLoading(false)
      return
    }
    const ref = doc(db, 'trips', TRIP_ID)
    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setTrip(snap.data() as Trip)
          setSynced(true)
        }
        setLoading(false)
      },
      (error) => {
        console.error('Trip sync error', error)
        setLoading(false)
      },
    )
    return unsubscribe
  }, [])

  const applyDays = useCallback((newDays: Day[]) => {
    setTrip((current) => ({ ...current, days: newDays }))
    if (db) {
      updateDoc(doc(db, 'trips', TRIP_ID), { days: newDays }).catch((error) =>
        console.error('Failed to save trip', error),
      )
    }
  }, [])

  const reorderDays = useCallback(
    (fromIndex: number, toIndex: number) => {
      const days = [...tripRef.current.days]
      const [moved] = days.splice(fromIndex, 1)
      days.splice(toIndex, 0, moved)
      applyDays(recomputeDates(days, tripRef.current.startDate))
    },
    [applyDays],
  )

  const addDay = useCallback(
    (afterIndex: number) => {
      const day = emptyDay()
      const days = [...tripRef.current.days]
      days.splice(afterIndex + 1, 0, day)
      applyDays(recomputeDates(days, tripRef.current.startDate))
      return day.id
    },
    [applyDays],
  )

  const deleteDay = useCallback(
    (dayId: string) => {
      const days = tripRef.current.days.filter((day) => day.id !== dayId)
      applyDays(recomputeDates(days, tripRef.current.startDate))
    },
    [applyDays],
  )

  const updateDayField = useCallback(
    (dayId: string, patch: Partial<Pick<Day, 'city' | 'region' | 'summary'>>) => {
      const days = tripRef.current.days.map((day) =>
        day.id === dayId ? { ...day, ...patch } : day,
      )
      applyDays(days)
    },
    [applyDays],
  )

  const addActivity = useCallback(
    (dayId: string) => {
      const activity = emptyActivity()
      const days = tripRef.current.days.map((day) =>
        day.id === dayId ? { ...day, activities: [...day.activities, activity] } : day,
      )
      applyDays(days)
      return activity.id
    },
    [applyDays],
  )

  const updateActivity = useCallback(
    (dayId: string, activityId: string, patch: Partial<Activity>) => {
      const days = tripRef.current.days.map((day) => {
        if (day.id !== dayId) return day
        return {
          ...day,
          activities: day.activities.map((activity) =>
            activity.id === activityId ? { ...activity, ...patch } : activity,
          ),
        }
      })
      applyDays(days)
    },
    [applyDays],
  )

  const deleteActivity = useCallback(
    (dayId: string, activityId: string) => {
      const days = tripRef.current.days.map((day) => {
        if (day.id !== dayId) return day
        return { ...day, activities: day.activities.filter((a) => a.id !== activityId) }
      })
      applyDays(days)
    },
    [applyDays],
  )

  return {
    trip,
    loading,
    synced,
    reorderDays,
    addDay,
    deleteDay,
    updateDayField,
    addActivity,
    updateActivity,
    deleteActivity,
  }
}

export type ActivityCategory =
  | 'transport'
  | 'food'
  | 'sightseeing'
  | 'lodging'
  | 'shopping'
  | 'experience'

export interface MapLocation {
  lat: number
  lng: number
  /** Place name used for the Apple Maps query and embed title. */
  label: string
}

export type TravelMode = 'walking' | 'transit' | 'driving'

export interface TravelSegment {
  mode: TravelMode
  /** e.g. "10-12 min", "~20-25 min" */
  duration?: string
  distanceKm?: number
  note?: string
}

export interface Activity {
  id: string
  time: string
  title: string
  description?: string
  location?: string
  category: ActivityCategory
  tip?: string
  /** Google-style rating out of 5, e.g. 4.8 */
  rating?: number
  map?: MapLocation
  /** How to get here from the previous stop on the day's timeline. */
  travelFromPrevious?: TravelSegment
}

export interface FoodOption {
  id: string
  name: string
  description?: string
  rating?: number
  map?: MapLocation
}

export interface Day {
  id: string
  date: string
  city: string
  region?: string
  summary: string
  activities: Activity[]
  foodOptions?: FoodOption[]
  notes?: string[]
}

export interface Comment {
  id: string
  activityId: string
  author: string
  text: string
  createdAt: number
}

export type WishlistCategory = 'lodging' | 'sightseeing' | 'food'

export interface WishlistItem {
  id: string
  category: WishlistCategory
  title: string
  notes?: string
  addedBy: string
  createdAt: number
  planned: boolean
  /** Which day this ended up on, once planned — for context, not required. */
  linkedDayId?: string
  /** Display names of everyone who's favorited this item. */
  favoritedBy?: string[]
}

export type Currency = 'JPY' | 'GBP'

export interface Expense {
  id: string
  title: string
  amount: number
  currency: Currency
  paidBy: string
  /** Names sharing this expense equally. */
  splitBetween: string[]
  createdAt: number
}

export interface Trip {
  title: string
  subtitle: string
  startDate: string
  endDate: string
  coverEmoji: string
  days: Day[]
  /** Everyone who's ever paid or split a Budget expense — grows over time, never shrinks. */
  budgetParticipants?: string[]
}

export type ActivityCategory =
  | 'transport'
  | 'food'
  | 'sightseeing'
  | 'lodging'
  | 'shopping'
  | 'experience'

export interface Activity {
  id: string
  time: string
  title: string
  description?: string
  location?: string
  category: ActivityCategory
  tip?: string
  durationMinutes?: number
}

export interface Day {
  id: string
  date: string
  city: string
  region?: string
  summary: string
  activities: Activity[]
}

export interface Trip {
  title: string
  subtitle: string
  startDate: string
  endDate: string
  coverEmoji: string
  days: Day[]
}

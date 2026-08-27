import { addDays, format } from 'date-fns'
import type { Day } from '../types'

/**
 * Days are always contiguous from the trip's start date, in array order.
 * Reordering (or adding/removing) a day reassigns every date after it —
 * "swapping two days" means swapping which calendar date each lands on.
 */
export function recomputeDates(days: Day[], startDate: string): Day[] {
  const start = new Date(`${startDate}T00:00:00`)
  return days.map((day, index) => ({
    ...day,
    date: format(addDays(start, index), 'yyyy-MM-dd'),
  }))
}

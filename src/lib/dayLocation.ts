import { cityCoordinates } from './cityCoordinates'
import type { Day } from '../types'

export function getDayLocation(day: Day): { lat: number; lng: number } | null {
  const withMap = day.activities.find((a) => a.map)
  if (withMap?.map) return { lat: withMap.map.lat, lng: withMap.map.lng }
  return cityCoordinates[day.city] ?? null
}

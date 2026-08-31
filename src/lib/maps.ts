import type { Activity, MapLocation } from '../types'

/**
 * Search by name rather than raw coordinates. A bare lat/lng drops a
 * generic pin with no reviews, hours, or photos attached — searching the
 * place name resolves to its real listing instead.
 */
export function googleMapsUrl(map: MapLocation): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(map.label)}`
}

export function appleMapsUrl(map: MapLocation): string {
  return `https://maps.apple.com/?q=${encodeURIComponent(map.label)}`
}

/**
 * Keyless Google Maps embed (no API key/billing needed). Unofficial but
 * widely used — swap for the official Maps Embed API (needs a free key)
 * if it ever stops working: https://www.google.com/maps/embed/v1/place
 */
export function googleMapsEmbedUrl(map: MapLocation): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(map.label)}&z=15&output=embed`
}

/**
 * The map location to actually show for an activity: an explicitly set one
 * wins, otherwise falls back to searching by the activity's location text
 * or title — same "search by name" approach as the rest of this file, so
 * every activity gets a usable map link even without manual setup.
 */
export function effectiveMapLocation(activity: Activity): MapLocation {
  const label = activity.map?.label.trim()
  if (label) return { ...activity.map!, label }
  return { lat: 0, lng: 0, label: activity.location?.trim() || activity.title }
}

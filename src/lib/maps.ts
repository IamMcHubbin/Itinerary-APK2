import type { MapLocation } from '../types'

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

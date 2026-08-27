import type { MapLocation } from '../types'

export function googleMapsUrl(map: MapLocation): string {
  return `https://www.google.com/maps/search/?api=1&query=${map.lat},${map.lng}`
}

export function appleMapsUrl(map: MapLocation): string {
  return `https://maps.apple.com/?ll=${map.lat},${map.lng}&q=${encodeURIComponent(map.label)}`
}

/**
 * Keyless Google Maps embed (no API key/billing needed). Unofficial but
 * widely used — swap for the official Maps Embed API (needs a free key)
 * if it ever stops working: https://www.google.com/maps/embed/v1/place
 */
export function googleMapsEmbedUrl(map: MapLocation): string {
  return `https://maps.google.com/maps?q=${map.lat},${map.lng}&z=15&output=embed`
}

/** Fallback coordinates for weather lookups when a day has no activity with a `map`. */
export const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  Tokyo: { lat: 35.6812, lng: 139.7671 },
  Mitake: { lat: 35.7975, lng: 139.1592 },
  Hakone: { lat: 35.2323, lng: 139.1069 },
  Nikko: { lat: 36.7198, lng: 139.6982 },
}

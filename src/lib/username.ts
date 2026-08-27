const KEY = 'japan-itinerary:name'

export function getStoredName(): string | null {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

export function setStoredName(name: string): void {
  try {
    localStorage.setItem(KEY, name)
  } catch {
    // localStorage unavailable (private mode etc.) — name just won't persist
  }
}

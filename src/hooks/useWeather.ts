import { useEffect, useState } from 'react'
import { fetchDayWeather } from '../lib/weather'
import type { WeatherResult } from '../lib/weather'

export function useWeather(
  location: { lat: number; lng: number } | null,
  date: string,
): { weather: WeatherResult | null; loading: boolean } {
  const [weather, setWeather] = useState<WeatherResult | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!location) {
      setWeather(null)
      return
    }
    let cancelled = false
    setLoading(true)
    fetchDayWeather(location.lat, location.lng, date).then((result) => {
      if (!cancelled) {
        setWeather(result)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [location?.lat, location?.lng, date])

  return { weather, loading }
}

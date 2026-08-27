import { differenceInCalendarDays, subYears, format as formatDate } from 'date-fns'

export interface WeatherResult {
  tempMaxC: number
  tempMinC: number
  precipChance: number | null
  weatherCode: number
  /** True when this is a real forecast; false when it's last year's actual weather as a reference. */
  isForecast: boolean
}

interface CacheEntry {
  value: WeatherResult | null
  fetchedAt: number
}

const cache = new Map<string, CacheEntry>()
const CACHE_TTL_MS = 3 * 60 * 60 * 1000 // 3 hours
// Open-Meteo's free forecast reliably covers this many days out; stay a
// little short of the documented max so we don't get an empty response
// right at the edge.
const FORECAST_HORIZON_DAYS = 15

function cacheKey(lat: number, lng: number, date: string): string {
  return `${lat.toFixed(2)},${lng.toFixed(2)},${date}`
}

async function fetchForecast(lat: number, lng: number, date: string): Promise<WeatherResult | null> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode&timezone=auto&start_date=${date}&end_date=${date}`
  const res = await fetch(url)
  if (!res.ok) return null
  const data = await res.json()
  const i = 0
  if (!data?.daily?.time?.[i]) return null
  return {
    tempMaxC: data.daily.temperature_2m_max[i],
    tempMinC: data.daily.temperature_2m_min[i],
    precipChance: data.daily.precipitation_probability_max?.[i] ?? null,
    weatherCode: data.daily.weathercode[i],
    isForecast: true,
  }
}

/** Last year's actual weather on the same calendar date, as a "what to expect" reference. */
async function fetchHistorical(lat: number, lng: number, date: string): Promise<WeatherResult | null> {
  const lastYearDate = formatDate(subYears(new Date(`${date}T00:00:00`), 1), 'yyyy-MM-dd')
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto&start_date=${lastYearDate}&end_date=${lastYearDate}`
  const res = await fetch(url)
  if (!res.ok) return null
  const data = await res.json()
  const i = 0
  if (!data?.daily?.time?.[i]) return null
  return {
    tempMaxC: data.daily.temperature_2m_max[i],
    tempMinC: data.daily.temperature_2m_min[i],
    precipChance: data.daily.precipitation_sum?.[i] > 0 ? 100 : 0,
    weatherCode: data.daily.weathercode[i],
    isForecast: false,
  }
}

export async function fetchDayWeather(
  lat: number,
  lng: number,
  date: string,
): Promise<WeatherResult | null> {
  const key = cacheKey(lat, lng, date)
  const cached = cache.get(key)
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.value
  }

  const daysOut = differenceInCalendarDays(new Date(`${date}T00:00:00`), new Date())
  try {
    const value =
      daysOut >= 0 && daysOut <= FORECAST_HORIZON_DAYS
        ? await fetchForecast(lat, lng, date)
        : await fetchHistorical(lat, lng, date)
    cache.set(key, { value, fetchedAt: Date.now() })
    return value
  } catch (error) {
    console.error('Weather fetch failed', error)
    return null
  }
}

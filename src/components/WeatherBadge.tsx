import { Droplets } from 'lucide-react'
import { useWeather } from '../hooks/useWeather'
import { getDayLocation } from '../lib/dayLocation'
import { weatherCodeInfo } from '../lib/weatherCodes'
import type { Day } from '../types'

interface WeatherBadgeProps {
  day: Day
}

export default function WeatherBadge({ day }: WeatherBadgeProps) {
  const location = getDayLocation(day)
  const { weather, loading } = useWeather(location, day.date)

  if (!location) return null
  if (loading && !weather) {
    return <div className="h-6 w-20 animate-pulse rounded-full bg-sumi/5 dark:bg-white/5" />
  }
  if (!weather) return null

  const { label, icon: Icon } = weatherCodeInfo(weather.weatherCode)

  return (
    <div className="flex items-center gap-2 rounded-full bg-sumi/5 px-2.5 py-1 text-xs text-sumi/70 dark:bg-white/5 dark:text-white/60">
      <Icon size={14} className="flex-none text-gold" />
      <span>
        {Math.round(weather.tempMinC)}°–{Math.round(weather.tempMaxC)}°C
      </span>
      {weather.precipChance !== null && (
        <span className="flex items-center gap-0.5">
          <Droplets size={12} />
          {Math.round(weather.precipChance)}%
        </span>
      )}
      <span className="text-sumi/40 dark:text-white/30">
        {weather.isForecast ? label : `${label} (last year)`}
      </span>
    </div>
  )
}

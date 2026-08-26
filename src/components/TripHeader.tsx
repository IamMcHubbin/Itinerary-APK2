import { format } from 'date-fns'
import type { Trip } from '../types'

interface TripHeaderProps {
  trip: Trip
  dayIndex: number
}

export default function TripHeader({ trip, dayIndex }: TripHeaderProps) {
  const start = format(new Date(trip.startDate), 'MMM d')
  const end = format(new Date(trip.endDate), 'MMM d, yyyy')

  return (
    <header className="relative overflow-hidden bg-ai text-washi">
      <div className="pattern-seigaiha absolute inset-0 text-washi/10" />
      <div className="relative mx-auto max-w-xl px-6 pt-10 pb-6 sm:px-8">
        <div className="flex items-center justify-between">
          <span className="text-3xl" aria-hidden="true">
            {trip.coverEmoji}
          </span>
          <span className="rounded-full border border-washi/25 px-3 py-1 text-xs font-medium tracking-wide text-washi/80">
            Day {dayIndex + 1} of {trip.days.length}
          </span>
        </div>
        <h1 className="mt-4 font-serif text-4xl leading-tight tracking-tight">
          {trip.title}
        </h1>
        <p className="mt-1 text-sm text-washi/70">{trip.subtitle}</p>
        <p className="mt-3 text-xs font-medium tracking-widest text-gold uppercase">
          {start} — {end}
        </p>
      </div>
    </header>
  )
}

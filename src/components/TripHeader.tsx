import { format } from 'date-fns'
import { Pencil, Check } from 'lucide-react'
import type { Trip } from '../types'
import { useEditMode } from '../context/EditModeContext'
import { useTripStore } from '../context/TripContext'
import { firebaseConfigured } from '../lib/firebase'

interface TripHeaderProps {
  trip: Trip
  dayIndex: number
}

export default function TripHeader({ trip, dayIndex }: TripHeaderProps) {
  const start = format(new Date(`${trip.startDate}T00:00:00`), 'MMM d')
  const end = format(new Date(`${trip.endDate}T00:00:00`), 'MMM d, yyyy')
  const { editMode, toggle } = useEditMode()
  const { synced } = useTripStore()

  return (
    <header className="relative overflow-hidden bg-ai text-washi">
      <div className="pattern-seigaiha absolute inset-0 text-washi/10" />
      <div className="relative mx-auto max-w-xl px-6 pt-10 pb-6 sm:px-8">
        <div className="flex items-center justify-between gap-2">
          <span className="text-3xl" aria-hidden="true">
            {trip.coverEmoji}
          </span>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-washi/25 px-3 py-1 text-xs font-medium tracking-wide text-washi/80">
              Day {dayIndex + 1} of {trip.days.length}
            </span>
            {firebaseConfigured && synced && (
              <button
                type="button"
                onClick={toggle}
                className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  editMode ? 'bg-washi text-ai' : 'border border-washi/25 text-washi/80'
                }`}
              >
                {editMode ? <Check size={12} /> : <Pencil size={12} />}
                {editMode ? 'Done' : 'Edit'}
              </button>
            )}
          </div>
        </div>
        <h1 className="mt-4 font-serif text-4xl leading-tight tracking-tight">{trip.title}</h1>
        <p className="mt-1 text-sm text-washi/70">{trip.subtitle}</p>
        <div className="mt-3 flex items-center gap-2">
          <p className="text-xs font-medium tracking-widest text-gold uppercase">
            {start} — {end}
          </p>
          {firebaseConfigured && (
            <span className="flex items-center gap-1 text-[10px] text-washi/50">
              <span
                className={`h-1.5 w-1.5 rounded-full ${synced ? 'bg-emerald-400' : 'bg-washi/30'}`}
              />
              {synced ? 'Live' : 'Connecting…'}
            </span>
          )}
        </div>
      </div>
    </header>
  )
}

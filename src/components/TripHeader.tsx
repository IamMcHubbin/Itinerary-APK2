import { format } from 'date-fns'
import { Pencil, Check, MapPinned, ListTodo, Wallet, Route } from 'lucide-react'
import type { Trip } from '../types'
import { useEditMode } from '../context/EditModeContext'
import { useTripStore } from '../context/TripContext'
import { firebaseConfigured } from '../lib/firebase'
import { useDisplayName } from '../hooks/useDisplayName'
import { usePresence } from '../hooks/usePresence'
import PresenceAvatars from './PresenceAvatars'

export type AppView = 'itinerary' | 'wishlist' | 'budget' | 'overview'

interface TripHeaderProps {
  trip: Trip
  dayIndex: number
  view: AppView
  onViewChange: (view: AppView) => void
}

const tabs: { id: AppView; label: string; icon: typeof MapPinned }[] = [
  { id: 'itinerary', label: 'Itinerary', icon: MapPinned },
  { id: 'overview', label: 'Overview', icon: Route },
  { id: 'wishlist', label: 'Wishlist', icon: ListTodo },
  { id: 'budget', label: 'Budget', icon: Wallet },
]

export default function TripHeader({ trip, dayIndex, view, onViewChange }: TripHeaderProps) {
  const start = format(new Date(`${trip.startDate}T00:00:00`), 'MMM d')
  const end = format(new Date(`${trip.endDate}T00:00:00`), 'MMM d, yyyy')
  const { editMode, toggle } = useEditMode()
  const { synced } = useTripStore()
  const { name } = useDisplayName()
  const peers = usePresence(name, view)

  return (
    <header className="relative overflow-hidden bg-ai text-washi">
      <div className="pattern-seigaiha absolute inset-0 text-washi/10" />
      <div className="relative mx-auto max-w-xl px-6 pt-10 pb-6 sm:px-8">
        <div className="flex items-center justify-between gap-2">
          <span className="text-3xl" aria-hidden="true">
            {trip.coverEmoji}
          </span>
          <div className="flex items-center gap-2">
            <PresenceAvatars peers={peers} />
            {view === 'itinerary' && (
              <span className="rounded-full border border-washi/25 px-3 py-1 text-xs font-medium tracking-wide text-washi/80">
                Day {dayIndex + 1} of {trip.days.length}
              </span>
            )}
            {view === 'itinerary' && firebaseConfigured && synced && (
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

        <div className="no-scrollbar mt-4 flex gap-1 overflow-x-auto rounded-full bg-washi/10 p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const active = view === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onViewChange(tab.id)}
                className={`flex flex-1 items-center justify-center gap-1 rounded-full px-2 py-1.5 text-[11px] font-medium whitespace-nowrap transition-colors ${
                  active ? 'bg-washi text-ai' : 'text-washi/70'
                }`}
              >
                <Icon size={12} className="flex-none" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>
    </header>
  )
}

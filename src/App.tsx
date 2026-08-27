import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import TripHeader from './components/TripHeader'
import DaySelector from './components/DaySelector'
import DayTimeline from './components/DayTimeline'
import { TripProvider, useTripStore } from './context/TripContext'
import { EditModeProvider, useEditMode } from './context/EditModeContext'
import { CommentsProvider } from './context/CommentsContext'

function AppShell() {
  const { trip, addDay } = useTripStore()
  const { editMode } = useEditMode()
  const [dayIndex, setDayIndex] = useState(0)

  useEffect(() => {
    if (dayIndex > trip.days.length - 1) {
      setDayIndex(Math.max(0, trip.days.length - 1))
    }
  }, [trip.days.length, dayIndex])

  const goTo = (index: number) => {
    if (index < 0 || index >= trip.days.length) return
    setDayIndex(index)
  }

  const day = trip.days[dayIndex]

  return (
    <div className="min-h-svh bg-washi dark:bg-ink">
      <TripHeader trip={trip} dayIndex={dayIndex} />

      {trip.days.length > 0 && (
        <DaySelector days={trip.days} activeIndex={dayIndex} onSelect={goTo} />
      )}

      <main className="pb-24">
        {day ? (
          <AnimatePresence mode="wait">
            <DayTimeline key={day.id} day={day} dayIndex={dayIndex} />
          </AnimatePresence>
        ) : (
          <div className="mx-auto max-w-xl px-6 py-16 text-center">
            <p className="text-sm text-sumi/50 dark:text-white/40">
              No days planned yet.
              {editMode && ' Add the first one below.'}
            </p>
            {editMode && (
              <button
                type="button"
                onClick={() => addDay(-1)}
                className="mx-auto mt-4 flex items-center gap-1.5 rounded-xl border border-dashed border-sumi/20 px-4 py-2.5 text-sm text-sumi/50 hover:border-ai hover:text-ai dark:border-white/15 dark:text-white/40 dark:hover:border-ai-light dark:hover:text-ai-light"
              >
                <Plus size={15} />
                Add a day
              </button>
            )}
          </div>
        )}
      </main>

      {day && (
        <nav className="fixed inset-x-0 bottom-0 border-t border-sumi/10 bg-washi/95 backdrop-blur dark:border-white/10 dark:bg-ink/95">
          <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3 sm:px-6">
            <button
              type="button"
              onClick={() => goTo(dayIndex - 1)}
              disabled={dayIndex === 0}
              className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-ai transition-opacity disabled:opacity-30 dark:text-ai-light"
            >
              <ChevronLeft size={16} />
              Prev
            </button>
            <span className="font-serif text-sm text-sumi/50 dark:text-white/40">
              {day.city} — Day {dayIndex + 1}
            </span>
            <button
              type="button"
              onClick={() => goTo(dayIndex + 1)}
              disabled={dayIndex === trip.days.length - 1}
              className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-ai transition-opacity disabled:opacity-30 dark:text-ai-light"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </nav>
      )}
    </div>
  )
}

export default function App() {
  return (
    <TripProvider>
      <EditModeProvider>
        <CommentsProvider>
          <AppShell />
        </CommentsProvider>
      </EditModeProvider>
    </TripProvider>
  )
}

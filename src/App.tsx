import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { trip } from './data/tripData'
import TripHeader from './components/TripHeader'
import DaySelector from './components/DaySelector'
import DayTimeline from './components/DayTimeline'

export default function App() {
  const [dayIndex, setDayIndex] = useState(0)
  const day = trip.days[dayIndex]

  const goTo = (index: number) => {
    if (index < 0 || index >= trip.days.length) return
    setDayIndex(index)
  }

  return (
    <div className="min-h-svh bg-washi dark:bg-ink">
      <TripHeader trip={trip} dayIndex={dayIndex} />
      <DaySelector days={trip.days} activeIndex={dayIndex} onSelect={goTo} />

      <main className="pb-24">
        <AnimatePresence mode="wait">
          <DayTimeline key={day.id} day={day} />
        </AnimatePresence>
      </main>

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
    </div>
  )
}

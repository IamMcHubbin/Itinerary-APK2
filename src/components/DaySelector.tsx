import { format } from 'date-fns'
import type { Day } from '../types'

interface DaySelectorProps {
  days: Day[]
  activeIndex: number
  onSelect: (index: number) => void
}

export default function DaySelector({ days, activeIndex, onSelect }: DaySelectorProps) {
  return (
    <div className="sticky top-0 z-10 border-b border-sumi/10 bg-washi/95 backdrop-blur dark:border-white/10 dark:bg-ink/95">
      <div
        className="no-scrollbar mx-auto flex max-w-xl gap-2 overflow-x-auto px-4 py-3 sm:px-6"
        role="tablist"
        aria-label="Trip days"
      >
        {days.map((day, index) => {
          const active = index === activeIndex
          return (
            <button
              key={day.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onSelect(index)}
              className={`flex min-w-[64px] flex-none flex-col items-center rounded-2xl px-3 py-2 transition-colors ${
                active
                  ? 'bg-ai text-washi shadow-sm'
                  : 'bg-washi-dim text-sumi/60 hover:bg-sakura-dim/60 dark:bg-white/5 dark:text-white/50 dark:hover:bg-white/10'
              }`}
            >
              <span className="text-[10px] font-medium tracking-wide uppercase opacity-70">
                {format(new Date(day.date), 'EEE')}
              </span>
              <span className="font-serif text-lg leading-tight">{index + 1}</span>
              <span className="max-w-[64px] truncate text-[10px] opacity-80">{day.city}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

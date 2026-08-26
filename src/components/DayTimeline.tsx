import { motion } from 'framer-motion'
import { format } from 'date-fns'
import type { Day } from '../types'
import ActivityCard from './ActivityCard'

interface DayTimelineProps {
  day: Day
}

export default function DayTimeline({ day }: DayTimelineProps) {
  return (
    <motion.div
      key={day.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="mx-auto max-w-xl px-4 pt-6 sm:px-6"
    >
      <div className="mb-6">
        <p className="text-xs font-medium tracking-widest text-gold uppercase">
          {format(new Date(day.date), 'EEEE, MMMM d')}
        </p>
        <h2 className="mt-1 font-serif text-2xl text-sumi dark:text-white">
          {day.city}
          {day.region && <span className="text-sumi/40 dark:text-white/30"> · {day.region}</span>}
        </h2>
        <p className="mt-1 text-sm text-sumi/60 dark:text-white/50">{day.summary}</p>
      </div>

      <div>
        {day.activities.map((activity, index) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            isLast={index === day.activities.length - 1}
          />
        ))}
      </div>
    </motion.div>
  )
}

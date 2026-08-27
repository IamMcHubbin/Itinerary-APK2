import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { Plus, StickyNote, Trash2 } from 'lucide-react'
import type { Day } from '../types'
import ActivityCard from './ActivityCard'
import EditableText from './EditableText'
import FoodOptions from './FoodOptions'
import WeatherBadge from './WeatherBadge'
import { useEditMode } from '../context/EditModeContext'
import { useTripStore } from '../context/TripContext'

interface DayTimelineProps {
  day: Day
  dayIndex: number
}

export default function DayTimeline({ day, dayIndex }: DayTimelineProps) {
  const { editMode } = useEditMode()
  const { updateDayField, addActivity, addDay, deleteDay } = useTripStore()

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
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium tracking-widest text-gold uppercase">
            {format(new Date(`${day.date}T00:00:00`), 'EEEE, MMMM d')}
          </p>
          {!editMode && <WeatherBadge day={day} />}
        </div>

        {editMode ? (
          <div className="mt-1 space-y-1.5">
            <EditableText
              value={day.city}
              onCommit={(city) => updateDayField(day.id, { city })}
              placeholder="City"
              className="font-serif text-2xl text-sumi dark:text-white"
            />
            <EditableText
              value={day.region ?? ''}
              onCommit={(region) => updateDayField(day.id, { region })}
              placeholder="Region"
              className="text-sm text-sumi/50 dark:text-white/40"
            />
            <EditableText
              value={day.summary}
              onCommit={(summary) => updateDayField(day.id, { summary })}
              placeholder="Summary"
              className="text-sm text-sumi/60 dark:text-white/50"
            />
          </div>
        ) : (
          <>
            <h2 className="mt-1 font-serif text-2xl text-sumi dark:text-white">
              {day.city}
              {day.region && (
                <span className="text-sumi/40 dark:text-white/30"> · {day.region}</span>
              )}
            </h2>
            <p className="mt-1 text-sm text-sumi/60 dark:text-white/50">{day.summary}</p>
          </>
        )}
      </div>

      <div>
        {day.activities.map((activity, index) => (
          <ActivityCard
            key={activity.id}
            dayId={day.id}
            activity={activity}
            isLast={index === day.activities.length - 1}
          />
        ))}
      </div>

      {editMode && (
        <button
          type="button"
          onClick={() => addActivity(day.id)}
          className="mb-6 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-sumi/20 py-2.5 text-sm text-sumi/50 hover:border-ai hover:text-ai dark:border-white/15 dark:text-white/40 dark:hover:border-ai-light dark:hover:text-ai-light"
        >
          <Plus size={15} />
          Add activity
        </button>
      )}

      {day.notes && day.notes.length > 0 && (
        <div className="mb-8 space-y-2">
          {day.notes.map((note) => (
            <p
              key={note}
              className="flex gap-2 rounded-xl bg-sumi/5 px-3 py-2 text-xs text-sumi/60 dark:bg-white/5 dark:text-white/50"
            >
              <StickyNote size={14} className="mt-0.5 flex-none" />
              {note}
            </p>
          ))}
        </div>
      )}

      {day.foodOptions && day.foodOptions.length > 0 && (
        <div className="mb-8">
          <FoodOptions options={day.foodOptions} />
        </div>
      )}

      {editMode && (
        <div className="mb-8 flex gap-2">
          <button
            type="button"
            onClick={() => addDay(dayIndex)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-dashed border-sumi/20 py-2.5 text-sm text-sumi/50 hover:border-ai hover:text-ai dark:border-white/15 dark:text-white/40 dark:hover:border-ai-light dark:hover:text-ai-light"
          >
            <Plus size={15} />
            Insert day after
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Delete Day ${dayIndex + 1} (${day.city})? This can't be undone.`)) {
                deleteDay(day.id)
              }
            }}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-vermillion/30 px-3 py-2.5 text-sm text-vermillion/70 hover:border-vermillion hover:text-vermillion"
          >
            <Trash2 size={15} />
          </button>
        </div>
      )}
    </motion.div>
  )
}

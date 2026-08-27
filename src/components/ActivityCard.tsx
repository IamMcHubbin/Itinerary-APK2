import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Lightbulb, MapPin, MoveRight, Star, Trash2 } from 'lucide-react'
import type { Activity, ActivityCategory } from '../types'
import { categoryStyles } from '../lib/categoryStyles'
import { formatTravelSegment } from '../lib/formatTravel'
import { useEditMode } from '../context/EditModeContext'
import { useTripStore } from '../context/TripContext'
import MapEmbed from './MapEmbed'
import EditableText from './EditableText'
import CommentsThread from './CommentsThread'

interface ActivityCardProps {
  dayId: string
  activity: Activity
  isLast: boolean
}

const categoryOptions = Object.entries(categoryStyles) as [ActivityCategory, { label: string }][]

export default function ActivityCard({ dayId, activity, isLast }: ActivityCardProps) {
  const [open, setOpen] = useState(false)
  const { editMode } = useEditMode()
  const { updateActivity, deleteActivity } = useTripStore()
  const style = categoryStyles[activity.category]
  const Icon = style.icon

  const patch = (fields: Partial<Activity>) => updateActivity(dayId, activity.id, fields)

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`flex h-9 w-9 flex-none items-center justify-center rounded-full shadow-sm ${style.dot}`}
        >
          <Icon size={16} strokeWidth={2} />
        </div>
        {!isLast && <div className="mt-1 w-px flex-1 bg-sumi/15 dark:bg-white/10" />}
      </div>

      <div className="flex-1 pb-6">
        {activity.travelFromPrevious && (
          <p className="mb-1.5 flex items-center gap-1 text-[11px] text-sumi/40 dark:text-white/30">
            <MoveRight size={11} className="flex-none" />
            {formatTravelSegment(activity.travelFromPrevious)}
          </p>
        )}

        <div className="flex items-start justify-between gap-2">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="flex-1 cursor-pointer text-left"
          >
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              {editMode ? (
                <EditableText
                  value={activity.time}
                  onCommit={(time) => patch({ time })}
                  className="w-16 font-serif text-sm text-sumi/50 dark:text-white/40"
                />
              ) : (
                <span className="font-serif text-sm text-sumi/50 dark:text-white/40">
                  {activity.time}
                </span>
              )}

              {editMode ? (
                <select
                  value={activity.category}
                  onChange={(e) => patch({ category: e.target.value as ActivityCategory })}
                  onClick={(e) => e.stopPropagation()}
                  className={`rounded-full border-none px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase ${style.chip}`}
                >
                  {categoryOptions.map(([value, opt]) => (
                    <option key={value} value={value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase ${style.chip}`}
                >
                  {style.label}
                </span>
              )}

              {activity.rating && (
                <span className="flex items-center gap-0.5 text-[10px] text-sumi/50 dark:text-white/40">
                  <Star size={10} fill="currentColor" className="text-gold" />
                  {activity.rating}
                </span>
              )}
            </div>

            {editMode ? (
              <EditableText
                value={activity.title}
                onCommit={(title) => patch({ title })}
                className="mt-1 font-serif text-lg leading-snug text-sumi dark:text-white"
              />
            ) : (
              <h3 className="mt-1 font-serif text-lg leading-snug text-sumi dark:text-white">
                {activity.title}
              </h3>
            )}
          </button>

          <div className="mt-1 flex flex-none items-center gap-1">
            {editMode && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete "${activity.title}"?`)) {
                    deleteActivity(dayId, activity.id)
                  }
                }}
                className="flex h-7 w-7 items-center justify-center rounded-full text-sumi/30 hover:bg-vermillion/10 hover:text-vermillion dark:text-white/30"
                aria-label="Delete activity"
              >
                <Trash2 size={14} />
              </button>
            )}
            <button type="button" onClick={() => setOpen((o) => !o)} aria-label="Toggle details">
              <ChevronDown
                size={18}
                className={`text-sumi/30 transition-transform dark:text-white/30 ${open ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="pt-2">
                {editMode ? (
                  <EditableText
                    value={activity.description ?? ''}
                    onCommit={(description) => patch({ description })}
                    as="textarea"
                    placeholder="Description…"
                    className="text-sm leading-relaxed text-sumi/70 dark:text-white/60"
                  />
                ) : (
                  activity.description && (
                    <p className="text-sm leading-relaxed text-sumi/70 dark:text-white/60">
                      {activity.description}
                    </p>
                  )
                )}

                {activity.location && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-sumi/50 dark:text-white/40">
                    <MapPin size={13} className="flex-none" />
                    {activity.location}
                  </p>
                )}

                {editMode ? (
                  <p className="mt-2 flex gap-2 rounded-xl border border-dashed border-gold/40 bg-gold/5 px-3 py-2 text-xs text-gold dark:border-gold/30 dark:bg-gold/10">
                    <Lightbulb size={14} className="mt-0.5 flex-none" />
                    <EditableText
                      value={activity.tip ?? ''}
                      onCommit={(tip) => patch({ tip })}
                      placeholder="Tip…"
                      className="text-sumi/70 dark:text-white/60"
                    />
                  </p>
                ) : (
                  activity.tip && (
                    <p className="mt-2 flex gap-2 rounded-xl border border-dashed border-gold/40 bg-gold/5 px-3 py-2 text-xs text-gold dark:border-gold/30 dark:bg-gold/10">
                      <Lightbulb size={14} className="mt-0.5 flex-none" />
                      <span className="text-sumi/70 dark:text-white/60">{activity.tip}</span>
                    </p>
                  )
                )}

                {activity.map && <MapEmbed map={activity.map} />}

                <CommentsThread activityId={activity.id} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

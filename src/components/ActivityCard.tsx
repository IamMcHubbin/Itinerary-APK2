import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Lightbulb, MapPin, MoveRight, Star } from 'lucide-react'
import type { Activity } from '../types'
import { categoryStyles } from '../lib/categoryStyles'
import { formatTravelSegment } from '../lib/formatTravel'
import MapEmbed from './MapEmbed'

interface ActivityCardProps {
  activity: Activity
  isLast: boolean
}

export default function ActivityCard({ activity, isLast }: ActivityCardProps) {
  const [open, setOpen] = useState(false)
  const style = categoryStyles[activity.category]
  const Icon = style.icon
  const expandable = Boolean(
    activity.description || activity.map || activity.tip || activity.location,
  )

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

        <button
          type="button"
          onClick={() => expandable && setOpen((o) => !o)}
          aria-expanded={open}
          className={`flex w-full items-start justify-between gap-2 text-left ${expandable ? 'cursor-pointer' : 'cursor-default'}`}
        >
          <div>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="font-serif text-sm text-sumi/50 dark:text-white/40">
                {activity.time}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase ${style.chip}`}
              >
                {style.label}
              </span>
              {activity.rating && (
                <span className="flex items-center gap-0.5 text-[10px] text-sumi/50 dark:text-white/40">
                  <Star size={10} fill="currentColor" className="text-gold" />
                  {activity.rating}
                </span>
              )}
            </div>
            <h3 className="mt-1 font-serif text-lg leading-snug text-sumi dark:text-white">
              {activity.title}
            </h3>
          </div>
          {expandable && (
            <ChevronDown
              size={18}
              className={`mt-1 flex-none text-sumi/30 transition-transform dark:text-white/30 ${open ? 'rotate-180' : ''}`}
            />
          )}
        </button>

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
                {activity.description && (
                  <p className="text-sm leading-relaxed text-sumi/70 dark:text-white/60">
                    {activity.description}
                  </p>
                )}

                {activity.location && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-sumi/50 dark:text-white/40">
                    <MapPin size={13} className="flex-none" />
                    {activity.location}
                  </p>
                )}

                {activity.tip && (
                  <p className="mt-2 flex gap-2 rounded-xl border border-dashed border-gold/40 bg-gold/5 px-3 py-2 text-xs text-gold dark:border-gold/30 dark:bg-gold/10">
                    <Lightbulb size={14} className="mt-0.5 flex-none" />
                    <span className="text-sumi/70 dark:text-white/60">{activity.tip}</span>
                  </p>
                )}

                {activity.map && <MapEmbed map={activity.map} />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

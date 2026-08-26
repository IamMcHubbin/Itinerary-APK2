import { MapPin, Lightbulb } from 'lucide-react'
import type { Activity } from '../types'
import { categoryStyles } from '../lib/categoryStyles'

interface ActivityCardProps {
  activity: Activity
  isLast: boolean
}

export default function ActivityCard({ activity, isLast }: ActivityCardProps) {
  const style = categoryStyles[activity.category]
  const Icon = style.icon

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
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="font-serif text-sm text-sumi/50 dark:text-white/40">
            {activity.time}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase ${style.chip}`}
          >
            {style.label}
          </span>
        </div>

        <h3 className="mt-1 font-serif text-lg leading-snug text-sumi dark:text-white">
          {activity.title}
        </h3>

        {activity.description && (
          <p className="mt-1 text-sm leading-relaxed text-sumi/70 dark:text-white/60">
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
      </div>
    </div>
  )
}

import { Check, Trash2 } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import { useTripStore } from '../context/TripContext'
import type { WishlistItem } from '../types'

interface WishlistItemRowProps {
  item: WishlistItem
}

export default function WishlistItemRow({ item }: WishlistItemRowProps) {
  const { setPlanned, deleteItem } = useWishlist()
  const { trip } = useTripStore()

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 ${
        item.planned
          ? 'border-transparent bg-sumi/5 dark:bg-white/5'
          : 'border-sumi/10 dark:border-white/10'
      }`}
    >
      <button
        type="button"
        onClick={() => setPlanned(item.id, !item.planned, item.linkedDayId)}
        aria-label={item.planned ? 'Mark as not planned' : 'Mark as planned'}
        className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border transition-colors ${
          item.planned
            ? 'border-ai bg-ai text-washi dark:border-ai-light dark:bg-ai-light'
            : 'border-sumi/25 dark:border-white/25'
        }`}
      >
        {item.planned && <Check size={12} strokeWidth={3} />}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`text-sm ${
            item.planned
              ? 'text-sumi/40 line-through dark:text-white/30'
              : 'text-sumi dark:text-white'
          }`}
        >
          {item.title}
        </p>
        {item.notes && (
          <p className="mt-0.5 text-xs text-sumi/50 dark:text-white/40">{item.notes}</p>
        )}
        <p className="mt-1 text-[11px] text-sumi/40 dark:text-white/30">
          Suggested by {item.addedBy}
        </p>

        {item.planned && (
          <select
            value={item.linkedDayId ?? ''}
            onChange={(e) => setPlanned(item.id, true, e.target.value || undefined)}
            className="mt-1.5 rounded-full border border-emerald-600/30 bg-emerald-600/5 px-2 py-1 text-[11px] text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-400"
          >
            <option value="">Which day? (optional)</option>
            {trip.days.map((day, index) => (
              <option key={day.id} value={day.id}>
                Day {index + 1} — {day.city}
              </option>
            ))}
          </select>
        )}
      </div>

      <button
        type="button"
        onClick={() => deleteItem(item.id)}
        className="mt-0.5 flex-none text-sumi/20 hover:text-vermillion dark:text-white/20"
        aria-label="Remove"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}

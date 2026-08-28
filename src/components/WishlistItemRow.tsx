import { useState } from 'react'
import { Check, Heart, Trash2 } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import { useTripStore } from '../context/TripContext'
import { useDisplayName } from '../hooks/useDisplayName'
import type { WishlistItem } from '../types'

interface WishlistItemRowProps {
  item: WishlistItem
}

export default function WishlistItemRow({ item }: WishlistItemRowProps) {
  const { setPlanned, deleteItem, toggleFavorite } = useWishlist()
  const { trip } = useTripStore()
  const { name, saveName } = useDisplayName()
  const [showNamePrompt, setShowNamePrompt] = useState(false)
  const [nameDraft, setNameDraft] = useState('')

  const favoritedBy = item.favoritedBy ?? []
  const iFavorited = name ? favoritedBy.includes(name) : false

  const handleFavoriteClick = () => {
    if (!name) {
      setShowNamePrompt(true)
      return
    }
    toggleFavorite(item.id, name, !iFavorited)
  }

  const confirmNameAndFavorite = () => {
    const trimmed = nameDraft.trim()
    if (!trimmed) return
    saveName(trimmed)
    toggleFavorite(item.id, trimmed, true)
    setShowNamePrompt(false)
  }

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
        {item.foodKind && (
          <p className="mt-0.5 text-[11px] tracking-wide text-sumi/40 uppercase dark:text-white/30">
            {item.foodKind === 'restaurant'
              ? item.foodTypes
                ? `Restaurant · ${item.foodTypes}`
                : 'Restaurant'
              : 'Food type to try'}
          </p>
        )}
        {item.notes && (
          <p className="mt-0.5 text-xs text-sumi/50 dark:text-white/40">{item.notes}</p>
        )}

        <div className="mt-1 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <p className="text-[11px] text-sumi/40 dark:text-white/30">
            Suggested by {item.addedBy}
          </p>
          <button
            type="button"
            onClick={handleFavoriteClick}
            aria-pressed={iFavorited}
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors ${
              iFavorited
                ? 'bg-sakura/20 text-sakura-deep dark:bg-sakura/25 dark:text-sakura'
                : 'text-sumi/40 hover:text-sakura-deep dark:text-white/30 dark:hover:text-sakura'
            }`}
          >
            <Heart size={12} fill={iFavorited ? 'currentColor' : 'none'} />
            {favoritedBy.length > 0 ? favoritedBy.length : ''}
          </button>
        </div>

        {favoritedBy.length > 0 && (
          <p className="mt-0.5 text-[11px] text-sakura-deep dark:text-sakura">
            ♥ {favoritedBy.join(', ')}
          </p>
        )}

        {showNamePrompt && (
          <div className="mt-1.5 flex items-center gap-1.5">
            <input
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') confirmNameAndFavorite()
              }}
              placeholder="Your name"
              autoFocus
              className="min-w-0 flex-1 rounded-full border border-sumi/15 bg-transparent px-2.5 py-1 text-xs text-sumi placeholder:text-sumi/40 focus:border-ai focus:outline-none dark:border-white/15 dark:text-white dark:placeholder:text-white/30"
            />
            <button
              type="button"
              onClick={confirmNameAndFavorite}
              disabled={!nameDraft.trim()}
              className="flex-none rounded-full bg-ai px-3 py-1 text-[11px] font-medium text-washi disabled:opacity-30 dark:bg-ai-light"
            >
              Save
            </button>
          </div>
        )}

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

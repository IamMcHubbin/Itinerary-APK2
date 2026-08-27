import { useState } from 'react'
import { Plus } from 'lucide-react'
import { categoryStyles } from '../lib/categoryStyles'
import { useWishlist } from '../context/WishlistContext'
import { useDisplayName } from '../hooks/useDisplayName'
import type { WishlistCategory, WishlistItem } from '../types'
import WishlistItemRow from './WishlistItemRow'

interface WishlistSectionProps {
  category: WishlistCategory
  items: WishlistItem[]
}

const placeholders: Record<WishlistCategory, string> = {
  lodging: 'e.g. A night in a ryokan',
  sightseeing: 'e.g. teamLab exhibit',
  food: 'e.g. Conveyor-belt sushi',
}

const inputClassName =
  'w-full rounded-lg border border-sumi/15 bg-transparent px-3 py-1.5 text-sm text-sumi placeholder:text-sumi/40 focus:border-ai focus:outline-none dark:border-white/15 dark:text-white dark:placeholder:text-white/30 dark:focus:border-ai-light'

export default function WishlistSection({ category, items }: WishlistSectionProps) {
  const style = categoryStyles[category]
  const Icon = style.icon
  const { addItem } = useWishlist()
  const { name, saveName } = useDisplayName()
  const [showForm, setShowForm] = useState(false)
  const [titleDraft, setTitleDraft] = useState('')
  const [notesDraft, setNotesDraft] = useState('')
  const [nameDraft, setNameDraft] = useState('')

  const authorName = name ?? nameDraft.trim()
  const openCount = items.filter((item) => !item.planned).length
  const sorted = [...items].sort(
    (a, b) =>
      Number(a.planned) - Number(b.planned) ||
      (b.favoritedBy?.length ?? 0) - (a.favoritedBy?.length ?? 0) ||
      a.createdAt - b.createdAt,
  )

  const submit = () => {
    const title = titleDraft.trim()
    if (!title || !authorName) return
    if (!name) saveName(authorName)
    addItem(category, title, notesDraft.trim(), authorName)
    setTitleDraft('')
    setNotesDraft('')
    setNameDraft('')
    setShowForm(false)
  }

  return (
    <section className="mb-8">
      <div className="mb-2 flex items-center gap-2">
        <div
          className={`flex h-7 w-7 flex-none items-center justify-center rounded-full ${style.dot}`}
        >
          <Icon size={13} strokeWidth={2} />
        </div>
        <h3 className="font-serif text-lg text-sumi dark:text-white">{style.label}</h3>
        {openCount > 0 && (
          <span className="text-xs text-sumi/40 dark:text-white/30">{openCount} open</span>
        )}
      </div>

      {sorted.length > 0 && (
        <div className="space-y-2">
          {sorted.map((item) => (
            <WishlistItemRow key={item.id} item={item} />
          ))}
        </div>
      )}

      {showForm ? (
        <div className="mt-2 space-y-2 rounded-xl border border-sumi/10 p-3 dark:border-white/10">
          <input
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            placeholder={placeholders[category]}
            className={inputClassName}
            autoFocus
          />
          <input
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
            placeholder="Notes (optional)"
            className={inputClassName}
          />
          {!name && (
            <input
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              placeholder="Your name"
              className={inputClassName}
            />
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={submit}
              disabled={!titleDraft.trim() || !authorName}
              className="rounded-full bg-ai px-4 py-1.5 text-xs font-medium text-washi disabled:opacity-30 dark:bg-ai-light"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-full px-4 py-1.5 text-xs font-medium text-sumi/50 dark:text-white/40"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="mt-2 flex items-center gap-1.5 text-sm text-sumi/50 hover:text-ai dark:text-white/40 dark:hover:text-ai-light"
        >
          <Plus size={14} />
          Add to {style.label.toLowerCase()}
        </button>
      )}
    </section>
  )
}

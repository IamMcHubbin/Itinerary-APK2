import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { MessageCircle, Send } from 'lucide-react'
import { useComments } from '../context/CommentsContext'
import { useDisplayName } from '../hooks/useDisplayName'

interface CommentsThreadProps {
  activityId: string
}

export default function CommentsThread({ activityId }: CommentsThreadProps) {
  const { commentsByActivity, addComment } = useComments()
  const { name, saveName } = useDisplayName()
  const [draft, setDraft] = useState('')
  const [nameDraft, setNameDraft] = useState('')

  const comments = commentsByActivity[activityId] ?? []

  const post = () => {
    const text = draft.trim()
    if (!text || !name) return
    addComment(activityId, name, text)
    setDraft('')
  }

  return (
    <div className="mt-3 border-t border-sumi/10 pt-3 dark:border-white/10">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-medium tracking-widest text-gold uppercase">
        <MessageCircle size={13} />
        Notes
      </p>

      {comments.length > 0 && (
        <ul className="mb-2 space-y-2">
          {comments.map((comment) => (
            <li key={comment.id} className="rounded-xl bg-sumi/5 px-3 py-2 dark:bg-white/5">
              <p className="text-sm text-sumi/80 dark:text-white/70">{comment.text}</p>
              <p className="mt-1 text-[11px] text-sumi/40 dark:text-white/30">
                {comment.author} · {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
              </p>
            </li>
          ))}
        </ul>
      )}

      {name ? (
        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') post()
            }}
            placeholder={`Leave a note as ${name}…`}
            className="min-w-0 flex-1 rounded-full border border-sumi/15 bg-transparent px-3 py-1.5 text-sm text-sumi placeholder:text-sumi/40 focus:border-ai focus:outline-none dark:border-white/15 dark:text-white dark:placeholder:text-white/30 dark:focus:border-ai-light"
          />
          <button
            type="button"
            onClick={post}
            disabled={!draft.trim()}
            className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-ai text-washi disabled:opacity-30 dark:bg-ai-light"
          >
            <Send size={14} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveName(nameDraft)
            }}
            placeholder="Your name, to leave notes…"
            className="min-w-0 flex-1 rounded-full border border-sumi/15 bg-transparent px-3 py-1.5 text-sm text-sumi placeholder:text-sumi/40 focus:border-ai focus:outline-none dark:border-white/15 dark:text-white dark:placeholder:text-white/30 dark:focus:border-ai-light"
          />
          <button
            type="button"
            onClick={() => saveName(nameDraft)}
            disabled={!nameDraft.trim()}
            className="flex-none rounded-full bg-ai px-3 py-1.5 text-xs font-medium text-washi disabled:opacity-30 dark:bg-ai-light"
          >
            Save
          </button>
        </div>
      )}
    </div>
  )
}

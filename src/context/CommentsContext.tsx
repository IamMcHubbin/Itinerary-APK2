import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db, TRIP_ID, firebaseConfigured } from '../lib/firebase'
import type { Comment } from '../types'

interface CommentsContextValue {
  commentsByActivity: Record<string, Comment[]>
  addComment: (activityId: string, author: string, text: string) => void
  ready: boolean
}

const CommentsContext = createContext<CommentsContextValue | null>(null)

export function CommentsProvider({ children }: { children: ReactNode }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [ready, setReady] = useState(!firebaseConfigured)

  useEffect(() => {
    if (!db) return
    const q = query(collection(db, 'trips', TRIP_ID, 'comments'), orderBy('createdAt', 'asc'))
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Comment))
        setReady(true)
      },
      (error) => {
        console.error('Comments sync error', error)
        setReady(true)
      },
    )
    return unsubscribe
  }, [])

  const commentsByActivity = useMemo(() => {
    const map: Record<string, Comment[]> = {}
    for (const comment of comments) {
      ;(map[comment.activityId] ??= []).push(comment)
    }
    return map
  }, [comments])

  const addComment = useCallback((activityId: string, author: string, text: string) => {
    if (!db) return
    addDoc(collection(db, 'trips', TRIP_ID, 'comments'), {
      activityId,
      author,
      text,
      createdAt: Date.now(),
    }).catch((error) => console.error('Failed to post comment', error))
  }, [])

  return (
    <CommentsContext.Provider value={{ commentsByActivity, addComment, ready }}>
      {children}
    </CommentsContext.Provider>
  )
}

export function useComments(): CommentsContextValue {
  const ctx = useContext(CommentsContext)
  if (!ctx) throw new Error('useComments must be used within CommentsProvider')
  return ctx
}

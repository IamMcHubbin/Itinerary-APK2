import { useEffect, useRef, useState } from 'react'
import { onDisconnect, onValue, ref, remove, set, update } from 'firebase/database'
import { rtdb } from '../lib/firebase'

export interface PresencePeer {
  name: string
  view: string
}

const HEARTBEAT_MS = 25_000
// A peer that hasn't refreshed in this long is treated as gone — covers
// tabs/devices that vanish without a clean disconnect (e.g. a network drop
// onDisconnect doesn't catch in time).
const STALE_MS = 70_000

function randomSessionId() {
  return Math.random().toString(36).slice(2, 10)
}

/** Tracks this session's presence in Realtime Database and returns everyone else's. */
export function usePresence(name: string | null, view: string): PresencePeer[] {
  const sessionId = useRef(randomSessionId())
  const [peers, setPeers] = useState<PresencePeer[]>([])

  useEffect(() => {
    if (!rtdb || !name) return
    const myRef = ref(rtdb, `status/${sessionId.current}`)

    set(myRef, { name, view, lastSeen: Date.now() })
    onDisconnect(myRef).remove()

    const heartbeat = setInterval(() => {
      set(myRef, { name, view, lastSeen: Date.now() })
    }, HEARTBEAT_MS)

    return () => {
      clearInterval(heartbeat)
      remove(myRef)
    }
    // Re-join only when the name changes — `view` updates in-place below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name])

  useEffect(() => {
    if (!rtdb || !name) return
    update(ref(rtdb, `status/${sessionId.current}`), { view, lastSeen: Date.now() })
  }, [view, name])

  useEffect(() => {
    if (!rtdb) return
    const statusRef = ref(rtdb, 'status')
    const unsubscribe = onValue(statusRef, (snapshot) => {
      const now = Date.now()
      const others: PresencePeer[] = []
      snapshot.forEach((child) => {
        if (child.key === sessionId.current) return
        const data = child.val() as { name?: string; view?: string; lastSeen?: number } | null
        if (!data?.name) return
        if (typeof data.lastSeen === 'number' && now - data.lastSeen > STALE_MS) return
        others.push({ name: data.name, view: data.view ?? 'itinerary' })
      })
      setPeers(others)
    })
    return () => unsubscribe()
  }, [])

  return peers
}

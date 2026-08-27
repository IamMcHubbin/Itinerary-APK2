import { useState } from 'react'
import { getStoredName, setStoredName } from '../lib/username'

export function useDisplayName() {
  const [name, setName] = useState<string | null>(() => getStoredName())

  const saveName = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return
    setStoredName(trimmed)
    setName(trimmed)
  }

  return { name, saveName }
}

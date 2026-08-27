import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface EditModeContextValue {
  editMode: boolean
  toggle: () => void
}

const EditModeContext = createContext<EditModeContextValue | null>(null)

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [editMode, setEditMode] = useState(false)
  return (
    <EditModeContext.Provider value={{ editMode, toggle: () => setEditMode((v) => !v) }}>
      {children}
    </EditModeContext.Provider>
  )
}

export function useEditMode(): EditModeContextValue {
  const ctx = useContext(EditModeContext)
  if (!ctx) throw new Error('useEditMode must be used within EditModeProvider')
  return ctx
}

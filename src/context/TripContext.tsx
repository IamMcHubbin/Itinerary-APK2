import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useTrip } from '../hooks/useTrip'
import type { UseTripResult } from '../hooks/useTrip'

const TripContext = createContext<UseTripResult | null>(null)

export function TripProvider({ children }: { children: ReactNode }) {
  const value = useTrip()
  return <TripContext.Provider value={value}>{children}</TripContext.Provider>
}

export function useTripStore(): UseTripResult {
  const ctx = useContext(TripContext)
  if (!ctx) throw new Error('useTripStore must be used within TripProvider')
  return ctx
}

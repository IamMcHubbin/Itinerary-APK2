import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db, TRIP_ID, firebaseConfigured } from '../lib/firebase'
import type { Expense } from '../types'

interface BudgetContextValue {
  expenses: Expense[]
  ready: boolean
  addExpense: (title: string, amountJPY: number, paidBy: string, splitBetween: string[]) => void
  deleteExpense: (expenseId: string) => void
}

const BudgetContext = createContext<BudgetContextValue | null>(null)

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [ready, setReady] = useState(!firebaseConfigured)

  useEffect(() => {
    if (!db) return
    const q = query(collection(db, 'trips', TRIP_ID, 'expenses'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setExpenses(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Expense))
        setReady(true)
      },
      (error) => {
        console.error('Budget sync error', error)
        setReady(true)
      },
    )
    return unsubscribe
  }, [])

  const addExpense = useCallback(
    (title: string, amountJPY: number, paidBy: string, splitBetween: string[]) => {
      if (!db) return
      addDoc(collection(db, 'trips', TRIP_ID, 'expenses'), {
        title,
        amountJPY,
        paidBy,
        splitBetween,
        createdAt: Date.now(),
      }).catch((error) => console.error('Failed to add expense', error))
    },
    [],
  )

  const deleteExpense = useCallback((expenseId: string) => {
    if (!db) return
    deleteDoc(doc(db, 'trips', TRIP_ID, 'expenses', expenseId)).catch((error) =>
      console.error('Failed to delete expense', error),
    )
  }, [])

  return (
    <BudgetContext.Provider value={{ expenses, ready, addExpense, deleteExpense }}>
      {children}
    </BudgetContext.Provider>
  )
}

export function useBudget(): BudgetContextValue {
  const ctx = useContext(BudgetContext)
  if (!ctx) throw new Error('useBudget must be used within BudgetProvider')
  return ctx
}

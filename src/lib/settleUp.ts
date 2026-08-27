import type { Expense } from '../types'

export interface Balance {
  name: string
  /** Positive: they're owed money. Negative: they owe money. */
  netJPY: number
}

export interface Settlement {
  from: string
  to: string
  amountJPY: number
}

export function computeBalances(expenses: Expense[]): Balance[] {
  const net = new Map<string, number>()
  const touch = (name: string) => {
    if (!net.has(name)) net.set(name, 0)
  }

  for (const expense of expenses) {
    if (expense.splitBetween.length === 0) continue
    touch(expense.paidBy)
    const share = expense.amountJPY / expense.splitBetween.length
    net.set(expense.paidBy, (net.get(expense.paidBy) ?? 0) + expense.amountJPY)
    for (const person of expense.splitBetween) {
      touch(person)
      net.set(person, (net.get(person) ?? 0) - share)
    }
  }

  return Array.from(net.entries())
    .map(([name, netJPY]) => ({ name, netJPY: Math.round(netJPY) }))
    .sort((a, b) => b.netJPY - a.netJPY)
}

/**
 * Greedy settle-up: repeatedly pay the biggest creditor from the biggest
 * debtor. Not always the mathematically minimal transaction count, but
 * very close, simple, and exactly how Splitwise itself behaves.
 */
export function computeSettlements(balances: Balance[]): Settlement[] {
  const creditors = balances
    .filter((b) => b.netJPY > 0)
    .map((b) => ({ ...b }))
    .sort((a, b) => b.netJPY - a.netJPY)
  const debtors = balances
    .filter((b) => b.netJPY < 0)
    .map((b) => ({ name: b.name, netJPY: -b.netJPY }))
    .sort((a, b) => b.netJPY - a.netJPY)

  const settlements: Settlement[] = []
  let i = 0
  let j = 0
  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i]
    const debtor = debtors[j]
    const amount = Math.min(creditor.netJPY, debtor.netJPY)
    if (amount > 0) {
      settlements.push({ from: debtor.name, to: creditor.name, amountJPY: Math.round(amount) })
    }
    creditor.netJPY -= amount
    debtor.netJPY -= amount
    if (creditor.netJPY <= 0) i++
    if (debtor.netJPY <= 0) j++
  }

  return settlements
}

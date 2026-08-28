import type { Currency, Expense } from '../types'
import { roundForCurrency } from './formatCurrency'

export interface Balance {
  name: string
  currency: Currency
  /** Positive: they're owed money. Negative: they owe money. */
  net: number
}

export interface Settlement {
  from: string
  to: string
  currency: Currency
  amount: number
}

// Grouped case-insensitively so "jamie" and "Jamie" are always the same
// person, even if mismatched casing ever made it into stored expenses.
function balanceKey(name: string, currency: Currency): string {
  return `${currency}|${name.trim().toLowerCase()}`
}

export function computeBalances(expenses: Expense[]): Balance[] {
  const net = new Map<string, number>()
  const displayName = new Map<string, string>()
  const touch = (key: string, original: string) => {
    if (!net.has(key)) {
      net.set(key, 0)
      displayName.set(key, original)
    }
  }

  for (const expense of expenses) {
    if (expense.splitBetween.length === 0) continue
    const payerKey = balanceKey(expense.paidBy, expense.currency)
    touch(payerKey, expense.paidBy)
    net.set(payerKey, (net.get(payerKey) ?? 0) + expense.amount)

    const share = expense.amount / expense.splitBetween.length
    for (const person of expense.splitBetween) {
      const key = balanceKey(person, expense.currency)
      touch(key, person)
      net.set(key, (net.get(key) ?? 0) - share)
    }
  }

  return Array.from(net.entries())
    .map(([key, value]) => {
      const [currency] = key.split('|') as [Currency, string]
      return { name: displayName.get(key)!, currency, net: roundForCurrency(value, currency) }
    })
    .sort((a, b) => b.net - a.net)
}

/**
 * Greedy settle-up per currency: repeatedly pay the biggest creditor from the
 * biggest debtor. Not always the mathematically minimal transaction count,
 * but very close, simple, and exactly how Splitwise itself behaves.
 */
export function computeSettlements(balances: Balance[]): Settlement[] {
  const currencies = Array.from(new Set(balances.map((b) => b.currency)))
  const settlements: Settlement[] = []

  for (const currency of currencies) {
    const subset = balances.filter((b) => b.currency === currency)
    const creditors = subset
      .filter((b) => b.net > 0)
      .map((b) => ({ ...b }))
      .sort((a, b) => b.net - a.net)
    const debtors = subset
      .filter((b) => b.net < 0)
      .map((b) => ({ name: b.name, net: -b.net }))
      .sort((a, b) => b.net - a.net)

    let i = 0
    let j = 0
    while (i < creditors.length && j < debtors.length) {
      const creditor = creditors[i]
      const debtor = debtors[j]
      const amount = Math.min(creditor.net, debtor.net)
      if (amount > 0) {
        settlements.push({
          from: debtor.name,
          to: creditor.name,
          currency,
          amount: roundForCurrency(amount, currency),
        })
      }
      creditor.net -= amount
      debtor.net -= amount
      if (creditor.net <= 0) i++
      if (debtor.net <= 0) j++
    }
  }

  return settlements
}

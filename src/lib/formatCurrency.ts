import type { Currency, Expense } from '../types'

const formatters: Record<Currency, Intl.NumberFormat> = {
  JPY: new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  }),
  GBP: new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }),
}

export function formatCurrency(amount: number, currency: Currency): string {
  return formatters[currency].format(amount)
}

/** Rounds to whole yen for JPY, nearest penny for GBP. */
export function roundForCurrency(amount: number, currency: Currency): number {
  return currency === 'JPY' ? Math.round(amount) : Math.round(amount * 100) / 100
}

/** Total spent per currency, omitting currencies with nothing logged. */
export function totalsByCurrency(expenses: Expense[]): Partial<Record<Currency, number>> {
  const totals: Partial<Record<Currency, number>> = {}
  for (const expense of expenses) {
    totals[expense.currency] = (totals[expense.currency] ?? 0) + expense.amount
  }
  return totals
}

/** e.g. "¥11,500 · £42.10" — for compact display of mixed-currency totals. */
export function formatTotals(totals: Partial<Record<Currency, number>>): string {
  const entries = Object.entries(totals) as [Currency, number][]
  if (entries.length === 0) return formatCurrency(0, 'JPY')
  return entries.map(([currency, amount]) => formatCurrency(amount, currency)).join(' · ')
}

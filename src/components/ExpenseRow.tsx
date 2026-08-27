import { Trash2 } from 'lucide-react'
import { useBudget } from '../context/BudgetContext'
import { formatCurrency } from '../lib/formatCurrency'
import type { Expense } from '../types'

interface ExpenseRowProps {
  expense: Expense
}

export default function ExpenseRow({ expense }: ExpenseRowProps) {
  const { deleteExpense } = useBudget()
  const share = expense.amount / Math.max(expense.splitBetween.length, 1)

  return (
    <div className="flex items-start gap-3 rounded-xl border border-sumi/10 px-3 py-2.5 dark:border-white/10">
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-sm text-sumi dark:text-white">{expense.title}</p>
          <p className="flex-none font-serif text-sm text-sumi dark:text-white">
            {formatCurrency(expense.amount, expense.currency)}
          </p>
        </div>
        <p className="mt-0.5 text-[11px] text-sumi/40 dark:text-white/30">
          Paid by {expense.paidBy} · split {expense.splitBetween.length}{' '}
          {expense.splitBetween.length === 1 ? 'way' : 'ways'} (
          {formatCurrency(share, expense.currency)} each)
        </p>
      </div>
      <button
        type="button"
        onClick={() => {
          if (window.confirm(`Delete "${expense.title}"?`)) deleteExpense(expense.id)
        }}
        className="mt-0.5 flex-none text-sumi/20 hover:text-vermillion dark:text-white/20"
        aria-label="Delete expense"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}

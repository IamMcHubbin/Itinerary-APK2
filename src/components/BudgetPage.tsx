import { useEffect, useMemo, useState } from 'react'
import { Plus, Scale, HandCoins, ChevronDown } from 'lucide-react'
import { useBudget } from '../context/BudgetContext'
import { useTripStore } from '../context/TripContext'
import { useDisplayName } from '../hooks/useDisplayName'
import { formatCurrency, formatTotals, totalsByCurrency } from '../lib/formatCurrency'
import { dedupeNamesCaseInsensitive, resolveName } from '../lib/names'
import { computeBalances, computeSettlements } from '../lib/settleUp'
import type { Currency } from '../types'
import ExpenseRow from './ExpenseRow'

const inputClassName =
  'w-full rounded-lg border border-sumi/15 bg-transparent px-3 py-1.5 text-sm text-sumi placeholder:text-sumi/40 focus:border-ai focus:outline-none dark:border-white/15 dark:text-white dark:placeholder:text-white/30 dark:focus:border-ai-light'

const currencies: { code: Currency; symbol: string }[] = [
  { code: 'JPY', symbol: '¥' },
  { code: 'GBP', symbol: '£' },
]

export default function BudgetPage() {
  const { expenses, addExpense } = useBudget()
  const { trip, addBudgetParticipants } = useTripStore()
  const { name } = useDisplayName()

  // Everyone who's ever paid or split an expense — persisted on the trip
  // doc so both people see each other here even before either logs one.
  useEffect(() => {
    if (name) addBudgetParticipants([name])
  }, [name, addBudgetParticipants])

  const knownNames = useMemo(() => {
    const persisted = trip.budgetParticipants ?? []
    // Persisted casing wins for anyone already known — "jamie" resolves to
    // the existing "Jamie" rather than showing up as a separate person.
    const ownName = name ? resolveName(name, persisted) : null
    const raw = [
      ...persisted,
      ...(ownName ? [ownName] : []),
      ...expenses.map((e) => e.paidBy),
      ...expenses.flatMap((e) => e.splitBetween),
    ]
    return dedupeNamesCaseInsensitive(raw).sort((a, b) => a.localeCompare(b))
  }, [expenses, name, trip.budgetParticipants])

  const balances = useMemo(() => computeBalances(expenses), [expenses])
  const settlements = useMemo(() => computeSettlements(balances), [balances])
  const total = formatTotals(totalsByCurrency(expenses))

  const [showForm, setShowForm] = useState(false)
  const [titleDraft, setTitleDraft] = useState('')
  const [amountDraft, setAmountDraft] = useState('')
  const [currencyDraft, setCurrencyDraft] = useState<Currency>('JPY')
  const [paidByDraft, setPaidByDraft] = useState(name ?? '')
  const [newPersonDraft, setNewPersonDraft] = useState('')
  const [extraPeople, setExtraPeople] = useState<string[]>([])
  const [splitWith, setSplitWith] = useState<Set<string>>(new Set(knownNames))

  const allPeople = useMemo(
    () => dedupeNamesCaseInsensitive([...knownNames, ...extraPeople]).sort((a, b) => a.localeCompare(b)),
    [knownNames, extraPeople],
  )

  const toggleSplit = (person: string) => {
    setSplitWith((current) => {
      const next = new Set(current)
      if (next.has(person)) next.delete(person)
      else next.add(person)
      return next
    })
  }

  const everyoneSelected = allPeople.length > 0 && splitWith.size === allPeople.length
  const selectEveryone = () => setSplitWith(new Set(allPeople))

  const addPerson = () => {
    // Resolve to an existing person's casing if one matches — "jamie" reuses
    // "Jamie" instead of creating a second, differently-cased entry.
    const resolved = resolveName(newPersonDraft, allPeople)
    if (!resolved) return
    const alreadyKnown = allPeople.some((p) => p.toLowerCase() === resolved.toLowerCase())
    if (!alreadyKnown) {
      setExtraPeople((current) => (current.includes(resolved) ? current : [...current, resolved]))
    }
    setSplitWith((current) => new Set(current).add(resolved))
    setNewPersonDraft('')
  }

  const resetForm = () => {
    setTitleDraft('')
    setAmountDraft('')
    setCurrencyDraft('JPY')
    setPaidByDraft(name ?? '')
    setExtraPeople([])
    setSplitWith(new Set(knownNames))
    setShowForm(false)
  }

  const submit = () => {
    const title = titleDraft.trim()
    const amount = Number(amountDraft)
    const paidBy = paidByDraft.trim()
    const split = Array.from(splitWith)
    if (!title || !amount || amount <= 0 || !paidBy || split.length === 0) return
    addExpense(title, amount, currencyDraft, paidBy, split)
    addBudgetParticipants([paidBy, ...split])
    resetForm()
  }

  return (
    <div className="mx-auto max-w-xl px-4 pt-6 pb-24 sm:px-6">
      <p className="text-xs font-medium tracking-widest text-gold uppercase">Budget</p>
      <h2 className="mt-1 font-serif text-2xl text-sumi dark:text-white">Shared costs</h2>
      <p className="mt-1 mb-6 text-sm text-sumi/60 dark:text-white/50">
        Log what's spent, split it fairly, see who owes who.
      </p>

      <div className="mb-6 rounded-2xl bg-ai px-5 py-4 text-washi">
        <p className="text-xs font-medium tracking-widest text-washi/60 uppercase">Total spent</p>
        <p className="mt-1 font-serif text-3xl">{total}</p>
        <p className="mt-1 text-xs text-washi/60">
          {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}
        </p>
      </div>

      {balances.length > 0 && (
        <section className="mb-6">
          <div className="mb-2 flex items-center gap-1.5">
            <Scale size={14} className="text-gold" />
            <h3 className="font-serif text-lg text-sumi dark:text-white">Balances</h3>
          </div>
          <div className="space-y-1.5">
            {balances.map((b) => (
              <div
                key={`${b.name}-${b.currency}`}
                className="flex items-center justify-between rounded-xl bg-sumi/5 px-3 py-2 text-sm dark:bg-white/5"
              >
                <span className="text-sumi dark:text-white">{b.name}</span>
                <span
                  className={
                    b.net > 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : b.net < 0
                        ? 'text-vermillion'
                        : 'text-sumi/40 dark:text-white/30'
                  }
                >
                  {b.net > 0 ? '+' : ''}
                  {formatCurrency(b.net, b.currency)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {settlements.length > 0 && (
        <section className="mb-6">
          <div className="mb-2 flex items-center gap-1.5">
            <HandCoins size={14} className="text-gold" />
            <h3 className="font-serif text-lg text-sumi dark:text-white">Settle up</h3>
          </div>
          <div className="space-y-1.5">
            {settlements.map((s, i) => (
              <p
                key={i}
                className="rounded-xl border border-dashed border-gold/40 bg-gold/5 px-3 py-2 text-sm text-sumi/80 dark:border-gold/30 dark:bg-gold/10 dark:text-white/70"
              >
                <span className="font-medium">{s.from}</span> owes{' '}
                <span className="font-medium">{s.to}</span> {formatCurrency(s.amount, s.currency)}
              </p>
            ))}
          </div>
        </section>
      )}

      {showForm ? (
        <div className="mb-6 space-y-2.5 rounded-xl border border-sumi/10 p-3 dark:border-white/10">
          <input
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            placeholder="What was it for?"
            className={inputClassName}
            autoFocus
          />
          <div className="flex items-center gap-1.5">
            <input
              value={amountDraft}
              onChange={(e) => setAmountDraft(e.target.value.replace(/[^0-9.]/g, ''))}
              placeholder="Amount"
              inputMode="decimal"
              className={inputClassName}
            />
            <div className="flex flex-none rounded-lg border border-sumi/15 p-0.5 dark:border-white/15">
              {currencies.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setCurrencyDraft(c.code)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    currencyDraft === c.code
                      ? 'bg-ai text-washi dark:bg-ai-light'
                      : 'text-sumi/50 dark:text-white/40'
                  }`}
                >
                  {c.symbol} {c.code}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-xs text-sumi/50 dark:text-white/40">Paid by</p>
            {allPeople.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {allPeople.map((person) => (
                  <button
                    key={person}
                    type="button"
                    onClick={() => setPaidByDraft(person)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      paidByDraft === person
                        ? 'bg-ai text-washi dark:bg-ai-light'
                        : 'bg-sumi/5 text-sumi/50 dark:bg-white/5 dark:text-white/40'
                    }`}
                  >
                    {person}
                  </button>
                ))}
              </div>
            ) : (
              <input
                value={paidByDraft}
                onChange={(e) => setPaidByDraft(e.target.value)}
                placeholder="Your name"
                className={inputClassName}
              />
            )}
          </div>

          <div>
            <p className="mb-1.5 text-xs text-sumi/50 dark:text-white/40">Split between</p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={selectEveryone}
                disabled={allPeople.length === 0}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors disabled:opacity-30 ${
                  everyoneSelected
                    ? 'bg-gold text-ink'
                    : 'bg-sumi/5 text-sumi/50 dark:bg-white/5 dark:text-white/40'
                }`}
              >
                Everyone
              </button>
              {allPeople.map((person) => (
                <button
                  key={person}
                  type="button"
                  onClick={() => toggleSplit(person)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    splitWith.has(person)
                      ? 'bg-ai text-washi dark:bg-ai-light'
                      : 'bg-sumi/5 text-sumi/50 dark:bg-white/5 dark:text-white/40'
                  }`}
                >
                  {person}
                </button>
              ))}
            </div>
            <div className="mt-1.5 flex items-center gap-1.5">
              <div className="relative min-w-0 flex-1">
                <input
                  value={newPersonDraft}
                  onChange={(e) => setNewPersonDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addPerson()
                    }
                  }}
                  placeholder="Add someone new"
                  list="budget-known-names"
                  className="w-full rounded-full border border-sumi/15 bg-transparent py-1 pr-6 pl-2.5 text-xs text-sumi placeholder:text-sumi/40 focus:border-ai focus:outline-none dark:border-white/15 dark:text-white dark:placeholder:text-white/30"
                />
                <ChevronDown
                  size={12}
                  className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-sumi/30 dark:text-white/25"
                />
                <datalist id="budget-known-names">
                  {allPeople.map((p) => (
                    <option key={p} value={p} />
                  ))}
                </datalist>
              </div>
              <button
                type="button"
                onClick={addPerson}
                className="flex-none rounded-full bg-sumi/10 px-3 py-1 text-xs font-medium text-sumi/70 dark:bg-white/10 dark:text-white/60"
              >
                Add
              </button>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={submit}
              disabled={
                !titleDraft.trim() ||
                !Number(amountDraft) ||
                !paidByDraft.trim() ||
                splitWith.size === 0
              }
              className="rounded-full bg-ai px-4 py-1.5 text-xs font-medium text-washi disabled:opacity-30 dark:bg-ai-light"
            >
              Add expense
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full px-4 py-1.5 text-xs font-medium text-sumi/50 dark:text-white/40"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="mb-6 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-sumi/20 py-2.5 text-sm text-sumi/50 hover:border-ai hover:text-ai dark:border-white/15 dark:text-white/40 dark:hover:border-ai-light dark:hover:text-ai-light"
        >
          <Plus size={15} />
          Add expense
        </button>
      )}

      {expenses.length > 0 && (
        <section>
          <h3 className="mb-2 font-serif text-lg text-sumi dark:text-white">All expenses</h3>
          <div className="space-y-2">
            {expenses.map((expense) => (
              <ExpenseRow key={expense.id} expense={expense} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

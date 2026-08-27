import { useMemo } from 'react'
import { format } from 'date-fns'
import { CalendarDays, Compass, ListChecks, Wallet } from 'lucide-react'
import { useTripStore } from '../context/TripContext'
import { useWishlist } from '../context/WishlistContext'
import { useBudget } from '../context/BudgetContext'
import { categoryStyles } from '../lib/categoryStyles'
import { cityAccent } from '../lib/cityAccent'
import { formatYen } from '../lib/formatYen'
import WeatherBadge from './WeatherBadge'

interface OverviewPageProps {
  onJumpToDay: (index: number) => void
}

export default function OverviewPage({ onJumpToDay }: OverviewPageProps) {
  const { trip } = useTripStore()
  const { items: wishlistItems } = useWishlist()
  const { expenses } = useBudget()

  const knownCities = useMemo(() => {
    const seen: string[] = []
    for (const day of trip.days) {
      if (!seen.includes(day.city)) seen.push(day.city)
    }
    return seen
  }, [trip.days])

  const totalActivities = trip.days.reduce((sum, d) => sum + d.activities.length, 0)
  const plannedWishlistCount = wishlistItems.filter((i) => i.planned).length
  const totalSpent = expenses.reduce((sum, e) => sum + e.amountJPY, 0)

  const stats = [
    { icon: CalendarDays, value: trip.days.length, label: 'days planned' },
    { icon: Compass, value: totalActivities, label: 'activities' },
    { icon: ListChecks, value: plannedWishlistCount, label: 'wishlist items locked in' },
    { icon: Wallet, value: formatYen(totalSpent), label: 'spent so far' },
  ]

  return (
    <div className="mx-auto max-w-xl px-4 pt-6 pb-24 sm:px-6">
      <p className="text-xs font-medium tracking-widest text-gold uppercase">Overview</p>
      <h2 className="mt-1 font-serif text-2xl text-sumi dark:text-white">The whole trip</h2>
      <p className="mt-1 mb-6 text-sm text-sumi/60 dark:text-white/50">
        Every day at a glance — tap one to jump in.
      </p>

      <div className="mb-8 grid grid-cols-2 gap-2.5">
        {stats.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="rounded-2xl bg-sumi/5 px-4 py-3.5 dark:bg-white/5"
          >
            <Icon size={16} className="text-gold" />
            <p className="mt-2 font-serif text-2xl text-sumi dark:text-white">{value}</p>
            <p className="text-xs text-sumi/50 dark:text-white/40">{label}</p>
          </div>
        ))}
      </div>

      <div className="relative">
        {trip.days.map((day, index) => {
          const accent = cityAccent(day.city, knownCities)
          const isLast = index === trip.days.length - 1
          const categories = Array.from(new Set(day.activities.map((a) => a.category)))

          return (
            <button
              key={day.id}
              type="button"
              onClick={() => onJumpToDay(index)}
              className="flex w-full gap-4 text-left"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-9 w-9 flex-none items-center justify-center rounded-full font-serif text-sm text-washi shadow-sm ${accent.dot}`}
                >
                  {index + 1}
                </div>
                {!isLast && <div className={`mt-1 w-0.5 flex-1 ${accent.line}`} />}
              </div>

              <div className="flex-1 pb-6">
                <div className="rounded-2xl border border-sumi/10 p-3.5 transition-colors hover:border-ai/30 dark:border-white/10 dark:hover:border-ai-light/40">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[11px] tracking-wide text-sumi/40 uppercase dark:text-white/30">
                        {format(new Date(`${day.date}T00:00:00`), 'EEE, MMM d')}
                      </p>
                      <p className={`font-serif text-lg ${accent.text}`}>
                        {day.city}
                        {day.region && (
                          <span className="text-sumi/40 dark:text-white/30">
                            {' '}
                            · {day.region}
                          </span>
                        )}
                      </p>
                    </div>
                    <WeatherBadge day={day} />
                  </div>

                  <p className="mt-1.5 text-sm text-sumi/60 dark:text-white/50">{day.summary}</p>

                  {categories.length > 0 && (
                    <div className="mt-2.5 flex gap-1.5">
                      {categories.map((category) => {
                        const style = categoryStyles[category]
                        const Icon = style.icon
                        return (
                          <span
                            key={category}
                            className={`flex h-6 w-6 items-center justify-center rounded-full ${style.dot}`}
                            title={style.label}
                          >
                            <Icon size={12} strokeWidth={2} />
                          </span>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

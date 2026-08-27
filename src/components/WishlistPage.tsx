import { useWishlist } from '../context/WishlistContext'
import type { WishlistCategory } from '../types'
import WishlistSection from './WishlistSection'

const CATEGORIES: WishlistCategory[] = ['lodging', 'sightseeing', 'food']

export default function WishlistPage() {
  const { items } = useWishlist()

  return (
    <div className="mx-auto max-w-xl px-4 pt-6 pb-24 sm:px-6">
      <p className="text-xs font-medium tracking-widest text-gold uppercase">Wishlist</p>
      <h2 className="mt-1 font-serif text-2xl text-sumi dark:text-white">
        Things people want to do
      </h2>
      <p className="mt-1 mb-6 text-sm text-sumi/60 dark:text-white/50">
        Suggest a place, then check it off once it lands on the itinerary.
      </p>

      {CATEGORIES.map((category) => (
        <WishlistSection
          key={category}
          category={category}
          items={items.filter((item) => item.category === category)}
        />
      ))}
    </div>
  )
}

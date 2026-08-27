import type { FoodOption } from '../types'
import FoodOptionCard from './FoodOptionCard'

interface FoodOptionsProps {
  options: FoodOption[]
}

export default function FoodOptions({ options }: FoodOptionsProps) {
  return (
    <div className="mt-2">
      <p className="mb-2 text-xs font-medium tracking-widest text-gold uppercase">Food options</p>
      <div className="space-y-2">
        {options.map((option) => (
          <FoodOptionCard key={option.id} option={option} />
        ))}
      </div>
    </div>
  )
}

import {
  Train,
  UtensilsCrossed,
  Landmark,
  BedDouble,
  ShoppingBag,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import type { ActivityCategory } from '../types'

interface CategoryStyle {
  label: string
  icon: LucideIcon
  dot: string
  chip: string
}

export const categoryStyles: Record<ActivityCategory, CategoryStyle> = {
  transport: {
    label: 'Transport',
    icon: Train,
    dot: 'bg-ai text-washi',
    chip: 'bg-ai/10 text-ai dark:bg-ai-light/25 dark:text-[#a9bce8]',
  },
  food: {
    label: 'Food',
    icon: UtensilsCrossed,
    dot: 'bg-vermillion text-washi',
    chip: 'bg-vermillion/10 text-vermillion dark:bg-vermillion/25 dark:text-[#ff9c8f]',
  },
  sightseeing: {
    label: 'Sightseeing',
    icon: Landmark,
    dot: 'bg-gold text-washi',
    chip: 'bg-gold/15 text-gold dark:bg-gold/25 dark:text-[#e8c565]',
  },
  lodging: {
    label: 'Lodging',
    icon: BedDouble,
    dot: 'bg-ai-light text-washi',
    chip: 'bg-ai-light/10 text-ai-light dark:bg-ai-light/25 dark:text-[#a9bce8]',
  },
  shopping: {
    label: 'Shopping',
    icon: ShoppingBag,
    dot: 'bg-sakura text-ai',
    chip: 'bg-sakura/20 text-sakura-deep dark:bg-sakura/20 dark:text-sakura',
  },
  experience: {
    label: 'Experience',
    icon: Sparkles,
    dot: 'bg-sumi text-washi',
    chip: 'bg-sumi/10 text-sumi dark:bg-white/15 dark:text-white',
  },
}

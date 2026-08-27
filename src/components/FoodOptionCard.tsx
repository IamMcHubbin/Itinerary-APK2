import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Star } from 'lucide-react'
import type { FoodOption } from '../types'
import MapEmbed from './MapEmbed'

interface FoodOptionCardProps {
  option: FoodOption
}

export default function FoodOptionCard({ option }: FoodOptionCardProps) {
  const [open, setOpen] = useState(false)
  const expandable = Boolean(option.description || option.map)

  return (
    <div className="rounded-xl border border-sumi/10 dark:border-white/10">
      <button
        type="button"
        onClick={() => expandable && setOpen((o) => !o)}
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left ${expandable ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <div>
          <p className="font-serif text-sm text-sumi dark:text-white">{option.name}</p>
          {option.rating && (
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-sumi/50 dark:text-white/40">
              <Star size={10} fill="currentColor" className="text-gold" />
              {option.rating}
            </p>
          )}
        </div>
        {expandable && (
          <ChevronDown
            size={16}
            className={`flex-none text-sumi/30 transition-transform dark:text-white/30 ${open ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3">
              {option.description && (
                <p className="text-sm leading-relaxed text-sumi/70 dark:text-white/60">
                  {option.description}
                </p>
              )}
              {option.map && <MapEmbed map={option.map} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Cycles a small palette of theme accents across cities, for the Overview route map. */
const palette = [
  { dot: 'bg-ai', text: 'text-ai dark:text-ai-light', line: 'bg-ai/30 dark:bg-ai-light/30' },
  {
    dot: 'bg-vermillion',
    text: 'text-vermillion',
    line: 'bg-vermillion/30',
  },
  { dot: 'bg-gold', text: 'text-gold', line: 'bg-gold/30' },
  {
    dot: 'bg-sakura',
    text: 'text-sakura-deep dark:text-sakura',
    line: 'bg-sakura/40',
  },
]

export function cityAccent(city: string, knownCities: string[]) {
  const index = knownCities.indexOf(city)
  return palette[(index < 0 ? 0 : index) % palette.length]
}

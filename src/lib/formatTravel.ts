import type { TravelSegment } from '../types'

const modeLabel: Record<TravelSegment['mode'], string> = {
  walking: 'walk',
  transit: 'transit',
  driving: 'drive',
}

export function formatTravelSegment(segment: TravelSegment): string {
  const parts = [segment.duration, modeLabel[segment.mode]].filter(Boolean)
  const base = parts.join(' ')
  return segment.note ? `${base} · ${segment.note}` : base
}

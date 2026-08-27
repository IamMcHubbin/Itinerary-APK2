import { ExternalLink } from 'lucide-react'
import type { MapLocation } from '../types'
import { appleMapsUrl, googleMapsEmbedUrl, googleMapsUrl } from '../lib/maps'

interface MapEmbedProps {
  map: MapLocation
}

export default function MapEmbed({ map }: MapEmbedProps) {
  return (
    <div className="mt-3 space-y-2">
      <div className="overflow-hidden rounded-xl border border-sumi/10 dark:border-white/10">
        <iframe
          title={`Map of ${map.label}`}
          src={googleMapsEmbedUrl(map)}
          width="100%"
          height="180"
          style={{ border: 0, display: 'block' }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="flex gap-4 text-xs">
        <a
          href={googleMapsUrl(map)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 font-medium text-ai dark:text-ai-light"
        >
          <ExternalLink size={12} /> Google Maps
        </a>
        <a
          href={appleMapsUrl(map)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 font-medium text-ai dark:text-ai-light"
        >
          <ExternalLink size={12} /> Apple Maps
        </a>
      </div>
    </div>
  )
}

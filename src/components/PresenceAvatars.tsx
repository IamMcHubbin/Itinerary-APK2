import type { PresencePeer } from '../hooks/usePresence'
import { avatarColor, initials } from '../lib/avatarColor'

interface PresenceAvatarsProps {
  peers: PresencePeer[]
}

export default function PresenceAvatars({ peers }: PresenceAvatarsProps) {
  if (peers.length === 0) return null

  const shown = peers.slice(0, 4)
  const overflow = peers.length - shown.length

  return (
    <div
      className="flex items-center -space-x-2"
      title={peers.map((peer) => peer.name).join(', ')}
    >
      {shown.map((peer, index) => (
        <span
          key={`${peer.name}-${index}`}
          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-ai text-[10px] font-semibold ${avatarColor(peer.name)}`}
        >
          {initials(peer.name)}
        </span>
      ))}
      {overflow > 0 && (
        <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-ai bg-washi/20 text-[10px] font-semibold text-washi">
          +{overflow}
        </span>
      )}
    </div>
  )
}

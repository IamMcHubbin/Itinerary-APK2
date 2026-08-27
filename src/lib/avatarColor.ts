/** Deterministically picks an accent for a presence avatar from a person's name. */
const palette = [
  'bg-vermillion text-washi',
  'bg-gold text-ink',
  'bg-sakura-deep text-washi',
  'bg-ai-light text-washi',
  'bg-emerald-600 text-washi',
  'bg-indigo-500 text-washi',
]

export function avatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0
  }
  return palette[Math.abs(hash) % palette.length]
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

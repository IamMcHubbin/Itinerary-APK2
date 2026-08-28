/** Resolves input to an existing name's casing if one matches case-insensitively, else trims it as-is. */
export function resolveName(input: string, known: string[]): string {
  const trimmed = input.trim()
  if (!trimmed) return trimmed
  const existing = known.find((name) => name.toLowerCase() === trimmed.toLowerCase())
  return existing ?? trimmed
}

/** De-dupes names case-insensitively, keeping whichever casing appeared first. */
export function dedupeNamesCaseInsensitive(names: string[]): string[] {
  const seen = new Map<string, string>()
  for (const raw of names) {
    const trimmed = raw.trim()
    if (!trimmed) continue
    const key = trimmed.toLowerCase()
    if (!seen.has(key)) seen.set(key, trimmed)
  }
  return Array.from(seen.values())
}

export function formatYen(amount: number): string {
  return `¥${Math.round(amount).toLocaleString('en-US')}`
}

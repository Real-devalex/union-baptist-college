import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(value: number | null, decimals = 2): string {
  if (value === null || value === undefined) return '—'
  return value.toFixed(decimals)
}

export function formatPercentage(value: number | null): string {
  if (value === null || value === undefined) return '—'
  return `${value.toFixed(2)}%`
}

export function formatDate(date: string | Date | null): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-NG', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function ordinalSuffix(position: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const v = position % 100
  return position + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0])
}

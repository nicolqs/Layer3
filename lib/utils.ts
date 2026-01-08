import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Truncate Ethereum address for display
 */
export function truncateAddress(
  address: string,
  startLength: number = 6,
  endLength: number = 4,
): string {
  if (!address || address.length < startLength + endLength) {
    return address
  }
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}

/**
 * Format token balance for display
 */
export function formatTokenBalance(balance: string | number): string {
  const num = typeof balance === 'string' ? parseFloat(balance) : balance

  if (isNaN(num) || num === 0) return '0.00'
  if (num < 0.0001) return '<0.0001'
  if (num < 1) return num.toFixed(4)
  if (num < 1000) return num.toFixed(2)

  // Format with commas for thousands
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/**
 * Format USD value for display
 */
export function formatUsdValue(value: number): string {
  if (isNaN(value) || value === 0) return '$0.00'
  if (value < 0.01) return '$0.00'

  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/**
 * Price display utilities for crypto assets
 * Handles formatting and conversion between native and USD values
 */

import { TokenBalance } from './types'

export type PriceDisplayMode = 'native' | 'usd'

/**
 * Format native token amount with symbol
 * @param balance - Token balance string
 * @param symbol - Token symbol
 * @param decimals - Number of decimal places (default: 4)
 */
export function formatNativeAmount(
  balance: string,
  symbol: string,
  decimals: number = 4,
): string {
  const amount = parseFloat(balance)
  if (isNaN(amount)) return '0'

  return `${amount.toFixed(decimals)} ${symbol}`
}

/**
 * Format USD value
 * @param balance - Token balance string
 * @param price - Token price in USD
 */
export function formatUSDValue(balance: string, price?: number): string | null {
  if (!price) return null

  const amount = parseFloat(balance)
  if (isNaN(amount)) return null

  const usdValue = amount * price
  return formatUSD(usdValue)
}

/**
 * Format a number as USD currency
 * @param value - Numeric value to format
 */
export function formatUSD(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`
  } else if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`
  } else if (value >= 1) {
    return `$${value.toFixed(2)}`
  } else if (value >= 0.01) {
    return `$${value.toFixed(4)}`
  } else {
    return `$${value.toFixed(6)}`
  }
}

/**
 * Get display value based on mode
 * @param token - Token balance object
 * @param mode - Display mode (native or usd)
 */
export function getDisplayValue(
  token: TokenBalance,
  mode: PriceDisplayMode,
): {
  primary: string
  secondary: string | null
} {
  if (mode === 'native') {
    return {
      primary: formatNativeAmount(token.balance, token.symbol),
      secondary: formatUSDValue(token.balance, token.price),
    }
  } else {
    const usdValue = formatUSDValue(token.balance, token.price)
    return {
      primary: usdValue || formatNativeAmount(token.balance, token.symbol),
      secondary: usdValue
        ? formatNativeAmount(token.balance, token.symbol)
        : null,
    }
  }
}

/**
 * Calculate total portfolio value in USD
 * @param balances - Array of token balances
 */
export function calculateTotalValue(balances: TokenBalance[]): number {
  return balances.reduce((acc, balance) => {
    const value = parseFloat(balance.balance) * (balance.price || 0)
    return acc + (isNaN(value) ? 0 : value)
  }, 0)
}

/**
 * Get display label for price mode
 */
export function getPriceDisplayLabel(mode: PriceDisplayMode): string {
  return mode === 'native' ? 'USD' : 'Native'
}

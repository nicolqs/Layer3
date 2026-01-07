import { DateRangeFilter, EtherscanTransaction } from './types'
import { formatUnits } from 'viem'

export interface TransactionStats {
  totalTransactions: number
  totalVolume: string
  successRate: number
  totalGasFees: string
}

export function calculateTransactionStats(
  transactions: EtherscanTransaction[],
): TransactionStats {
  if (!transactions || transactions.length === 0) {
    return {
      totalTransactions: 0,
      totalVolume: '0',
      successRate: 0,
      totalGasFees: '0',
    }
  }

  let totalVolume = BigInt(0)
  let totalGas = BigInt(0)
  let successCount = 0

  for (const tx of transactions) {
    totalVolume += BigInt(tx.value || '0')

    const gasUsed = BigInt(tx.gasUsed || '0')
    const gasPrice = BigInt(tx.gasPrice || '0')
    totalGas += gasUsed * gasPrice

    if (tx.isError === '0') {
      successCount++
    }
  }

  // Use formatUnits for precise BigInt to decimal conversion
  const volumeStr = formatUnits(totalVolume, 18)
  const gasStr = formatUnits(totalGas, 18)

  return {
    totalTransactions: transactions.length,
    totalVolume: parseFloat(volumeStr).toFixed(4),
    successRate: Math.round((successCount / transactions.length) * 100),
    totalGasFees: parseFloat(gasStr).toFixed(6),
  }
}

export function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp * 1000

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 30) return `${days}d ago`

  return new Date(timestamp * 1000).toLocaleDateString()
}

export function filterTransactionsByDateRange(
  transactions: EtherscanTransaction[],
  range: DateRangeFilter,
): EtherscanTransaction[] {
  if (range === 'all') return transactions

  const now = Date.now() / 1000
  const ranges = {
    '7d': 7 * 24 * 60 * 60,
    '30d': 30 * 24 * 60 * 60,
    '90d': 90 * 24 * 60 * 60,
  }

  const cutoff = now - ranges[range]
  return transactions.filter((tx) => parseInt(tx.timeStamp) >= cutoff)
}

import { describe, it, expect } from 'vitest'
import {
  calculateTransactionStats,
  filterTransactionsByDateRange,
  formatRelativeTime,
} from '@/lib/transactionStats'
import type { MultiChainTransaction } from '@/lib/types'

describe('Transaction Stats', () => {
  const now = Math.floor(Date.now() / 1000)
  const oneDayAgo = now - 86400
  const oneWeekAgo = now - 7 * 86400
  const oneMonthAgo = now - 30 * 86400

  const createTx = (
    timestamp: number,
    value: string,
    isError: string = '0',
    gasUsed: string = '21000',
    gasPrice: string = '20000000000',
  ): MultiChainTransaction => ({
    blockNumber: '12345',
    timeStamp: timestamp.toString(),
    hash: `0x${timestamp}`,
    nonce: '1',
    blockHash: '0xdef456',
    transactionIndex: '0',
    from: '0x1234567890123456789012345678901234567890',
    to: '0x0987654321098765432109876543210987654321',
    value,
    gas: '21000',
    gasPrice,
    isError,
    txreceipt_status: isError === '0' ? '1' : '0',
    input: '0x',
    contractAddress: '',
    cumulativeGasUsed: gasUsed,
    gasUsed,
    confirmations: '100',
    methodId: '',
    functionName: '',
    chainId: 1,
    chainName: 'Ethereum',
  })

  describe('calculateTransactionStats', () => {
    it('should calculate stats for successful transactions', () => {
      const transactions = [
        createTx(now, '1000000000000000000'), // 1 ETH
        createTx(now, '2000000000000000000'), // 2 ETH
        createTx(now, '3000000000000000000'), // 3 ETH
      ]

      const stats = calculateTransactionStats(transactions)

      expect(stats.totalTransactions).toBe(3)
      expect(stats.successRate).toBe(100)
      expect(parseFloat(stats.totalVolume)).toBeCloseTo(6, 1) // 6 ETH
    })

    it('should handle failed transactions', () => {
      const transactions = [
        createTx(now, '1000000000000000000', '0'), // Success
        createTx(now, '2000000000000000000', '1'), // Failed
        createTx(now, '3000000000000000000', '0'), // Success
      ]

      const stats = calculateTransactionStats(transactions)

      expect(stats.totalTransactions).toBe(3)
      expect(stats.successRate).toBeCloseTo(66.67, 0)
    })

    it('should calculate total gas fees', () => {
      const transactions = [
        createTx(now, '1000000000000000000', '0', '21000', '20000000000'),
      ]

      const stats = calculateTransactionStats(transactions)

      expect(parseFloat(stats.totalGasFees)).toBeGreaterThan(0)
    })

    it('should handle empty array', () => {
      const stats = calculateTransactionStats([])

      expect(stats.totalTransactions).toBe(0)
      expect(stats.successRate).toBe(0)
      expect(stats.totalVolume).toBe('0')
      expect(stats.totalGasFees).toBe('0')
    })

    it('should handle transactions with missing values', () => {
      const transactions = [
        createTx(now, '', '0', '', ''), // Empty strings for value, gasUsed, gasPrice
      ]

      const stats = calculateTransactionStats(transactions)

      expect(stats.totalTransactions).toBe(1)
      expect(parseFloat(stats.totalVolume)).toBe(0)
      expect(parseFloat(stats.totalGasFees)).toBe(0)
    })
  })

  describe('filterTransactionsByDateRange', () => {
    it('should return all transactions for "all" range', () => {
      const transactions = [
        createTx(now, '1000000000000000000'),
        createTx(oneMonthAgo, '1000000000000000000'),
      ]

      const filtered = filterTransactionsByDateRange(transactions, 'all')
      expect(filtered).toHaveLength(2)
    })

    it('should filter transactions within 7 days', () => {
      const transactions = [
        createTx(now, '1000000000000000000'),
        createTx(oneDayAgo, '1000000000000000000'),
        createTx(oneWeekAgo - 86400, '1000000000000000000'), // 8 days ago
      ]

      const filtered = filterTransactionsByDateRange(transactions, '7d')
      expect(filtered).toHaveLength(2)
    })

    it('should filter transactions within 30 days', () => {
      const transactions = [
        createTx(now, '1000000000000000000'),
        createTx(oneWeekAgo, '1000000000000000000'),
        createTx(oneMonthAgo + 86400, '1000000000000000000'), // 29 days ago
        createTx(oneMonthAgo - 86400, '1000000000000000000'), // 31 days ago
      ]

      const filtered = filterTransactionsByDateRange(transactions, '30d')
      expect(filtered).toHaveLength(3)
    })

    it('should filter transactions within 90 days', () => {
      const transactions = [
        createTx(now, '1000000000000000000'),
        createTx(oneMonthAgo * 3, '1000000000000000000'), // ~90 days
      ]

      const filtered = filterTransactionsByDateRange(transactions, '90d')
      expect(filtered).toHaveLength(2)
    })
  })

  describe('formatRelativeTime', () => {
    it('should format seconds', () => {
      const timestamp = (now - 30).toString()
      const result = formatRelativeTime(timestamp)
      expect(result).toMatch(/ago|Just now/)
    })

    it('should format minutes', () => {
      const timestamp = (now - 120).toString()
      const result = formatRelativeTime(timestamp)
      expect(result).toBe('2m ago')
    })

    it('should format hours', () => {
      const timestamp = (now - 7200).toString()
      const result = formatRelativeTime(timestamp)
      expect(result).toBe('2h ago')
    })

    it('should format days', () => {
      const timestamp = (now - 172800).toString()
      const result = formatRelativeTime(timestamp)
      expect(result).toBe('2d ago')
    })

    it('should format months', () => {
      const timestamp = (now - 5184000).toString() // ~60 days
      const result = formatRelativeTime(timestamp)
      expect(result).toMatch(/mo ago|\//) // Either relative or date format
    })
  })
})

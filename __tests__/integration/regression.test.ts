import { describe, expect, it } from 'vitest'

/**
 * Regression Tests - High-Level Smoke Tests
 *
 * These tests verify critical user flows don't break
 * They're lightweight but catch major regressions
 */

describe('Regression Tests', () => {
  describe('Critical Data Transformations', () => {
    it('should not break transaction intent decoder', async () => {
      const { decodeTransactionIntent } =
        await import('@/lib/transactionIntent')

      const mockTx = {
        input: '0x',
        methodId: '',
        functionName: '',
        value: '1000000000000000000',
        from: '0x1234567890123456789012345678901234567890',
        to: '0x0987654321098765432109876543210987654321',
        contractAddress: '',
        blockNumber: '1',
        timeStamp: '1',
        hash: '0x1',
        nonce: '1',
        blockHash: '0x1',
        transactionIndex: '0',
        gas: '21000',
        gasPrice: '20000000000',
        isError: '0',
        txreceipt_status: '1',
        cumulativeGasUsed: '21000',
        gasUsed: '21000',
        confirmations: '100',
        chainId: 1,
        chainName: 'Ethereum',
      }

      const result = decodeTransactionIntent(mockTx, mockTx.from)
      expect(result).toHaveProperty('type')
      expect(result).toHaveProperty('description')
    })

    it('should not break transaction stats calculator', async () => {
      const { calculateTransactionStats } =
        await import('@/lib/transactionStats')

      const result = calculateTransactionStats([])
      expect(result).toHaveProperty('totalTransactions')
      expect(result).toHaveProperty('totalVolume')
      expect(result).toHaveProperty('successRate')
      expect(result).toHaveProperty('totalGasFees')
    })

    it('should not break address truncation', async () => {
      const { truncateAddress } = await import('@/lib/utils')

      const address = '0x1234567890123456789012345678901234567890'
      const result = truncateAddress(address)

      expect(result).toContain('0x')
      expect(result).toContain('...')
      expect(result.length).toBeLessThan(address.length)
    })
  })

  describe('Chain Configuration', () => {
    it('should have valid chain configs', async () => {
      const { chains } = await import('@/lib/viem')

      expect(Array.isArray(chains)).toBe(true)
      expect(chains.length).toBeGreaterThan(0)

      chains.forEach((chain: any) => {
        expect(chain).toHaveProperty('id')
        expect(chain).toHaveProperty('name')
        expect(chain).toHaveProperty('nativeCurrency')
        expect(typeof chain.id).toBe('number')
      })
    })

    it('should have explorer URLs for major chains', async () => {
      const { CHAIN_EXPLORERS } = await import('@/lib/chains')

      // Test major chains
      expect(CHAIN_EXPLORERS[1]).toBeDefined() // Ethereum
      expect(CHAIN_EXPLORERS[8453]).toBeDefined() // Base
      expect(CHAIN_EXPLORERS[42161]).toBeDefined() // Arbitrum

      Object.values(CHAIN_EXPLORERS).forEach((config: any) => {
        expect(config).toHaveProperty('explorer')
        expect(config.explorer).toMatch(/^https:\/\//)
      })
    })
  })

  describe('Type Safety', () => {
    it('should have valid transaction types', async () => {
      const types = await import('@/lib/types')

      // Just verify the types module loads without errors
      expect(types.DATE_RANGE_OPTIONS).toContain('all')
      expect(types.DATE_RANGE_OPTIONS).toContain('7d')
      expect(types.DATE_RANGE_OPTIONS).toContain('30d')
      expect(types.DATE_RANGE_OPTIONS).toContain('90d')
    })
  })

  describe('Critical Constants', () => {
    it('should have popular tokens configured', async () => {
      const { POPULAR_TOKENS } = await import('@/lib/tokens')

      expect(POPULAR_TOKENS).toBeDefined()
      expect(typeof POPULAR_TOKENS).toBe('object')

      // Verify tokens have required fields
      Object.values(POPULAR_TOKENS).forEach((tokens: any) => {
        if (Array.isArray(tokens)) {
          tokens.forEach((token) => {
            expect(token).toHaveProperty('address')
            expect(token).toHaveProperty('symbol')
            expect(token).toHaveProperty('name')
            expect(token).toHaveProperty('decimals')
          })
        }
      })
    })
  })
})

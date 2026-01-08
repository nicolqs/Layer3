import { describe, it, expect } from 'vitest'
import { getChainInfo, CHAIN_EXPLORERS } from '@/lib/chains'

describe('Chain Utilities', () => {
  describe('getChainInfo', () => {
    it('should return info for Ethereum', () => {
      const info = getChainInfo(1)
      expect(info).toBeDefined()
      expect(info?.name).toBe('Ethereum')
      expect(info?.nativeCurrency.symbol).toBe('ETH')
    })

    it('should return info for Base', () => {
      const info = getChainInfo(8453)
      expect(info).toBeDefined()
      expect(info?.name).toBe('Base')
    })

    it('should return info for Arbitrum', () => {
      const info = getChainInfo(42161)
      expect(info).toBeDefined()
      expect(info?.name).toBe('Arbitrum One')
    })

    it('should return undefined for unknown chain', () => {
      const info = getChainInfo(99999999)
      expect(info).toBeUndefined()
    })
  })

  describe('CHAIN_EXPLORERS', () => {
    it('should have explorers for major chains', () => {
      expect(CHAIN_EXPLORERS[1]?.explorer).toBe('https://etherscan.io')
      expect(CHAIN_EXPLORERS[8453]?.explorer).toBe('https://basescan.org')
      expect(CHAIN_EXPLORERS[42161]?.explorer).toBe('https://arbiscan.io')
      expect(CHAIN_EXPLORERS[137]?.explorer).toBe('https://polygonscan.com')
    })

    it('should have consistent URL format', () => {
      Object.values(CHAIN_EXPLORERS).forEach((config) => {
        expect(config.explorer).toMatch(/^https:\/\//)
        expect(config.explorer).not.toMatch(/\/$/) // No trailing slash
      })
    })
  })
})

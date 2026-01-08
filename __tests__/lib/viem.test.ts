import { chains, getChainClient } from '@/lib/viem'
import { describe, expect, it } from 'vitest'

describe('Viem Configuration', () => {
  describe('chains', () => {
    it('should have multiple chains configured', () => {
      expect(chains.length).toBeGreaterThan(4)
    })

    it('should have Ethereum mainnet', () => {
      const eth = chains.find((c) => c.id === 1)
      expect(eth).toBeDefined()
      expect(eth?.name).toBe('Ethereum')
    })

    it('should have Base', () => {
      const base = chains.find((c) => c.id === 8453)
      expect(base).toBeDefined()
      expect(base?.name).toBe('Base')
    })

    it('should have valid chain structure', () => {
      chains.forEach((chain) => {
        expect(chain).toHaveProperty('id')
        expect(chain).toHaveProperty('name')
        expect(chain).toHaveProperty('nativeCurrency')
        expect(chain.nativeCurrency).toHaveProperty('symbol')
        expect(chain.nativeCurrency).toHaveProperty('decimals')
      })
    })
  })

  describe('getChainClient', () => {
    it('should return client for Ethereum', () => {
      const client = getChainClient(1)
      expect(client).toBeDefined()
    })

    it('should return client for Base', () => {
      const client = getChainClient(8453)
      expect(client).toBeDefined()
    })

    it('should return undefined for unknown chain', () => {
      const client = getChainClient(99999999)
      expect(client).toBeUndefined()
    })
  })
})

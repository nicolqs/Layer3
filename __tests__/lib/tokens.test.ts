import { describe, it, expect } from 'vitest'
import { getTokenLogo, POPULAR_TOKENS, ERC20_ABI } from '@/lib/tokens'

describe('Token Utilities', () => {
  describe('getTokenLogo', () => {
    it('should return correct logo for ETH', () => {
      const logo = getTokenLogo('ETH')
      expect(logo).toContain('ethereum')
    })

    it('should return correct logo for USDC', () => {
      const logo = getTokenLogo('USDC')
      expect(logo).toContain('usd-coin')
    })

    it('should return correct logo for WBTC', () => {
      const logo = getTokenLogo('WBTC')
      expect(logo).toContain('wrapped-bitcoin')
    })

    it('should return default logo for unknown token', () => {
      const logo = getTokenLogo('UNKNOWN_TOKEN_XYZ')
      expect(logo).toContain('ethereum') // Default fallback
    })

    it('should handle all major tokens', () => {
      const tokens = ['ETH', 'USDC', 'USDT', 'DAI', 'WBTC', 'LINK', 'UNI', 'MATIC']
      tokens.forEach((symbol) => {
        const logo = getTokenLogo(symbol)
        expect(logo).toBeTruthy()
        expect(logo).toMatch(/^https:\/\//)
      })
    })
  })

  describe('POPULAR_TOKENS', () => {
    it('should have tokens for major chains', () => {
      expect(POPULAR_TOKENS[1]).toBeDefined() // Ethereum
      expect(POPULAR_TOKENS[8453]).toBeDefined() // Base
      expect(POPULAR_TOKENS[42161]).toBeDefined() // Arbitrum
    })

    it('should have valid token structure', () => {
      Object.values(POPULAR_TOKENS).forEach((tokens) => {
        tokens.forEach((token) => {
          expect(token).toHaveProperty('address')
          expect(token).toHaveProperty('symbol')
          expect(token).toHaveProperty('name')
          expect(token).toHaveProperty('decimals')
          expect(token.address).toMatch(/^0x[a-fA-F0-9]{40}$/)
          expect(typeof token.decimals).toBe('number')
        })
      })
    })
  })

  describe('ERC20_ABI', () => {
    it('should have balanceOf function', () => {
      const balanceOf = ERC20_ABI.find((item) => item.name === 'balanceOf')
      expect(balanceOf).toBeDefined()
      expect(balanceOf?.type).toBe('function')
    })
  })
})

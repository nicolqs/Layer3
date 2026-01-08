import { describe, it, expect } from 'vitest'
import {
  truncateAddress,
  formatTokenBalance,
  formatUsdValue,
} from '@/lib/utils'

describe('Utility Functions', () => {
  describe('truncateAddress', () => {
    it('should truncate Ethereum address', () => {
      const address = '0x1234567890123456789012345678901234567890'
      const result = truncateAddress(address)
      expect(result).toBe('0x1234...7890')
    })

    it('should handle custom lengths', () => {
      const address = '0x1234567890123456789012345678901234567890'
      const result = truncateAddress(address, 8, 6)
      expect(result).toBe('0x123456...567890')
    })

    it('should handle short addresses', () => {
      const address = '0x1234'
      const result = truncateAddress(address)
      expect(result).toBe('0x1234')
    })
  })

  describe('formatTokenBalance', () => {
    it('should format large balances', () => {
      expect(formatTokenBalance('1234.56789')).toBe('1,234.57')
    })

    it('should format small balances', () => {
      expect(formatTokenBalance('0.001234')).toBe('0.0012')
    })

    it('should handle zero', () => {
      expect(formatTokenBalance('0')).toBe('0.00')
    })

    it('should handle very small numbers', () => {
      expect(formatTokenBalance('0.00000123')).toBe('<0.0001')
    })

    it('should format millions', () => {
      expect(formatTokenBalance('1234567.89')).toBe('1,234,567.89')
    })
  })

  describe('formatUsdValue', () => {
    it('should format USD values', () => {
      expect(formatUsdValue(1234.56)).toBe('$1,234.56')
    })

    it('should handle zero', () => {
      expect(formatUsdValue(0)).toBe('$0.00')
    })

    it('should handle small values', () => {
      expect(formatUsdValue(0.001)).toBe('$0.00')
    })

    it('should handle millions', () => {
      expect(formatUsdValue(1234567.89)).toBe('$1,234,567.89')
    })
  })
})

import { describe, it, expect } from 'vitest'
import {
  decodeTransactionIntent,
  getIntentIcon,
  getIntentColor,
} from '@/lib/transactionIntent'
import type { MultiChainTransaction } from '@/lib/types'

describe('Transaction Intent Decoder', () => {
  const baseTx: MultiChainTransaction = {
    blockNumber: '12345',
    timeStamp: '1234567890',
    hash: '0xabc123',
    nonce: '1',
    blockHash: '0xdef456',
    transactionIndex: '0',
    from: '0x1234567890123456789012345678901234567890',
    to: '0x0987654321098765432109876543210987654321',
    value: '1000000000000000000',
    gas: '21000',
    gasPrice: '20000000000',
    isError: '0',
    txreceipt_status: '1',
    contractAddress: '',
    cumulativeGasUsed: '21000',
    gasUsed: '21000',
    confirmations: '100',
    methodId: '',
    functionName: '',
    input: '0x',
    chainId: 1,
    chainName: 'Ethereum',
  }

  describe('decodeTransactionIntent', () => {
    const userAddress = '0x1234567890123456789012345678901234567890'

    it('should detect simple ETH transfer', () => {
      const intent = decodeTransactionIntent(baseTx, userAddress)
      expect(intent.type).toBe('transfer')
      expect(intent.description).toContain('Sent')
    })

    it('should detect ERC20 transfer', () => {
      const tx = {
        ...baseTx,
        methodId: '0xa9059cbb',
        input: '0xa9059cbb0000000000000000000000001234567890123456789012345678901234567890000000000000000000000000000000000000000000000000de0b6b3a7640000',
      }
      const intent = decodeTransactionIntent(tx, userAddress)
      expect(intent.type).toBe('transfer')
      expect(intent.protocol?.name).toBe('Token Transfer')
    })

    it('should detect Uniswap swap', () => {
      const tx = {
        ...baseTx,
        methodId: '0x38ed1739',
        functionName: 'swapExactTokensForTokens',
        input: '0x38ed1739',
      }
      const intent = decodeTransactionIntent(tx, userAddress)
      expect(intent.type).toBe('swap')
      expect(intent.protocol?.name).toBe('Uniswap')
    })

    it('should detect NFT mint', () => {
      const tx = {
        ...baseTx,
        methodId: '0x40c10f19',
        functionName: 'mint',
        input: '0x40c10f19',
      }
      const intent = decodeTransactionIntent(tx, userAddress)
      expect(intent.type).toBe('mint')
      expect(intent.protocol?.name).toBe('NFT Mint')
    })

    it('should detect approval', () => {
      const tx = {
        ...baseTx,
        methodId: '0x095ea7b3',
        functionName: 'approve',
        input: '0x095ea7b3',
      }
      const intent = decodeTransactionIntent(tx, userAddress)
      expect(intent.type).toBe('approve')
      expect(intent.protocol?.name).toBe('Token Approval')
    })

    it('should handle unknown method gracefully', () => {
      const tx = {
        ...baseTx,
        methodId: '0xdeadbeef',
        functionName: 'unknownMethod',
        input: '0xdeadbeef',
      }
      const intent = decodeTransactionIntent(tx, userAddress)
      expect(intent.type).toBe('unknown')
      expect(intent.description).toContain('Contract')
    })

    it('should handle contract creation', () => {
      const tx = {
        ...baseTx,
        value: '0',
        to: '',
        input: '0x608060405234801561...',
        contractAddress: '0x1234567890123456789012345678901234567890',
      }
      const intent = decodeTransactionIntent(tx, userAddress)
      expect(intent).toHaveProperty('description')
      expect(intent).toHaveProperty('type')
    })

    it('should detect NFT safe transfer', () => {
      const tx = {
        ...baseTx,
        methodId: '0x42842e0e',
        functionName: 'safeTransferFrom',
        input: '0x42842e0e',
      }
      const intent = decodeTransactionIntent(tx, userAddress)
      expect(intent.type).toBe('nft-transfer')
      expect(intent.description).toContain('NFT')
    })

    it('should detect liquidity add', () => {
      const tx = {
        ...baseTx,
        methodId: '0xe8e33700',
        functionName: 'addLiquidity',
        input: '0xe8e33700',
      }
      const intent = decodeTransactionIntent(tx, userAddress)
      expect(intent.type).toBe('liquidity')
      expect(intent.description).toContain('Added')
    })

    it('should detect liquidity remove', () => {
      const tx = {
        ...baseTx,
        methodId: '0xbaa2abde',
        functionName: 'removeLiquidity',
        input: '0xbaa2abde',
      }
      const intent = decodeTransactionIntent(tx, userAddress)
      expect(intent.type).toBe('liquidity')
      expect(intent.description).toContain('Removed')
    })

    it('should detect deposit operations', () => {
      const tx = {
        ...baseTx,
        methodId: '0xe8eda9df',
        functionName: 'deposit',
        input: '0xe8eda9df',
      }
      const intent = decodeTransactionIntent(tx, userAddress)
      expect(intent.type).toBe('lend')
      expect(intent.description).toContain('Deposit')
    })

    it('should detect withdraw operations', () => {
      const tx = {
        ...baseTx,
        methodId: '0x69328dec',
        functionName: 'withdraw',
        input: '0x69328dec',
      }
      const intent = decodeTransactionIntent(tx, userAddress)
      expect(intent.type).toBe('lend')
      expect(intent.description).toContain('Withdrew')
    })

    it('should detect borrow operations', () => {
      const tx = {
        ...baseTx,
        methodId: '0xa415bcad',
        functionName: 'borrow',
        input: '0xa415bcad',
      }
      const intent = decodeTransactionIntent(tx, userAddress)
      expect(intent.type).toBe('borrow')
      expect(intent.description).toContain('Borrowed')
    })

    it('should detect repay operations', () => {
      const tx = {
        ...baseTx,
        methodId: '0x573ade81',
        functionName: 'repay',
        input: '0x573ade81',
      }
      const intent = decodeTransactionIntent(tx, userAddress)
      expect(intent.type).toBe('borrow')
      expect(intent.description).toContain('Repaid')
    })

    it('should detect staking operations', () => {
      const tx = {
        ...baseTx,
        methodId: '0xa694fc3a',
        functionName: 'stake',
        input: '0xa694fc3a',
      }
      const intent = decodeTransactionIntent(tx, userAddress)
      expect(intent.type).toBe('stake')
      expect(intent.description).toContain('Stake')
    })

    it('should handle unknown function signatures', () => {
      const tx = {
        ...baseTx,
        methodId: '0xabcdef12',
        functionName: 'customFunction',
        input: '0xabcdef12',
      }
      const intent = decodeTransactionIntent(tx, userAddress)
      expect(intent.type).toBe('unknown')
      expect(intent.description).toContain('Contract')
    })

    it('should handle generic contract interaction with recognized function', () => {
      // Add a test signature to FUNCTION_SIGNATURES that doesn't match any pattern
      const tx = {
        ...baseTx,
        methodId: '0xc6427474',
        functionName: 'Execute Transaction',
        input: '0xc6427474', // This is in FUNCTION_SIGNATURES as "Execute Transaction"
      }
      const intent = decodeTransactionIntent(tx, userAddress)
      // This should go through all the pattern checks and end up as generic contract-interaction
      expect(intent.type).toBe('contract-interaction')
      expect(intent.description).toBe('Execute Transaction')
    })
  })

  describe('getIntentIcon', () => {
    it('should return icons for all transaction types', () => {
      expect(getIntentIcon('transfer')).toBe('💸')
      expect(getIntentIcon('swap')).toBe('🔄')
      expect(getIntentIcon('mint')).toBe('🎨')
      expect(getIntentIcon('approve')).toBe('✅')
      expect(getIntentIcon('stake')).toBe('🔒')
      expect(getIntentIcon('lend')).toBe('🏦')
      expect(getIntentIcon('borrow')).toBe('💰')
      expect(getIntentIcon('liquidity')).toBe('💧')
      expect(getIntentIcon('nft-transfer')).toBe('🖼️')
      expect(getIntentIcon('contract-interaction')).toBe('⚙️')
      expect(getIntentIcon('unknown')).toBe('❓')
    })
  })

  describe('getIntentColor', () => {
    it('should return colors for all transaction types', () => {
      expect(getIntentColor('transfer')).toContain('text-')
      expect(getIntentColor('swap')).toContain('text-')
      expect(getIntentColor('mint')).toContain('text-')
      expect(getIntentColor('approve')).toContain('text-')
      expect(getIntentColor('stake')).toContain('text-')
      expect(getIntentColor('lend')).toContain('text-')
      expect(getIntentColor('borrow')).toContain('text-')
      expect(getIntentColor('liquidity')).toContain('text-')
      expect(getIntentColor('nft-transfer')).toContain('text-')
      expect(getIntentColor('contract-interaction')).toContain('text-')
      expect(getIntentColor('unknown')).toContain('text-')
    })
  })
})

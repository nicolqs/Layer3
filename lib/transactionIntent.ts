/**
 * Transaction Intent Decoder
 *
 * Decodes transaction input data to provide human-readable descriptions
 * Detects common patterns: swaps, mints, approvals, transfers, etc.
 */

import { MultiChainTransaction } from './types'
import { formatUnits } from 'viem'

/**
 * Common function signatures (4-byte selectors)
 * Source: https://www.4byte.directory/
 */
const FUNCTION_SIGNATURES: Record<string, string> = {
  // ERC20 Token Operations
  '0xa9059cbb': 'Transfer',
  '0x23b872dd': 'Transfer From',
  '0x095ea7b3': 'Approve',
  '0x39509351': 'Increase Allowance',
  '0xa457c2d7': 'Decrease Allowance',

  // Uniswap V2
  '0x38ed1739': 'Swap Exact Tokens for Tokens',
  '0x8803dbee': 'Swap Tokens for Exact Tokens',
  '0x7ff36ab5': 'Swap Exact ETH for Tokens',
  '0x18cbafe5': 'Swap Tokens for Exact ETH',
  '0x4a25d94a': 'Swap Tokens for ETH',
  '0xf305d719': 'Add Liquidity ETH',
  '0xe8e33700': 'Add Liquidity',
  '0x02751cec': 'Remove Liquidity ETH',
  '0xbaa2abde': 'Remove Liquidity',

  // Uniswap V3
  '0xc04b8d59': 'Exact Input Single',
  '0x414bf389': 'Exact Input',
  '0xdb3e2198': 'Exact Output Single',
  '0xf28c0498': 'Exact Output',
  '0x88316456': 'Mint Position',
  '0x0c49ccbe': 'Increase Liquidity',
  '0xfc6f7865': 'Collect',

  // NFT Operations (ERC721)
  '0x42842e0e': 'Safe Transfer From',
  '0xb88d4fde': 'Safe Transfer From (with data)',
  '0x6352211e': 'Owner Of',
  '0x40c10f19': 'Mint',
  '0xa22cb465': 'Set Approval For All',

  // NFT Operations (ERC1155)
  '0xf242432a': 'Safe Transfer From (ERC1155)',
  '0x2eb2c2d6': 'Safe Batch Transfer From',

  // DeFi Protocols
  // Aave
  '0xe8eda9df': 'Deposit',
  '0x69328dec': 'Withdraw',
  '0xa415bcad': 'Borrow',
  '0x573ade81': 'Repay',

  // Compound
  '0x1249c58b': 'Mint (Compound)',
  '0xdb006a75': 'Redeem',
  '0xf5e3c462': 'Redeem Underlying',

  // Staking
  '0xa694fc3a': 'Stake',
  '0x2e1a7d4d': 'Withdraw (Stake)',
  '0x3ccfd60b': 'Withdraw (Generic)',
  '0xe2bbb158': 'Deposit',

  // ENS
  '0x1896f70a': 'Set Resolver',
  '0xc47f0027': 'Commit',
  '0xacf1a841': 'Register',

  // Multi-sig
  '0xc6427474': 'Execute Transaction',
  '0x0d582f13': 'Add Owner',
  '0xf8dc5dd9': 'Remove Owner',

  // Generic
  '0x': 'Transfer',
  '0x00000000': 'Contract Deployment',
}

/**
 * Protocol detection based on common patterns
 */
const PROTOCOL_PATTERNS: Record<
  string,
  { name: string; color: string; icon: string }
> = {
  '0x38ed1739': {
    name: 'Uniswap',
    color: 'text-pink-500',
    icon: '🦄',
  },
  '0x7ff36ab5': {
    name: 'Uniswap',
    color: 'text-pink-500',
    icon: '🦄',
  },
  '0xc04b8d59': {
    name: 'Uniswap V3',
    color: 'text-pink-500',
    icon: '🦄',
  },
  '0xe8eda9df': { name: 'Aave', color: 'text-purple-500', icon: '👻' },
  '0x69328dec': { name: 'Aave', color: 'text-purple-500', icon: '👻' },
  '0x40c10f19': { name: 'NFT Mint', color: 'text-blue-500', icon: '🎨' },
  '0x42842e0e': { name: 'NFT Transfer', color: 'text-blue-500', icon: '🖼️' },
  '0xa9059cbb': { name: 'Token Transfer', color: 'text-green-500', icon: '💸' },
  '0x095ea7b3': { name: 'Token Approval', color: 'text-yellow-500', icon: '✅' },
}

/**
 * Transaction type categorization
 */
export type TransactionIntent =
  | 'transfer'
  | 'swap'
  | 'mint'
  | 'approve'
  | 'stake'
  | 'lend'
  | 'borrow'
  | 'liquidity'
  | 'nft-transfer'
  | 'contract-interaction'
  | 'unknown'

/**
 * Decoded transaction intent
 */
export interface DecodedIntent {
  type: TransactionIntent
  description: string
  protocol?: {
    name: string
    color: string
    icon: string
  }
  details?: {
    action: string
    amount?: string
    token?: string
  }
}

/**
 * Decode transaction intent from input data
 * @param tx - Transaction object
 * @param userAddress - User's address (to determine sent/received)
 * @returns Decoded intent with human-readable description
 */
export function decodeTransactionIntent(
  tx: MultiChainTransaction,
  userAddress: string,
): DecodedIntent {
  const isSent = tx.from.toLowerCase() === userAddress.toLowerCase()
  const signature = tx.input.slice(0, 10)
  const value = BigInt(tx.value)
  const hasValue = value > 0n

  // Check for known function signatures
  const functionName = FUNCTION_SIGNATURES[signature]
  const protocol = PROTOCOL_PATTERNS[signature]

  // Simple ETH transfer (no input data)
  if (signature === '0x' && hasValue) {
    const ethAmount = formatUnits(value, 18)
    return {
      type: 'transfer',
      description: isSent
        ? `Sent ${parseFloat(ethAmount).toFixed(4)} ETH`
        : `Received ${parseFloat(ethAmount).toFixed(4)} ETH`,
      details: {
        action: isSent ? 'Sent' : 'Received',
        amount: ethAmount,
        token: 'ETH',
      },
    }
  }

  // Decode based on function signature
  if (functionName) {
    // Swap operations
    if (functionName.toLowerCase().includes('swap')) {
      return {
        type: 'swap',
        description: `Swapped on ${protocol?.name || 'DEX'}`,
        protocol,
        details: {
          action: 'Swap',
        },
      }
    }

    // Mint operations
    if (
      functionName.toLowerCase().includes('mint') &&
      !functionName.includes('Compound')
    ) {
      return {
        type: 'mint',
        description: `Minted ${protocol?.name || 'NFT'}`,
        protocol,
        details: {
          action: 'Mint',
        },
      }
    }

    // Approve operations
    if (functionName.toLowerCase().includes('approve')) {
      return {
        type: 'approve',
        description: `Approved token spending`,
        protocol,
        details: {
          action: 'Approve',
        },
      }
    }

    // Transfer operations
    if (functionName.toLowerCase().includes('transfer')) {
      // NFT transfer
      if (signature === '0x42842e0e' || signature === '0xb88d4fde') {
        return {
          type: 'nft-transfer',
          description: isSent ? 'Transferred NFT' : 'Received NFT',
          protocol,
          details: {
            action: isSent ? 'Sent' : 'Received',
          },
        }
      }

      // Token transfer
      return {
        type: 'transfer',
        description: isSent ? 'Sent tokens' : 'Received tokens',
        protocol,
        details: {
          action: isSent ? 'Sent' : 'Received',
        },
      }
    }

    // Liquidity operations
    if (
      functionName.toLowerCase().includes('liquidity') ||
      functionName.toLowerCase().includes('add') ||
      functionName.toLowerCase().includes('remove')
    ) {
      const action = functionName.toLowerCase().includes('add')
        ? 'Added'
        : 'Removed'
      return {
        type: 'liquidity',
        description: `${action} liquidity on ${protocol?.name || 'DEX'}`,
        protocol,
        details: {
          action,
        },
      }
    }

    // Lending operations
    if (
      functionName.toLowerCase().includes('deposit') ||
      functionName.toLowerCase().includes('supply')
    ) {
      return {
        type: 'lend',
        description: `Deposited on ${protocol?.name || 'DeFi'}`,
        protocol,
        details: {
          action: 'Deposit',
        },
      }
    }

    if (functionName.toLowerCase().includes('withdraw')) {
      return {
        type: 'lend',
        description: `Withdrew from ${protocol?.name || 'DeFi'}`,
        protocol,
        details: {
          action: 'Withdraw',
        },
      }
    }

    if (functionName.toLowerCase().includes('borrow')) {
      return {
        type: 'borrow',
        description: `Borrowed on ${protocol?.name || 'Aave'}`,
        protocol,
        details: {
          action: 'Borrow',
        },
      }
    }

    if (functionName.toLowerCase().includes('repay')) {
      return {
        type: 'borrow',
        description: `Repaid loan on ${protocol?.name || 'Aave'}`,
        protocol,
        details: {
          action: 'Repay',
        },
      }
    }

    // Staking operations
    if (functionName.toLowerCase().includes('stake')) {
      return {
        type: 'stake',
        description: 'Staked tokens',
        protocol,
        details: {
          action: 'Stake',
        },
      }
    }

    // Generic function call
    return {
      type: 'contract-interaction',
      description: functionName,
      protocol,
      details: {
        action: functionName,
      },
    }
  }

  // Unknown / complex transaction
  return {
    type: 'unknown',
    description: isSent ? 'Contract Interaction' : 'Contract Call',
    details: {
      action: 'Contract Interaction',
    },
  }
}

/**
 * Get a color class for transaction type (for UI styling)
 */
export function getIntentColor(type: TransactionIntent): string {
  const colors: Record<TransactionIntent, string> = {
    transfer: 'text-blue-500',
    swap: 'text-pink-500',
    mint: 'text-purple-500',
    approve: 'text-yellow-500',
    stake: 'text-green-500',
    lend: 'text-indigo-500',
    borrow: 'text-orange-500',
    liquidity: 'text-teal-500',
    'nft-transfer': 'text-violet-500',
    'contract-interaction': 'text-gray-500',
    unknown: 'text-muted-foreground',
  }

  return colors[type] || colors.unknown
}

/**
 * Get an emoji icon for transaction type
 */
export function getIntentIcon(type: TransactionIntent): string {
  const icons: Record<TransactionIntent, string> = {
    transfer: '💸',
    swap: '🔄',
    mint: '🎨',
    approve: '✅',
    stake: '🔒',
    lend: '🏦',
    borrow: '💰',
    liquidity: '💧',
    'nft-transfer': '🖼️',
    'contract-interaction': '⚙️',
    unknown: '❓',
  }

  return icons[type] || icons.unknown
}


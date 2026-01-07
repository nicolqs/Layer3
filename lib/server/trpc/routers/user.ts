/**
 * User Router - All user-related endpoints
 *
 * Provides:
 * - Query: Get user details by address
 * - Query: Get user token balances across all chains
 * - Query: Get user transactions (single or multi-chain)
 * - Query: Get user NFTs
 */

import { ChainApiClientFactory } from '@/lib/chainApiClients'
import { getTokenPrice, getTokenPricesAsync } from '@/lib/priceService'
import { ERC20_ABI, POPULAR_TOKENS } from '@/lib/tokens'
import type {
  AlchemyNFT,
  Layer3User,
  MultiChainTransaction,
  TokenBalance,
  User,
} from '@/lib/types'
import { chains, getChainClient } from '@/lib/viem'
import { TRPCError } from '@trpc/server'
import { formatUnits, isAddress } from 'viem'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

/**
 * Fetch user from Layer3 leaderboard API
 */
async function fetchLayer3User(address: string): Promise<Layer3User | null> {
  try {
    const response = await fetch('https://layer3.xyz/api/assignment/users', {
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    const users: Layer3User[] = data.users || []

    return (
      users.find((u) => u.address.toLowerCase() === address.toLowerCase()) ||
      null
    )
  } catch (error) {
    console.error('Failed to fetch Layer3 user:', error)
    return null
  }
}

/**
 * Fetch transactions for a specific chain
 */
async function fetchChainTransactions(
  address: string,
  chainId: number,
  page: number = 1,
  limit: number = 100,
): Promise<MultiChainTransaction[]> {
  const client = ChainApiClientFactory.getClient(chainId)

  if (!client) {
    console.error(`Unsupported chainId: ${chainId}`)
    return []
  }

  try {
    const transactions = await client.fetchTransactions(address, page, limit)

    return transactions.map((tx) => ({
      ...tx,
      chainId: client.getChainId(),
      chainName: client.getChainName(),
    }))
  } catch (error) {
    console.error(
      `Error fetching transactions for ${client.getChainName()}:`,
      error,
    )
    return []
  }
}

/**
 * User Router
 */
export const userRouter = router({
  /**
   * Get user details by address
   */
  get: publicProcedure
    .input(
      z.object({
        address: z.string().refine(isAddress, 'Invalid Ethereum address'),
      }),
    )
    .query(async ({ input }) => {
      // Try to find user in Layer3 leaderboard
      const layer3User = await fetchLayer3User(input.address)

      if (!layer3User) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `User ${input.address} not found in Layer3 leaderboard`,
        })
      }

      const user: User = {
        address: layer3User.address,
        username: layer3User.username,
        avatar: layer3User.avatarCid
          ? `https://ipfs.io/ipfs/${layer3User.avatarCid}`
          : undefined,
        totalXP: layer3User.xp,
        rank: layer3User.rank,
        gmStreak: layer3User.gmStreak,
        nftCount: Math.floor(layer3User.xp / 1000), // Estimate
        joinedAt: new Date(
          Date.now() - layer3User.gmStreak * 86400000,
        ).toISOString(),
      }

      return user
    }),

  /**
   * Get user token balances across all chains
   */
  balances: publicProcedure
    .input(
      z.object({
        address: z.string().refine(isAddress, 'Invalid Ethereum address'),
      }),
    )
    .query(async ({ input }) => {
      const balances: TokenBalance[] = []

      // Pre-fetch prices for all common tokens (background cache refresh)
      const allSymbols = [
        ...chains.map((c) => c.nativeCurrency.symbol),
        ...Object.values(POPULAR_TOKENS)
          .flat()
          .map((t) => t.symbol),
      ]
      await getTokenPricesAsync(allSymbols).catch(() => {
        /* Ignore errors, will use cache/mock */
      })

      await Promise.all(
        chains.map(async (chain) => {
          try {
            const client = getChainClient(chain.id)

            const nativeBalance = await client.getBalance({
              address: input.address as `0x${string}`,
            })

            if (nativeBalance > BigInt(0)) {
              const balance = formatUnits(
                nativeBalance,
                chain.nativeCurrency.decimals,
              )
              const price = getTokenPrice(chain.nativeCurrency.symbol)
              const value = price ? parseFloat(balance) * price : undefined

              balances.push({
                symbol: chain.nativeCurrency.symbol,
                name: chain.nativeCurrency.name,
                balance,
                decimals: chain.nativeCurrency.decimals,
                chainId: chain.id,
                price,
                value,
              })
            }

            const tokens = POPULAR_TOKENS[chain.id] || []

            await Promise.all(
              tokens.map(async (token) => {
                try {
                  const balance = (await client.readContract({
                    address: token.address,
                    abi: ERC20_ABI,
                    functionName: 'balanceOf',
                    args: [input.address as `0x${string}`],
                  })) as bigint

                  if (balance > BigInt(0)) {
                    const balanceFormatted = formatUnits(
                      balance,
                      token.decimals,
                    )
                    const price = getTokenPrice(token.symbol)
                    const value = price
                      ? parseFloat(balanceFormatted) * price
                      : undefined

                    balances.push({
                      symbol: token.symbol,
                      name: token.name,
                      balance: balanceFormatted,
                      decimals: token.decimals,
                      chainId: chain.id,
                      price,
                      value,
                    })
                  }
                } catch (error) {
                  // Silently fail for individual tokens
                  console.error(
                    `Error fetching ${token.symbol} balance on chain ${chain.id}:`,
                    error,
                  )
                }
              }),
            )
          } catch (error) {
            console.error(
              `Error fetching balances for chain ${chain.id}:`,
              error,
            )
          }
        }),
      )

      return balances
    }),

  /**
   * Get user transactions (single chain or multi-chain)
   */
  transactions: publicProcedure
    .input(
      z.object({
        address: z.string().refine(isAddress, 'Invalid Ethereum address'),
        chainId: z.number().optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(10000).default(50),
      }),
    )
    .query(async ({ input }) => {
      let allTransactions: MultiChainTransaction[]

      if (input.chainId) {
        // Single chain request
        if (!ChainApiClientFactory.getClient(input.chainId)) {
          throw new Error(
            `Unsupported chain: ${input.chainId}. Supported chains: ${ChainApiClientFactory.getSupportedChainIds().join(', ')}`,
          )
        }

        allTransactions = await fetchChainTransactions(
          input.address,
          input.chainId,
          input.page,
          input.limit,
        )
      } else {
        // Multi-chain request - fetch all supported chains in parallel
        const supportedChains = ChainApiClientFactory.getSupportedChainIds()

        const results = await Promise.allSettled(
          supportedChains.map((chainId) =>
            fetchChainTransactions(input.address, chainId, 1, input.limit),
          ),
        )

        allTransactions = results
          .filter((result) => result.status === 'fulfilled')
          .flatMap(
            (result) =>
              (result as PromiseFulfilledResult<MultiChainTransaction[]>).value,
          )

        allTransactions.sort(
          (a, b) => parseInt(b.timeStamp) - parseInt(a.timeStamp),
        )

        // Apply limit after merging all chains
        allTransactions = allTransactions.slice(0, input.limit * 2)
      }

      return allTransactions
    }),

  /**
   * Get user NFTs from Alchemy
   */
  nfts: publicProcedure
    .input(
      z.object({
        address: z.string().refine(isAddress, 'Invalid Ethereum address'),
      }),
    )
    .query(async ({ input }) => {
      try {
        const alchemyUrl = `https://eth-mainnet.g.alchemy.com/nft/v3/${process.env.ALCHEMY_API_KEY}/getNFTsForOwner`
        const response = await fetch(
          `${alchemyUrl}?owner=${input.address}&withMetadata=true&pageSize=100`,
        )

        if (!response.ok) {
          console.error(
            'Alchemy API error:',
            response.status,
            response.statusText,
          )
          return []
        }

        const data = await response.json()
        const nfts: AlchemyNFT[] = data.ownedNfts || []

        return nfts
      } catch (error) {
        console.error('NFTs API error:', error)
        return []
      }
    }),
})

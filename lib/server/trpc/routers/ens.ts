/**
 * ENS Router
 *
 * Provides ENS resolution endpoints
 */

import { resolveAddress, batchResolveAddresses } from '@/lib/ens'
import { isAddress } from 'viem'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export const ensRouter = router({
  /**
   * Resolve a single address to ENS name
   */
  resolve: publicProcedure
    .input(
      z.object({
        address: z.string().refine(isAddress, 'Invalid Ethereum address'),
      }),
    )
    .query(async ({ input }) => {
      const ensName = await resolveAddress(input.address)
      return {
        address: input.address,
        ensName,
      }
    }),

  /**
   * Batch resolve multiple addresses to ENS names
   */
  batchResolve: publicProcedure
    .input(
      z.object({
        addresses: z.array(
          z.string().refine(isAddress, 'Invalid Ethereum address'),
        ),
      }),
    )
    .query(async ({ input }) => {
      const results = await batchResolveAddresses(input.addresses)

      // Convert Map to array of objects
      return Array.from(results.entries()).map(([address, ensName]) => ({
        address,
        ensName,
      }))
    }),
})


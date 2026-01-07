/**
 * tRPC Client Configuration
 *
 * Sets up the tRPC React Query client for type-safe API calls
 * Supports both regular queries/mutations and real-time subscriptions
 */

import type { AppRouter } from '@/lib/server/trpc/root'
import {
  httpBatchLink,
  splitLink,
  unstable_httpSubscriptionLink,
} from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import superjson from 'superjson'

/**
 * Create typed tRPC hooks
 */
export const trpc = createTRPCReact<AppRouter>()

/**
 * Get base URL for API calls
 */
function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // Browser: use relative path
    return ''
  }

  if (process.env.VERCEL_URL) {
    // Vercel: use deployment URL
    return `https://${process.env.VERCEL_URL}`
  }

  // Default: localhost
  return `http://localhost:${process.env.PORT ?? 3000}`
}

/**
 * Create tRPC client with subscription support
 * Uses splitLink to route subscriptions through httpSubscriptionLink
 * and regular queries/mutations through httpBatchLink
 */
export function createTRPCClient() {
  return trpc.createClient({
    links: [
      splitLink({
        // Use httpSubscriptionLink for subscriptions
        condition: (op) => op.type === 'subscription',
        true: unstable_httpSubscriptionLink({
          url: `${getBaseUrl()}/api/trpc`,
          transformer: superjson,
        }),
        // Use httpBatchLink for queries and mutations
        false: httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          transformer: superjson,
        }),
      }),
    ],
  })
}

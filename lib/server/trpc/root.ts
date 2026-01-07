/**
 * Root tRPC Router
 *
 * Combines all sub-routers into a single root router
 */

import { router } from './trpc'
import { ensRouter } from './routers/ens'
import { leaderboardRouter } from './routers/leaderboard'
import { userRouter } from './routers/user'

/**
 * Root application router
 * All API endpoints are now type-safe through tRPC
 */
export const appRouter = router({
  leaderboard: leaderboardRouter,
  user: userRouter,
  ens: ensRouter,
})

// Export type definition for client
export type AppRouter = typeof appRouter

/**
 * Leaderboard Router with Real-Time Updates
 *
 * Provides:
 * - Query: Get paginated leaderboard
 * - Query: Get user rank by address
 * - Subscription: Watch rank changes for a specific user
 * - Subscription: Watch leaderboard updates
 */

import type { Layer3User } from "@/lib/types";
import { observable } from "@trpc/server/observable";
import { isAddress } from "viem";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

/**
 * Fetch leaderboard data from Layer3 API
 */
async function fetchLeaderboardData(): Promise<Layer3User[]> {
  try {
    const response = await fetch("https://layer3.xyz/api/assignment/users", {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error(`Layer3 API error: ${response.status}`);
    }

    const data = await response.json();
    return data.users || [];
  } catch (error) {
    console.error("Failed to fetch leaderboard data:", error);
    return [];
  }
}

// In-memory store for tracking changes (in production, use Redis/DB)
const leaderboardState: {
  users: Layer3User[];
  lastUpdate: number;
  isInitialized: boolean;
} = {
  users: [],
  lastUpdate: Date.now(),
  isInitialized: false,
};

/**
 * Initialize leaderboard data on startup
 */
(async () => {
  const users = await fetchLeaderboardData();
  if (users.length > 0) {
    leaderboardState.users = users;
    leaderboardState.isInitialized = true;
    console.log(`✅ Leaderboard initialized with ${users.length} users`);
  }
})();

/**
 * Fetch fresh leaderboard data every 60 seconds
 * Tracks rank changes and XP updates in real-time
 */
setInterval(async () => {
  const previousUsers = new Map(
    leaderboardState.users.map((u) => [u.address.toLowerCase(), { ...u }]),
  );

  const freshUsers = await fetchLeaderboardData();

  if (freshUsers.length > 0) {
    leaderboardState.users = freshUsers;
    leaderboardState.lastUpdate = Date.now();

    // Log significant changes
    freshUsers.slice(0, 10).forEach((user) => {
      const prev = previousUsers.get(user.address.toLowerCase());
      if (prev && prev.rank !== user.rank) {
        console.log(
          `🔄 ${user.username || user.address.slice(0, 8)} moved from #${prev.rank} → #${user.rank}`,
        );
      }
    });
  }
}, 60000); // Update every 60 seconds

/**
 * Leaderboard Router
 */
export const leaderboardRouter = router({
  /**
   * Get paginated leaderboard
   */
  list: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(50),
        sortBy: z.enum(["xp", "gmStreak", "level"]).default("xp"),
      }),
    )
    .query(({ input }) => {
      const { page, limit, sortBy } = input;

      // Sort users
      const sortedUsers = [...leaderboardState.users].sort((a, b) => {
        switch (sortBy) {
          case "gmStreak":
            return b.gmStreak - a.gmStreak;
          case "level":
            return b.level - a.level;
          default:
            return b.xp - a.xp;
        }
      });

      // Paginate
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedUsers = sortedUsers.slice(start, end);

      return {
        users: paginatedUsers,
        pagination: {
          page,
          limit,
          total: leaderboardState.users.length,
          totalPages: Math.ceil(leaderboardState.users.length / limit),
        },
        lastUpdate: leaderboardState.lastUpdate,
      };
    }),

  /**
   * Get user rank by address
   */
  getUserRank: publicProcedure
    .input(
      z.object({
        address: z.string().refine(isAddress, "Invalid Ethereum address"),
      }),
    )
    .query(({ input }) => {
      const user = leaderboardState.users.find(
        (u) => u.address.toLowerCase() === input.address.toLowerCase(),
      );

      if (!user) {
        return null;
      }

      return {
        user,
        rank: user.rank,
        totalUsers: leaderboardState.users.length,
      };
    }),

  /**
   * Subscribe to rank changes for a specific user
   * Emits updates when the user's rank changes
   */
  watchUserRank: publicProcedure
    .input(
      z.object({
        address: z.string().refine(isAddress, "Invalid Ethereum address"),
      }),
    )
    .subscription(({ input }) => {
      return observable<{
        address: string;
        rank: number;
        previousRank: number;
        xp: number;
        movedUp: boolean;
        timestamp: number;
        isInitial: boolean;
      }>((emit) => {
        let previousRank = 0;
        let hasEmittedInitial = false;

        // Find initial rank and emit immediately
        const initialUser = leaderboardState.users.find(
          (u) => u.address.toLowerCase() === input.address.toLowerCase(),
        );

        if (initialUser) {
          previousRank = initialUser.rank;

          // Emit initial state immediately
          emit.next({
            address: initialUser.address,
            rank: initialUser.rank,
            previousRank: initialUser.rank, // Same as current for initial
            xp: initialUser.xp,
            movedUp: false, // No movement on initial load
            timestamp: Date.now(),
            isInitial: true,
          });

          hasEmittedInitial = true;
        }

        // Check for updates every 2 seconds
        const interval = setInterval(() => {
          const user = leaderboardState.users.find(
            (u) => u.address.toLowerCase() === input.address.toLowerCase(),
          );

          if (!user) {
            return;
          }

          // Emit initial state if we haven't yet (user just joined leaderboard)
          if (!hasEmittedInitial) {
            previousRank = user.rank;
            emit.next({
              address: user.address,
              rank: user.rank,
              previousRank: user.rank,
              xp: user.xp,
              movedUp: false,
              timestamp: Date.now(),
              isInitial: true,
            });
            hasEmittedInitial = true;
            return;
          }

          if (user.rank !== previousRank && previousRank > 0) {
            emit.next({
              address: user.address,
              rank: user.rank,
              previousRank: previousRank,
              xp: user.xp,
              movedUp: user.rank < previousRank, // Lower rank number = better position
              timestamp: Date.now(),
              isInitial: false,
            });

            previousRank = user.rank;
          }
        }, 2000);

        return () => {
          clearInterval(interval);
        };
      });
    }),

  /**
   * Subscribe to leaderboard updates
   * Emits the full leaderboard whenever it changes
   */
  watchLeaderboard: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
      }),
    )
    .subscription(({ input }) => {
      return observable<{
        users: Layer3User[];
        timestamp: number;
      }>((emit) => {
        let lastEmit = 0;

        emit.next({
          users: leaderboardState.users.slice(0, input.limit),
          timestamp: Date.now(),
        });

        const interval = setInterval(() => {
          if (leaderboardState.lastUpdate > lastEmit) {
            emit.next({
              users: leaderboardState.users.slice(0, input.limit),
              timestamp: Date.now(),
            });
            lastEmit = Date.now();
          }
        }, 5000);

        return () => {
          clearInterval(interval);
        };
      });
    }),
});

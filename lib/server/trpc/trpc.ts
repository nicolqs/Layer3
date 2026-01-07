/**
 * tRPC Server Configuration
 *
 * This initializes the tRPC instance with superjson for enhanced serialization
 * (supports Date, BigInt, Map, Set, etc.)
 */

import { initTRPC } from "@trpc/server";
import superjson from "superjson";

/**
 * Initialize tRPC with superjson transformer
 */
const t = initTRPC.create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

/**
 * Export reusable router and procedure helpers
 */
export const router = t.router;
export const publicProcedure = t.procedure;

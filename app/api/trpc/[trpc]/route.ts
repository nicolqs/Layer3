/**
 * tRPC API Route Handler
 *
 * Handles all tRPC requests at /api/trpc/*
 * Supports both regular HTTP requests and WebSocket subscriptions
 */

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/lib/server/trpc/root";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
  });

export { handler as GET, handler as POST };

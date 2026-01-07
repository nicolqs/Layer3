# Layer3 Leaderboard

Multi-chain analytics dashboard for Layer3. Tracks user activity, balances, and transactions across 45+ EVM chains with real-time updates.

## Setup

```bash
# Install
pnpm install

# Copy env file
cp .env.example .env.local

# Run
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

**Frontend:**

- Next.js 15 (App Router)
- TypeScript (strict)
- Tailwind + shadcn/ui
- React Query

**Backend:**

- tRPC (type-safe APIs)
- Server-Sent Events (real-time)
- Zod validation

**Blockchain:**

- Viem (45+ chains)
- Etherscan APIs
- Alchemy NFTs
- CoinGecko prices

## What's Implemented

**Core:**

- Real-time leaderboard with live rank updates
- User profiles with ENS resolution
- Multi-chain token balances (native + ERC20)
- Transaction history with smart intent decoding
- NFT gallery with chain badges
- Dark/light mode
- Fully responsive (mobile-first)

**Technical:**

- **ENS Resolution**: Address → name with 1hr caching
- **Intent Decoder**: Recognizes 100+ function signatures (swaps, mints, transfers, etc.)
- **Multi-chain Parallel Fetching**: `Promise.allSettled` for 45 chains simultaneously
- **Rate Limiting**: CoinGecko (max 1 req/min)
- **Real-time Subscriptions**: SSE for rank tracking + leaderboard updates
- **Searchable Dropdowns**: Chain selector with fuzzy search
- **Price Toggle**: Switch between native crypto and USD values

**Chain Support (45+):**

- Ethereum + L2s: Base, Optimism, Arbitrum, Scroll, Linea, Zora, etc.
- Major L1s: Polygon, Avalanche, BSC, Fantom, Gnosis, etc.
- zk/Advanced: zkSync, Polygon zkEVM, Taiko, etc.

## Key Choices & Trade-offs

**1. tRPC over REST**

- **Why**: Type safety without codegen, refactor-friendly
- **Trade-off**: Requires Next.js/meta-framework, steeper learning curve
- **Result**: Worth it. Bugs caught at compile time, not runtime.

**2. Multi-chain from Day 1**

- **Why**: Easier to build right than refactor later
- **Trade-off**: More complexity upfront
- **Result**: Factory pattern makes adding chains trivial (~10 lines)

**3. Server-Sent Events (SSE) over WebSockets**

- **Why**: Simpler, works on Vercel, auto-reconnects
- **Trade-off**: One-way only (fine for this use case)
- **Result**: 5-10min timeout on Vercel, reconnects automatically

**4. In-memory caching**

- **Why**: Fast, simple, no external dependencies
- **Trade-off**: Doesn't scale across instances
- **Result**: Fine for MVP. Use Redis for production.

**5. Promise.allSettled for multi-chain**

- **Why**: Show partial data if some chains fail
- **Trade-off**: Slightly more complex error handling
- **Result**: Better UX. Users see 44/45 chains instead of nothing.

## What I'd Do Next

**For Production:**

1. **Redis** - Shared cache across instances, distributed locks
2. **WebSockets** - Replace SSE for better real-time (no 5min timeout)
3. **Rate Limiting** - Per-user limits with Upstash
4. **Monitoring** - Sentry for errors, Axiom for logs
5. **CDN** - Cache static assets, optimize images

**For Scale (10K+ users):**

- Database for transactions (faster than API calls)
- Background jobs for data refresh
- GraphQL layer for flexible queries
- Indexer for custom analytics

**Features to Add:**

- **Wallet Connection**: WalletConnect, MetaMask, view your own data
- **Charts**: Portfolio value over time, XP progression (Recharts ready)
- **Advanced Filters**: Value ranges, protocol-specific, multi-chain select
- **Exports**: CSV/PDF reports for tax season
- **Quest Details**: Individual quest pages with requirements
- **ENS in Transactions**: Show names for from/to addresses (API ready, UI pending)

## License

MIT

# Layer3 User Leaderboard Web App

A modern, full-featured leaderboard and user analytics dashboard for the Layer3 ecosystem, built with Next.js 15 and powered by multi-chain blockchain data.

## Features

- **🏆 Live Leaderboard**: Real-time rankings with automatic updates and subscriptions
- **👤 User Profiles**: Detailed user pages with on-chain data
- **🔗 Multi-Chain Support**: Track activity across 45+ EVM chains
- **💰 Token Balances**: View native and ERC20 token holdings across all chains
- **📊 Transaction History**: Complete transaction timeline with multi-chain support
- **🖼️ NFT Gallery**: Display NFT collections with Alchemy integration
- **🌓 Dark Mode**: Elegant light/dark theme toggle (defaults to dark)
- **⚡ Real-time Updates**: tRPC subscriptions for live rank changes and leaderboard updates
- **🔒 Type Safety**: End-to-end TypeScript with tRPC

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **API Layer**: tRPC for type-safe, real-time APIs
- **Styling**: Tailwind CSS + shadcn/ui
- **Blockchain**: Viem for multi-chain interactions (45+ chains)
- **TypeScript**: Full end-to-end type safety
- **State Management**: React Query (TanStack Query)
- **Real-time**: tRPC subscriptions with Server-Sent Events
- **Notifications**: Sonner for toast notifications

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                External Services                     │
│  Layer3 API │ 45+ RPC Nodes │ Etherscan │ Alchemy  │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│              tRPC API Layer (/api/trpc)              │
│  ┌───────────────────┬────────────────────────┐     │
│  │  Leaderboard      │  User Router           │     │
│  │  - list           │  - get                 │     │
│  │  - getUserRank    │  - balances            │     │
│  │  - watchUserRank* │  - transactions        │     │
│  │  - watchLeaderboard* │  - nfts             │     │
│  └───────────────────┴────────────────────────┘     │
│           *Real-time subscriptions                   │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│          Frontend (Type-Safe tRPC Client)            │
│   Leaderboard Page │ User Detail Page                │
│   shadcn/ui Components │ Live Updates                │
│   Full TypeScript Auto-completion                    │
└─────────────────────────────────────────────────────┘
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (install with `npm install -g pnpm`)
- API keys for external services (optional for development)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Copy `.env.example` to `.env.local` and add your API keys (optional for dev):

```bash
cp .env.example .env.local
```

### Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
layer3/
├── app/
│   ├── api/
│   │   └── trpc/[trpc]/  # Single tRPC endpoint
│   ├── user/[address]/   # User detail pages
│   ├── layout.tsx        # Root layout with providers
│   ├── page.tsx          # Leaderboard page
│   └── providers.tsx     # tRPC + React Query providers
├── components/
│   ├── leaderboard/      # Leaderboard components
│   │   ├── LiveLeaderboardUpdates.tsx
│   │   └── ...
│   ├── user-detail/      # User detail components
│   │   ├── LiveRankTracker.tsx
│   │   └── ...
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── server/trpc/      # tRPC server
│   │   ├── routers/      # API routers
│   │   │   ├── leaderboard.ts
│   │   │   └── user.ts
│   │   ├── trpc.ts       # tRPC config
│   │   └── root.ts       # Root router
│   ├── client/
│   │   └── trpc.ts       # tRPC client
│   ├── viem.ts           # Viem clients for 45+ chains
│   ├── chains.ts         # Chain configurations
│   ├── chainApiClients.ts # Chain API clients
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## tRPC API

All API calls are type-safe through tRPC. No manual typing required!

### Leaderboard Router (`trpc.leaderboard.*`)

**Queries:**
- `list({ page, limit, sortBy })` - Get paginated leaderboard
- `getUserRank({ address })` - Get user's current rank

**Subscriptions (Real-time):**
- `watchUserRank({ address })` - Subscribe to user rank changes
- `watchLeaderboard({ limit })` - Subscribe to leaderboard updates

### User Router (`trpc.user.*`)

**Queries:**
- `get({ address })` - Get user profile with XP, rank, and stats
- `balances({ address })` - Get token balances across 45+ chains
- `transactions({ address, chainId?, page?, limit? })` - Get transaction history
- `nfts({ address })` - Get NFT collection from Alchemy

### Usage Example

```typescript
// Frontend - Full type safety!
const { data: leaderboard } = trpc.leaderboard.list.useQuery({
  page: 1,
  limit: 50,
  sortBy: 'xp',
});

// Real-time subscription
trpc.leaderboard.watchUserRank.useSubscription(
  { address: '0x...' },
  {
    onData: (data) => {
      toast.success(`Rank changed to #${data.rank}`);
    },
  }
);
```

## Supported Chains

**45+ EVM Chains** including:

**Ethereum & L2s (19):**
- Ethereum, Optimism, Arbitrum One, Arbitrum Nova, Base, Blast
- Linea, Zora, Scroll, Taiko, Mantle, Metis, Mode
- Redstone, Cyber, Fraxtal, Kroma, Lyra, Loot

**Major L1s (10):**
- BNB Chain, Polygon, Polygon zkEVM, Avalanche, Fantom
- Moonbeam, Moonriver, Cronos, Gnosis, Celo

**Advanced & zk (13):**
- zkSync Era, Aurora, Harmony, OKX Chain, Shibarium
- BitTorrent, Ethereum Classic, HECO, Palm, Rootstock
- Oasis Emerald, XDC

See `lib/chains.ts` for full list with chain IDs and configurations.

## Development Notes

- **Type Safety**: All API calls are type-safe through tRPC
- **Real-time Updates**: Subscriptions work out of the box
- **Mock Data**: Used by default for development
- **45+ Chains**: Pre-configured and ready to use
- **No Manual Typing**: tRPC infers types automatically

## What's Implemented

- ✅ tRPC with full type safety
- ✅ Real-time subscriptions for leaderboard & rank tracking
- ✅ 45+ chain support with logos and metadata
- ✅ Alchemy NFT integration
- ✅ Etherscan API integration (all chains)
- ✅ Multi-chain transaction aggregation
- ✅ ERC20 token balance tracking
- ✅ Dark/Light mode
- ✅ Mobile responsive design
- ✅ Toast notifications for rank changes

## Future Enhancements

- [ ] Real Layer3 API integration (currently using mock)
- [ ] WebSocket support for better real-time performance
- [ ] Portfolio value tracking over time
- [ ] Gas price tracker across chains
- [ ] Transaction simulator
- [ ] ENS/domain resolution (ENS, Lens, Farcaster)
- [ ] Wallet connection (WalletConnect, MetaMask)
- [ ] Charts and analytics (Recharts)
- [ ] Quest details page
- [ ] Advanced filters and search
- [ ] Export data functionality
- [ ] CSV/PDF reports

## Deploy on Vercel

Deploy with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/layer3-leaderboard)

## License

MIT

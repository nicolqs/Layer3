# Layer3 User Leaderboard Web App

A modern, full-featured leaderboard and user analytics dashboard for the Layer3 ecosystem, built with Next.js 15 and powered by multi-chain blockchain data.

## Features

- **Leaderboard**: Real-time rankings of top performers with XP, quests completed, and rank changes
- **User Profiles**: Detailed user pages with on-chain data
- **Multi-Chain Support**: Track activity across Ethereum, Polygon, Arbitrum, Optimism, and Base
- **Token Balances**: View native and ERC20 token holdings across all chains
- **Transaction History**: Complete transaction timeline with multi-chain support
- **NFT Gallery**: Display NFT collections from all supported chains
- **Dark Mode**: Elegant light/dark theme toggle (defaults to dark)
- **Real-time Data**: Uses React Query for efficient data fetching and caching

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Blockchain**: Viem for multi-chain interactions
- **TypeScript**: Full type safety
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Native fetch API

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                External Services                     │
│  Layer3 API │ RPC Nodes │ Etherscan │ Alchemy NFT  │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                  API Routes (Proxy)                  │
│   /api/leaderboard                                   │
│   /api/user/[address]                                │
│   /api/user/[address]/balances                       │
│   /api/user/[address]/transactions                   │
│   /api/user/[address]/nfts                           │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│              Frontend (Next.js App)                  │
│   Leaderboard Page │ User Detail Page                │
│   shadcn/ui Components                               │
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
│   ├── api/              # API routes
│   │   ├── leaderboard/  # Leaderboard endpoint
│   │   └── user/         # User-related endpoints
│   ├── user/             # User detail pages
│   ├── layout.tsx        # Root layout with providers
│   ├── page.tsx          # Leaderboard page
│   └── providers.tsx     # React Query provider
├── components/
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── viem.ts           # Viem clients for 5 chains
│   ├── fetcher.ts        # Fetch utility with error handling
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## API Endpoints

### Leaderboard
- `GET /api/leaderboard?limit=100&offset=0`
- Returns paginated leaderboard data

### User Data
- `GET /api/user/[address]`
- Returns user profile with XP, rank, and stats

### Balances
- `GET /api/user/[address]/balances`
- Returns token balances across all chains

### Transactions
- `GET /api/user/[address]/transactions?chainId=1&limit=20`
- Returns transaction history with optional chain filter

### NFTs
- `GET /api/user/[address]/nfts?chainId=1`
- Returns NFT collection with optional chain filter

## Supported Chains

- Ethereum (Chain ID: 1)
- Polygon (Chain ID: 137)
- Arbitrum (Chain ID: 42161)
- Optimism (Chain ID: 10)
- Base (Chain ID: 8453)

## Development Notes

- Mock data is used by default for development
- Replace API route implementations with actual Layer3 API calls
- Add Alchemy API integration for production NFT data
- Add Etherscan/Polygonscan/etc. API calls for transaction history
- Configure RPC endpoints in `lib/viem.ts` for production

## Future Enhancements

- [ ] Real Layer3 API integration
- [ ] Alchemy NFT API integration
- [ ] Etherscan API integration for all chains
- [ ] Charts and analytics (Recharts)
- [ ] ENS resolution
- [ ] Wallet connection
- [ ] Quest details page
- [ ] Filters and advanced search
- [ ] Export data functionality

## Deploy on Vercel

Deploy with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/layer3-leaderboard)

## License

MIT

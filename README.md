# Layer3 Leaderboard

Real-time multi-chain analytics dashboard for Layer3 users. Track balances, transactions, and NFTs across 45+ EVM chains.

## Quick Start

```bash
pnpm install
cp .env.example .env.local  # Add your API keys
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

- 🏆 **Live Leaderboard** - Real-time rank tracking with SSE
- 💰 **Multi-Chain Balances** - Native + ERC20 tokens across 45+ chains
- 📊 **Transaction History** - Smart intent decoder (swaps, mints, transfers)
- 🖼️ **NFT Gallery** - Cross-chain NFT display with metadata
- 🔍 **ENS Resolution** - Address → names everywhere
- 🌓 **Dark Mode** - Full theme support

## Tech Stack

**Frontend:** Next.js 15, TypeScript, Tailwind, shadcn/ui  
**Backend:** tRPC, React Query, Server-Sent Events  
**Blockchain:** Viem (45+ chains), Etherscan APIs, Alchemy NFTs

## Testing

```bash
pnpm test          # Watch mode
pnpm test:run      # CI mode
```

58 tests covering critical paths.

## Documentation

- **[PROJECT.md](PROJECT.md)** - Architecture, decisions, implementation details

## License

MIT

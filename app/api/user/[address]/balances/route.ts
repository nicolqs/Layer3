import { NextRequest, NextResponse } from 'next/server';
import { getChainClient, chains } from '@/lib/viem';
import { TokenBalance } from '@/lib/types';
import { formatEther } from 'viem';

const POPULAR_TOKENS: Record<number, Array<{ address: `0x${string}`; symbol: string; name: string; decimals: number }>> = {
  1: [ // Ethereum
    { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', symbol: 'USDC', name: 'USD Coin', decimals: 6 },
    { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT', name: 'Tether', decimals: 6 },
  ],
  137: [ // Polygon
    { address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', symbol: 'USDC', name: 'USD Coin', decimals: 6 },
  ],
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        { error: 'Invalid address' },
        { status: 400 }
      );
    }

    const balances: TokenBalance[] = [];

    // Fetch native balances for all chains
    await Promise.all(
      chains.map(async (chain) => {
        try {
          const client = getChainClient(chain.id);
          const balance = await client.getBalance({
            address: address as `0x${string}`,
          });

          if (balance > 0n) {
            balances.push({
              symbol: chain.nativeCurrency.symbol,
              name: chain.nativeCurrency.name,
              balance: formatEther(balance),
              decimals: chain.nativeCurrency.decimals,
              chainId: chain.id,
              logo: `/chains/${chain.id}.png`,
            });
          }
        } catch (error) {
          console.error(`Error fetching balance for chain ${chain.id}:`, error);
        }
      })
    );

    // TODO: Fetch ERC20 token balances using Alchemy or similar
    // For now, just return native balances

    return NextResponse.json(balances);
  } catch (error) {
    console.error('Balance API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch balances' },
      { status: 500 }
    );
  }
}


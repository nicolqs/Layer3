import { NextRequest, NextResponse } from 'next/server';
import { Transaction } from '@/lib/types';

const generateMockTransactions = (address: string, count: number = 20): Transaction[] => {
  const seed = parseInt(address.slice(2, 10), 16);
  return Array.from({ length: count }, (_, i) => ({
    hash: `0x${Math.random().toString(16).slice(2, 66).padStart(64, '0')}`,
    from: i % 2 === 0 ? address : `0x${Math.random().toString(16).slice(2, 42).padStart(40, '0')}`,
    to: i % 2 === 0 ? `0x${Math.random().toString(16).slice(2, 42).padStart(40, '0')}` : address,
    value: (Math.random() * 10).toFixed(6),
    timestamp: Date.now() - (i * 86400000 * (seed % 30 + 1)),
    chainId: [1, 137, 42161, 10, 8453][i % 5],
    status: Math.random() > 0.05 ? 'success' : 'failed',
  })).sort((a, b) => b.timestamp - a.timestamp);
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const searchParams = request.nextUrl.searchParams;
    const chainId = searchParams.get('chainId');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        { error: 'Invalid address' },
        { status: 400 }
      );
    }

    // TODO: Replace with actual Etherscan API calls for each chain
    // Use Etherscan API for Ethereum
    // Use Polygonscan API for Polygon
    // Use Arbiscan API for Arbitrum
    // etc.

    let transactions = generateMockTransactions(address, limit);

    if (chainId) {
      transactions = transactions.filter(tx => tx.chainId === parseInt(chainId));
    }

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Transactions API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}


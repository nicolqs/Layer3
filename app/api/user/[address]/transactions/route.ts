import { EtherscanTransaction } from '@/lib/types';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
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

    // TODO: Replace with actual Etherscan API calls for each chain
    // Use Etherscan API for Ethereum
    // Use Polygonscan API for Polygon
    // Use Arbiscan API for Arbitrum
    // etc.

    // Use Etherscan V2 API (requires chainid parameter)
    const etherscanUrl = `https://api.etherscan.io/v2/api?chainid=1&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${process.env.ETHERSCAN_API_KEY}`;
    const response = await fetch(etherscanUrl);
    const data = await response.json();

    // Check if Etherscan returned an error
    if (data.status === "0" || !Array.isArray(data.result)) {
      console.error('Etherscan API error:', data.message, data.result);
      return NextResponse.json([]);
    }

    const transactions: EtherscanTransaction[] = data.result;

    // Note: chainId filter doesn't apply here as we're only fetching from Ethereum mainnet (chainid=1)
    // If you need multi-chain support, you'd need separate API calls per chain

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Transactions API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}


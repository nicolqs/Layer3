import { EtherscanTransaction } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';
import { isAddress } from 'viem';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const searchParams = request.nextUrl.searchParams;
    
    // Get query parameters for pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');

    if (!isAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid address' },
        { status: 400 }
      );
    }

    // Calculate offset for pagination
    const startBlock = 0;
    const endBlock = 99999999;
    
    // Use Etherscan V2 API (requires chainid parameter)
    // Etherscan API supports pagination: page (page number) & offset (records per page)
    const etherscanUrl = `https://api.etherscan.io/v2/api?chainid=1&module=account&action=txlist&address=${address}&startblock=${startBlock}&endblock=${endBlock}&page=${page}&offset=${limit}&sort=desc&apikey=${process.env.ETHERSCAN_API_KEY}`;
    
    const response = await fetch(etherscanUrl);
    const data = await response.json();

    // Check if Etherscan returned an error
    if (data.status === "0" || !Array.isArray(data.result)) {
      console.error('Etherscan API error:', data.message, data.result);
      return NextResponse.json([]);
    }

    const transactions: EtherscanTransaction[] = data.result;

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Transactions API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}


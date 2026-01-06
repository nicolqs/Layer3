import { ChainApiClientFactory } from '@/lib/chainApiClients';
import { MultiChainTransaction } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';
import { isAddress } from 'viem';

/**
 * Fetch transactions for a specific chain
 */
async function fetchChainTransactions(
  address: string,
  chainId: number,
  page: number = 1,
  limit: number = 100
): Promise<MultiChainTransaction[]> {
  // Get the appropriate API client for this chain
  const client = ChainApiClientFactory.getClient(chainId);
  
  if (!client) {
    console.error(`Unsupported chainId: ${chainId}`);
    return [];
  }

  try {
    // Fetch transactions using the chain-specific client
    const transactions = await client.fetchTransactions(address, page, limit);

    // Add chain metadata to each transaction
    return transactions.map((tx) => ({
      ...tx,
      chainId: client.getChainId(),
      chainName: client.getChainName(),
    }));
  } catch (error) {
    console.error(
      `Error fetching transactions for ${client.getChainName()}:`,
      error
    );
    return [];
  }
}

/**
 * API Route Handler
 * GET /api/user/[address]/transactions?chainId=1&page=1&limit=50
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const chainIdParam = searchParams.get('chainId');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    // Validate address
    if (!isAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid Ethereum address' },
        { status: 400 }
      );
    }

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 10000) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    let allTransactions: MultiChainTransaction[];

    if (chainIdParam) {
      // Single chain request
      const chainId = parseInt(chainIdParam, 10);
      
      if (!ChainApiClientFactory.getClient(chainId)) {
        return NextResponse.json(
          { 
            error: 'Unsupported chain',
            supportedChains: ChainApiClientFactory.getSupportedChainIds()
          },
          { status: 400 }
        );
      }

      allTransactions = await fetchChainTransactions(
        address,
        chainId,
        page,
        limit
      );
    } else {
      // Multi-chain request - fetch all supported chains in parallel
      const supportedChains = ChainApiClientFactory.getSupportedChainIds();
      
      const results = await Promise.allSettled(
        supportedChains.map((chainId) =>
          fetchChainTransactions(address, chainId, 1, limit)
        )
      );

      // Extract successful results
      allTransactions = results
        .filter((result) => result.status === 'fulfilled')
        .flatMap((result) => (result as PromiseFulfilledResult<MultiChainTransaction[]>).value);

      // Sort by timestamp (newest first)
      allTransactions.sort(
        (a, b) => parseInt(b.timeStamp) - parseInt(a.timeStamp)
      );

      // Apply limit after merging all chains
      allTransactions = allTransactions.slice(0, limit * 2);
    }

    return NextResponse.json(allTransactions);
  } catch (error) {
    console.error('Transactions API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

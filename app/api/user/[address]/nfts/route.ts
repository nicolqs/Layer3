import { AlchemyNFT } from '@/lib/types';
import { NextResponse } from 'next/server';
import { isAddress } from 'viem';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    if (!isAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid address' },
        { status: 400 }
      );
    }

    // Fetch NFTs from Alchemy API
    const alchemyUrl = `https://eth-mainnet.g.alchemy.com/nft/v3/${process.env.ALCHEMY_API_KEY}/getNFTsForOwner`;
    const response = await fetch(`${alchemyUrl}?owner=${address}&withMetadata=true&pageSize=100`);
    
    if (!response.ok) {
      console.error('Alchemy API error:', response.status, response.statusText);
      return NextResponse.json([]);
    }

    const data = await response.json();
    const nfts: AlchemyNFT[] = data.ownedNfts || [];

    return NextResponse.json(nfts);
  } catch (error) {
    console.error('NFTs API error:', error);
    return NextResponse.json([]);
  }
}


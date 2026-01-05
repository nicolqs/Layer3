import { AlchemyNFT } from '@/lib/types';
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


import { NextRequest, NextResponse } from 'next/server';
import { NFT } from '@/lib/types';

const generateMockNFTs = (address: string, count: number = 12): NFT[] => {
  const seed = parseInt(address.slice(2, 10), 16);
  const collections = ['Bored Apes', 'CryptoPunks', 'Azuki', 'Doodles', 'Pudgy Penguins'];
  
  return Array.from({ length: count }, (_, i) => ({
    tokenId: `${(seed + i) % 10000}`,
    name: `${collections[i % collections.length]} #${(seed + i) % 10000}`,
    description: `A unique NFT from the ${collections[i % collections.length]} collection`,
    image: `https://api.dicebear.com/7.x/shapes/svg?seed=${address}-${i}`,
    collection: collections[i % collections.length],
    chainId: [1, 137, 42161, 10, 8453][i % 5],
    contractAddress: `0x${Math.random().toString(16).slice(2, 42).padStart(40, '0')}`,
  }));
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const searchParams = request.nextUrl.searchParams;
    const chainId = searchParams.get('chainId');

    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        { error: 'Invalid address' },
        { status: 400 }
      );
    }

    // TODO: Replace with actual Alchemy NFT API calls
    // const alchemyUrl = `https://eth-mainnet.g.alchemy.com/nft/v3/${process.env.ALCHEMY_API_KEY}/getNFTsForOwner`;
    // const response = await fetch(`${alchemyUrl}?owner=${address}`);

    let nfts = generateMockNFTs(address);

    if (chainId) {
      nfts = nfts.filter(nft => nft.chainId === parseInt(chainId));
    }

    return NextResponse.json(nfts);
  } catch (error) {
    console.error('NFTs API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NFTs' },
      { status: 500 }
    );
  }
}


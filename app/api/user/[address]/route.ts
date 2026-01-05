import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/types';

const generateMockUser = (address: string): User => {
  const seed = parseInt(address.slice(2, 10), 16);
  return {
    address,
    ensName: seed % 3 === 0 ? `user${seed % 1000}.eth` : undefined,
    avatar: seed % 2 === 0 ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${address}` : undefined,
    totalXP: Math.floor(seed % 100000) + 5000,
    rank: Math.floor(seed % 1000) + 1,
    questsCompleted: Math.floor(seed % 200),
    nftCount: Math.floor(seed % 50),
    joinedAt: new Date(Date.now() - seed % 31536000000).toISOString(),
  };
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

    // TODO: Replace with actual Layer3 API call
    // const response = await fetch(`https://api.layer3.xyz/users/${address}`, {
    //   headers: {
    //     'Authorization': `Bearer ${process.env.LAYER3_API_KEY}`,
    //   },
    // });

    const user = generateMockUser(address);

    return NextResponse.json(user);
  } catch (error) {
    console.error('User API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}


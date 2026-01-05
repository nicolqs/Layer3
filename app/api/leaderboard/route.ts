import { NextRequest, NextResponse } from 'next/server';
import { LeaderboardEntry } from '@/lib/types';

// Mock data - replace with actual Layer3 API calls
const generateMockLeaderboard = (limit: number = 100): LeaderboardEntry[] => {
  return Array.from({ length: limit }, (_, i) => ({
    rank: i + 1,
    address: `0x${Math.random().toString(16).slice(2, 42).padStart(40, '0')}`,
    ensName: i < 20 ? `user${i + 1}.eth` : undefined,
    avatar: i < 10 ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}` : undefined,
    xp: Math.floor(Math.random() * 100000) + (limit - i) * 1000,
    questsCompleted: Math.floor(Math.random() * 150),
    change: Math.floor(Math.random() * 21) - 10,
  })).sort((a, b) => b.xp - a.xp).map((item, i) => ({ ...item, rank: i + 1 }));
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // TODO: Replace with actual Layer3 API call
    // const response = await fetch(`https://api.layer3.xyz/leaderboard?limit=${limit}&offset=${offset}`, {
    //   headers: {
    //     'Authorization': `Bearer ${process.env.LAYER3_API_KEY}`,
    //   },
    // });

    const allData = generateMockLeaderboard(200);
    const data = allData.slice(offset, offset + limit);

    return NextResponse.json({
      data,
      total: allData.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}


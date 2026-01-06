import { mockLayer3Users } from "@/lib/mockData";
import { User } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { isAddress } from "viem";

const generateMockUser = (address: string): User => {
  const seed = parseInt(address.slice(2, 10), 16);
  return {
    address,
    username: seed % 3 === 0 ? `user${seed % 1000}.eth` : undefined,
    avatar:
      seed % 2 === 0
        ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${address}`
        : undefined,
    totalXP: Math.floor(seed % 100000) + 5000,
    rank: Math.floor(seed % 1000) + 1,
    gmStreak: Math.floor(seed % 200),
    nftCount: Math.floor(seed % 50),
    joinedAt: new Date(Date.now() - (seed % 31536000000)).toISOString(),
  };
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    if (!isAddress(address)) {
      return NextResponse.json({ error: "Invalid address" }, { status: 400 });
    }

    // Try to find user in mock data first
    const mockUser = mockLayer3Users.find(
      (u) => u.address.toLowerCase() === address.toLowerCase()
    );

    if (mockUser) {
      // Map Layer3User to User type
      const user: User = {
        address: mockUser.address,
        username: mockUser.username,
        avatar: mockUser.avatarCid
          ? `https://ipfs.io/ipfs/${mockUser.avatarCid}`
          : undefined,
        totalXP: mockUser.xp,
        rank: mockUser.rank,
        gmStreak: mockUser.gmStreak,
        nftCount: Math.floor(mockUser.xp / 1000), // Estimate
        joinedAt: new Date(
          Date.now() - mockUser.gmStreak * 86400000
        ).toISOString(),
      };
      return NextResponse.json(user);
    }

    // Fallback to generated mock user if not in leaderboard
    const user = generateMockUser(address);

    return NextResponse.json(user);
  } catch (error) {
    console.error("User API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}

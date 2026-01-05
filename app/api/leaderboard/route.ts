import { mockLayer3Users } from '@/lib/mockData';
import { NextResponse } from 'next/server';

// Toggle this to use mock data for development
const USE_MOCK = true;

export async function GET() {
  try {
    // Return mock data if USE_MOCK is true
    if (USE_MOCK) {
      return NextResponse.json(mockLayer3Users);
    }

    // Fetch from real Layer3 API
    const response = await fetch('https://layer3.xyz/api/assignment/users');

    if (!response.ok) {
      throw new Error(`Layer3 API error: ${response.status}`);
    }

    const data = await response.json();

    // Extract users array from the response object
    const users = data.users || [];
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}


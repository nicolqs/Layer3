'use client';

import { LeaderboardHeader } from '@/components/leaderboard/LeaderboardHeader';
import { LeaderboardStats } from '@/components/leaderboard/LeaderboardStats';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';
import { fetcher } from '@/lib/fetcher';
import { Layer3User } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export default function LeaderboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => fetcher<Layer3User[]>('/api/leaderboard'),
  });

  const leaderboard = Array.isArray(data) ? data : [];

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <LeaderboardHeader />
        <LeaderboardStats users={leaderboard} />
        <LeaderboardTable users={leaderboard} isLoading={isLoading} />
      </div>
    </div>
  );
}

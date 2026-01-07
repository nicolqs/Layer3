"use client";

import { Header } from "@/components/Header";
import { LeaderboardStats } from "@/components/leaderboard/LeaderboardStats";
import { LeaderboardSubHeader } from "@/components/leaderboard/LeaderboardSubHeader";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { LiveLeaderboardUpdates } from "@/components/leaderboard/LiveLeaderboardUpdates";
import { trpc } from "@/lib/client/trpc";

export default function LeaderboardPage() {
  // Use tRPC for type-safe API calls
  const { data, isLoading } = trpc.leaderboard.list.useQuery({
    page: 1,
    limit: 50,
    sortBy: "xp",
  });

  const leaderboard = data?.users ?? [];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background p-4 sm:p-8 md:pb-20">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          <LeaderboardSubHeader />
          <LeaderboardTable users={leaderboard} isLoading={isLoading} />
          <LeaderboardStats users={leaderboard} />
        </div>
      </div>
      <LiveLeaderboardUpdates />
    </>
  );
}

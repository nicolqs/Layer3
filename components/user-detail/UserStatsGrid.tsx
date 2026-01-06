import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/lib/types';
import { Activity, Award, Trophy, Wallet } from 'lucide-react';

interface UserStatsGridProps {
  user: User;
  transactionCount: number;
}

export function UserStatsGrid({ user, transactionCount }: UserStatsGridProps) {
  return (
    <div className="grid gap-2.5 sm:gap-3 grid-cols-2 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2.5 sm:py-3 px-3 sm:px-6">
          <CardTitle className="text-xs sm:text-sm font-medium">Total XP</CardTitle>
          <div className="rounded-lg bg-gradient-to-br from-yellow-500/20 to-amber-500/20 p-1 sm:p-1.5 shadow-lg shadow-yellow-500/20 ring-1 ring-yellow-500/30">
            <Trophy className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-yellow-500" />
          </div>
        </CardHeader>
        <CardContent className="pb-2.5 sm:pb-3 pt-0 px-3 sm:px-6">
          <div className="text-lg sm:text-xl font-bold">{user.totalXP.toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2.5 sm:py-3 px-3 sm:px-6">
          <CardTitle className="text-xs sm:text-sm font-medium">Quests</CardTitle>
          <div className="rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-1 sm:p-1.5 shadow-lg shadow-blue-500/20 ring-1 ring-blue-500/30">
            <Award className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent className="pb-2.5 sm:pb-3 pt-0 px-3 sm:px-6">
          <div className="text-lg sm:text-xl font-bold">{user.questsCompleted}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2.5 sm:py-3 px-3 sm:px-6">
          <CardTitle className="text-xs sm:text-sm font-medium">NFTs</CardTitle>
          <div className="rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-1 sm:p-1.5 shadow-lg shadow-green-500/20 ring-1 ring-green-500/30">
            <Wallet className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-500" />
          </div>
        </CardHeader>
        <CardContent className="pb-2.5 sm:pb-3 pt-0 px-3 sm:px-6">
          <div className="text-lg sm:text-xl font-bold">{user.nftCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2.5 sm:py-3 px-3 sm:px-6">
          <CardTitle className="text-xs sm:text-sm font-medium">Transactions</CardTitle>
          <div className="rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 p-1 sm:p-1.5 shadow-lg shadow-orange-500/20 ring-1 ring-orange-500/30">
            <Activity className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-orange-500" />
          </div>
        </CardHeader>
        <CardContent className="pb-2.5 sm:pb-3 pt-0 px-3 sm:px-6">
          <div className="text-lg sm:text-xl font-bold">{transactionCount}</div>
        </CardContent>
      </Card>
    </div>
  );
}


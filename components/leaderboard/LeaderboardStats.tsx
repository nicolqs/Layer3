import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layer3User } from "@/lib/types";
import { TrendingUp, Users, Zap } from "lucide-react";

interface LeaderboardStatsProps {
  users: Layer3User[];
}

export function LeaderboardStats({ users }: LeaderboardStatsProps) {
  const totalUsers = users.length;
  const totalXP = users.reduce((acc, entry) => acc + entry.xp, 0);
  const avgLevel =
    users.length > 0
      ? Math.round(
          users.reduce((acc, entry) => acc + entry.level, 0) / users.length,
        )
      : 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Total Users Card */}
      <Card className="relative overflow-hidden border-blue-500/20 bg-gradient-to-br from-blue-500/5 via-background to-background">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Users
          </CardTitle>
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 shadow-lg shadow-blue-500/20">
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="text-2xl font-bold bg-gradient-to-br from-blue-600 to-blue-400 bg-clip-text text-transparent">
            {totalUsers.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Active participants
          </p>
        </CardContent>
      </Card>

      {/* Total XP Card */}
      <Card className="relative overflow-hidden border-purple-500/20 bg-gradient-to-br from-purple-500/5 via-background to-background">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total XP
          </CardTitle>
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 shadow-lg shadow-purple-500/20">
            <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="text-2xl font-bold bg-gradient-to-br from-purple-600 to-purple-400 bg-clip-text text-transparent">
            {totalXP.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Experience earned
          </p>
        </CardContent>
      </Card>

      {/* Avg Level Card */}
      <Card className="relative overflow-hidden border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-background to-background">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Avg Level
          </CardTitle>
          <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 shadow-lg shadow-emerald-500/20">
            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="text-2xl font-bold bg-gradient-to-br from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
            {avgLevel}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Average progression
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

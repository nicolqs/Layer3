import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layer3User } from '@/lib/types';

interface LeaderboardStatsProps {
  users: Layer3User[];
}

export function LeaderboardStats({ users }: LeaderboardStatsProps) {
  const totalUsers = users.length;
  const totalXP = users.reduce((acc, entry) => acc + entry.xp, 0);
  const avgLevel = users.length > 0 
    ? Math.round(users.reduce((acc, entry) => acc + entry.level, 0) / users.length) 
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total XP</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalXP.toLocaleString()}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Level</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgLevel}</div>
        </CardContent>
      </Card>
    </div>
  );
}


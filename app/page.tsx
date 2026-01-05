'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetcher } from '@/lib/fetcher';
import { Layer3User } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { Search, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function LeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => fetcher<Layer3User[]>('/api/leaderboard'),
  });

  const leaderboard = Array.isArray(data) ? data : [];
  const filteredLeaderboard = leaderboard.filter((entry) =>
    entry.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Trophy className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Trophy className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-semibold text-muted-foreground">#{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Layer3 Leaderboard</h1>
            <p className="text-muted-foreground">
              Top performers in the Layer3 ecosystem
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leaderboard.length.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total XP</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {leaderboard.reduce((acc, entry) => acc + entry.xp, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {leaderboard.length > 0 ? Math.round(leaderboard.reduce((acc, entry) => acc + entry.level, 0) / leaderboard.length) : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard Table */}
        <Card>
          <CardHeader>
            <CardTitle>Rankings</CardTitle>
            <CardDescription>
              Track the top performers and their progress
            </CardDescription>
            <div className="relative pt-4">
              <Search className="absolute left-3 top-7 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by address or ENS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="text-right">XP</TableHead>
                    <TableHead className="text-right">Level</TableHead>
                    <TableHead className="text-right">GM Streak</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeaderboard.map((entry) => (
                    <TableRow key={entry.address} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center justify-center">
                          {getRankBadge(entry.rank)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link href={`/user/${entry.address}`} className="flex items-center gap-3 hover:underline">
                          <Avatar>
                            <AvatarImage src={entry.avatarCid ? `https://ipfs.io/ipfs/${entry.avatarCid}` : undefined} />
                            <AvatarFallback>
                              {entry.username?.[0]?.toUpperCase() || entry.address.slice(2, 4).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {entry.username || `${entry.address.slice(0, 6)}...${entry.address.slice(-4)}`}
                            </div>
                            {entry.username && (
                              <div className="text-xs text-muted-foreground">
                                {entry.address.slice(0, 6)}...{entry.address.slice(-4)}
                              </div>
                            )}
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">{entry.xp.toLocaleString()}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline">Level {entry.level}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">{entry.gmStreak} days</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

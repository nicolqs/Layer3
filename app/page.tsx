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
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <img src="/layer3-logo.svg" alt="Layer3" className="h-6 sm:h-8 w-auto dark:invert-0 invert flex-shrink-0" />
            <div className="space-y-0.5 sm:space-y-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Leaderboard
              </h1>
              <p className="text-xs sm:text-sm bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-medium hidden sm:block">
                Top performers in the Layer3 ecosystem
              </p>
              <p className="text-xs bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-medium sm:hidden">
                Top performers
              </p>
            </div>
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
          <CardHeader className="space-y-3 sm:space-y-4">
            <div>
              <CardTitle className="text-lg sm:text-xl">Rankings</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Track the top performers and their progress
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by address or ENS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-sm sm:text-base"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 sm:w-16 text-xs sm:text-sm">Rank</TableHead>
                      <TableHead className="text-xs sm:text-sm">User</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm">XP</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm hidden sm:table-cell">Level</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm hidden md:table-cell">GM Streak</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeaderboard.map((entry) => (
                      <TableRow key={entry.address} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="py-3 sm:py-4">
                          <div className="flex items-center justify-center">
                            {getRankBadge(entry.rank)}
                          </div>
                        </TableCell>
                        <TableCell className="py-3 sm:py-4">
                          <Link href={`/user/${entry.address}`} className="flex items-center gap-2 sm:gap-3 hover:underline">
                            <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                              <AvatarImage src={entry.avatarCid ? `https://ipfs.io/ipfs/${entry.avatarCid}` : undefined} />
                              <AvatarFallback className="text-xs sm:text-sm">
                                {entry.username?.[0]?.toUpperCase() || entry.address.slice(2, 4).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="font-medium text-sm sm:text-base truncate">
                                {entry.username || `${entry.address.slice(0, 6)}...${entry.address.slice(-4)}`}
                              </div>
                              {entry.username && (
                                <div className="text-xs text-muted-foreground hidden sm:block">
                                  {entry.address.slice(0, 6)}...{entry.address.slice(-4)}
                                </div>
                              )}
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className="text-right py-3 sm:py-4">
                          <Badge variant="secondary" className="text-xs sm:text-sm">{entry.xp.toLocaleString()}</Badge>
                        </TableCell>
                        <TableCell className="text-right py-3 sm:py-4 hidden sm:table-cell">
                          <Badge variant="outline" className="text-xs sm:text-sm">Level {entry.level}</Badge>
                        </TableCell>
                        <TableCell className="text-right py-3 sm:py-4 hidden md:table-cell">
                          <Badge variant="secondary" className="text-xs sm:text-sm">{entry.gmStreak} days</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

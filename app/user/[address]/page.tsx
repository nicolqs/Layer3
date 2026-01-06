'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CHAIN_CATEGORIES, CHAIN_EXPLORERS, getChainInfo } from '@/lib/chains';
import { fetcher } from '@/lib/fetcher';
import { getTokenLogo } from '@/lib/tokens';
import { calculateTransactionStats, filterTransactionsByDateRange, formatRelativeTime } from '@/lib/transactionStats';
import { AlchemyNFT, MultiChainTransaction, TokenBalance, User } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { Activity, ArrowLeft, Award, CheckCircle, ExternalLink, LayoutGrid, List, TrendingUp, Trophy, Wallet, XCircle, Zap } from 'lucide-react';
import Link from 'next/link';
import { use, useMemo, useState } from 'react';

export default function UserDetailPage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = use(params);
  const [selectedChain, setSelectedChain] = useState<number | 'all'>('all');
  const [dateRange, setDateRange] = useState<'all' | '7d' | '30d' | '90d'>('all');
  const [balanceView, setBalanceView] = useState<'cards' | 'list'>('list');

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user', address],
    queryFn: () => fetcher<User>(`/api/user/${address}`),
  });

  const { data: balances, isLoading: balancesLoading } = useQuery({
    queryKey: ['balances', address],
    queryFn: () => fetcher<TokenBalance[]>(`/api/user/${address}/balances`),
  });

  const { data: allTransactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions', address, selectedChain],
    queryFn: () => fetcher<MultiChainTransaction[]>(
      `/api/user/${address}/transactions${selectedChain !== 'all' ? `?chainId=${selectedChain}` : ''}`
    ),
  });

  const { data: nfts, isLoading: nftsLoading } = useQuery({
    queryKey: ['nfts', address],
    queryFn: () => fetcher<AlchemyNFT[]>(`/api/user/${address}/nfts`),
  });

  // Filter transactions by date range
  const transactions = useMemo(() => {
    if (!allTransactions) return [];
    return filterTransactionsByDateRange(allTransactions, dateRange) as MultiChainTransaction[];
  }, [allTransactions, dateRange]);

  // Calculate stats
  const stats = useMemo(() => {
    return calculateTransactionStats(transactions);
  }, [transactions]);

  if (userLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold">User not found</h1>
            <Link href="/" className="text-primary hover:underline mt-4 inline-block">
              Back to Leaderboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalBalance = balances?.reduce((acc, bal) => {
    const value = parseFloat(bal.balance) * (bal.price || 0);
    return acc + (isNaN(value) ? 0 : value);
  }, 0) || 0;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back Button */}
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Leaderboard
          </Link>
          <ThemeToggle />
        </div>

        {/* User Header */}
        <Card>
          <CardContent className="pt-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-2xl">
                    {user.ensName?.[0]?.toUpperCase() || user.address.slice(2, 4).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold">
                    {user.ensName || `${user.address.slice(0, 6)}...${user.address.slice(-4)}`}
                  </h1>
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                    {user.address}
                    <a
                      href={`https://etherscan.io/address/${user.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Rank #{user.rank}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-3 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3">
              <CardTitle className="text-md font-medium">Total XP</CardTitle>
              <div className="rounded-lg bg-gradient-to-br from-yellow-500/20 to-amber-500/20 p-1.5 shadow-lg shadow-yellow-500/20 ring-1 ring-yellow-500/30">
                <Trophy className="h-3.5 w-3.5 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent className="pb-3 pt-0">
              <div className="text-xl font-bold">{user.totalXP.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3">
              <CardTitle className="text-md font-medium">Quests Completed</CardTitle>
              <div className="rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-1.5 shadow-lg shadow-blue-500/20 ring-1 ring-blue-500/30">
                <Award className="h-3.5 w-3.5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent className="pb-3 pt-0">
              <div className="text-xl font-bold">{user.questsCompleted}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3">
              <CardTitle className="text-xs font-medium">NFTs</CardTitle>
              <div className="rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-1.5 shadow-lg shadow-green-500/20 ring-1 ring-green-500/30">
                <Wallet className="h-3.5 w-3.5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent className="pb-3 pt-0">
              <div className="text-xl font-bold">{user.nftCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3">
              <CardTitle className="text-xs font-medium">Transactions</CardTitle>
              <div className="rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 p-1.5 shadow-lg shadow-orange-500/20 ring-1 ring-orange-500/30">
                <Activity className="h-3.5 w-3.5 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent className="pb-3 pt-0">
              <div className="text-xl font-bold">{transactions?.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="balances" className="space-y-4">
          <TabsList>
            <TabsTrigger value="balances">Balances</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="nfts">NFTs</TabsTrigger>
          </TabsList>

          {/* Balances Tab */}
          <TabsContent value="balances" className="space-y-6">
            {/* Portfolio Header */}
            <Card className="border-border/50 bg-gradient-to-br from-card via-card to-accent/5 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Portfolio</CardTitle>
                    <CardDescription>Assets across 15 blockchain networks</CardDescription>
                  </div>
                  
                  {/* View Toggle */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50">
                      <Button
                        variant={balanceView === 'cards' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setBalanceView('cards')}
                        className="h-8 w-8 p-0"
                      >
                        <LayoutGrid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={balanceView === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setBalanceView('list')}
                        className="h-8 w-8 p-0"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                    <Wallet className="h-8 w-8 text-muted-foreground ml-2" />
                  </div>
                </div>
              </CardHeader>
            </Card>

            {balancesLoading ? (
              balanceView === 'cards' ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              )
            ) : balances && balances.length > 0 ? (
              balanceView === 'cards' ? (
                // Card View
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {balances.map((balance, i) => {
                  const chainInfo = getChainInfo(balance.chainId);
                  const tokenLogo = getTokenLogo(balance.symbol);

                  return (
                    <Card 
                      key={i}
                      className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-primary/50"
                    >
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <CardContent className="p-6 relative">
                        <div className="flex items-start justify-between mb-4">
                          {/* Token Logo */}
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center ring-2 ring-border/50 group-hover:ring-primary/30 transition-all">
                              <img 
                                src={tokenLogo} 
                                alt={balance.symbol}
                                className="w-8 h-8 object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                            {/* Chain badge overlay */}
                            {chainInfo && (
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-background border-2 border-border/50 flex items-center justify-center">
                                <img 
                                  src={chainInfo.logo} 
                                  alt={chainInfo.name}
                                  className="w-3 h-3 rounded-full object-cover"
                                />
                              </div>
                            )}
                          </div>

                          {/* Chain Name Badge */}
                          {chainInfo && (
                            <Badge variant="outline" className="text-xs font-medium">
                              {chainInfo.name}
                            </Badge>
                          )}
                        </div>

                        {/* Token Info */}
                        <div className="space-y-1">
                          <div className="flex items-baseline gap-2">
                            <h3 className="text-2xl font-bold tracking-tight">
                              {parseFloat(balance.balance).toFixed(4)}
                            </h3>
                            <span className="text-sm font-medium text-muted-foreground">
                              {balance.symbol}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {balance.name}
                          </p>
                        </div>

                        {/* Optional: Add USD value if available */}
                        {balance.value && (
                          <div className="mt-3 pt-3 border-t border-border/50">
                            <p className="text-xs text-muted-foreground">
                              ≈ ${balance.value.toFixed(2)} USD
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              ) : (
                // List View
                <Card className="border-border/50">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead className="w-[50%]">Asset</TableHead>
                            <TableHead>Chain</TableHead>
                            <TableHead className="text-right">Balance</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {balances.map((balance, i) => {
                            const chainInfo = getChainInfo(balance.chainId);
                            const tokenLogo = getTokenLogo(balance.symbol);

                            return (
                              <TableRow 
                                key={i}
                                className="transition-colors hover:bg-muted/30"
                              >
                                {/* Asset Column */}
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    {/* Token Logo */}
                                    <div className="relative flex-shrink-0">
                                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center ring-2 ring-border/50">
                                        <img 
                                          src={tokenLogo} 
                                          alt={balance.symbol}
                                          className="w-6 h-6 object-contain"
                                          onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                          }}
                                        />
                                      </div>
                                      {/* Chain badge overlay */}
                                      {chainInfo && (
                                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-background border border-border/50 flex items-center justify-center">
                                          <img 
                                            src={chainInfo.logo} 
                                            alt={chainInfo.name}
                                            className="w-2.5 h-2.5 rounded-full object-cover"
                                          />
                                        </div>
                                      )}
                                    </div>

                                    {/* Token Info */}
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold text-base">
                                          {balance.symbol}
                                        </span>
                                      </div>
                                      <p className="text-sm text-muted-foreground truncate">
                                        {balance.name}
                                      </p>
                                    </div>
                                  </div>
                                </TableCell>

                                {/* Chain Column */}
                                <TableCell>
                                  {chainInfo && (
                                    <div className="flex items-center gap-2">
                                      <img 
                                        src={chainInfo.logo} 
                                        alt={chainInfo.name}
                                        className="w-5 h-5 rounded-full object-cover"
                                      />
                                      <span className="text-sm font-medium hidden sm:inline">
                                        {chainInfo.name}
                                      </span>
                                    </div>
                                  )}
                                </TableCell>

                                {/* Balance Column */}
                                <TableCell className="text-right">
                                  <div className="flex flex-col items-end">
                                    <span className="font-semibold text-base tabular-nums">
                                      {parseFloat(balance.balance).toFixed(4)}
                                    </span>
                                    {balance.value && (
                                      <span className="text-xs text-muted-foreground">
                                        ≈ ${balance.value.toFixed(2)}
                                      </span>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Wallet className="h-16 w-16 text-muted-foreground/20 mb-4" />
                  <h3 className="text-lg font-semibold mb-1">No Assets Found</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-sm">
                    This address doesn't hold any tokens we track, or they might be on unsupported chains.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="border-border/50 bg-card/50 backdrop-blur transition-all hover:shadow-lg hover:scale-[1.02]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalTransactions}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Across all chains
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur transition-all hover:shadow-lg hover:scale-[1.02]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalVolume} ETH</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total transferred
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur transition-all hover:shadow-lg hover:scale-[1.02]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.successRate}%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Successful txs
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur transition-all hover:shadow-lg hover:scale-[1.02]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Gas Fees</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalGasFees} ETH</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Gas spent
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>View transactions across multiple chains</CardDescription>
                  </div>
                  
                  {/* Date Range Filter */}
                  <div className="flex gap-2">
                    {(['all', '7d', '30d', '90d'] as const).map((range) => (
                      <Button
                        key={range}
                        variant={dateRange === range ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setDateRange(range)}
                        className="transition-all"
                      >
                        {range === 'all' ? 'All Time' : range.toUpperCase()}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>

              {/* Chain Selector */}
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <Select
                    value={selectedChain.toString()}
                    onValueChange={(v: string) => setSelectedChain(v === 'all' ? 'all' : parseInt(v))}
                  >
                    <SelectTrigger className="w-full sm:w-[280px]">
                      <SelectValue placeholder="Select chain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            ∞
                          </div>
                          <span className="font-medium">All Chains</span>
                        </div>
                      </SelectItem>
                      
                      {Object.entries(CHAIN_CATEGORIES).map(([category, chainIds]) => (
                        <div key={category}>
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                            {category}
                          </div>
                          {chainIds.map((chainId) => {
                            const chain = getChainInfo(chainId);
                            if (!chain) return null;
                            return (
                              <SelectItem key={chainId} value={chainId.toString()}>
                                <div className="flex items-center gap-2.5">
                                  <img 
                                    src={chain.logo} 
                                    alt={chain.name}
                                    className="w-5 h-5 rounded-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                    }}
                                  />
                                  <div 
                                    className="w-5 h-5 rounded-full hidden flex-shrink-0" 
                                    style={{ backgroundColor: chain.color }}
                                  />
                                  <span className="font-medium">{chain.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    ({chain.nativeCurrency.symbol})
                                  </span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Quick filter badges for popular chains */}
                  <div className="flex flex-wrap gap-2">
                    {[1, 137, 42161, 10, 8453, 56].map((chainId) => {
                      const chain = getChainInfo(chainId);
                      if (!chain) return null;
                      const isSelected = selectedChain === chainId;
                      return (
                        <button
                          key={chainId}
                          onClick={() => setSelectedChain(chainId)}
                          className={`
                            px-3 py-1.5 rounded-full text-xs font-medium
                            transition-all duration-200 border
                            ${isSelected
                              ? 'border-primary bg-primary text-primary-foreground shadow-sm scale-105'
                              : 'border-border hover:border-primary/50 hover:bg-accent hover:scale-105'
                            }
                          `}
                        >
                          <div className="flex items-center gap-2">
                            <img 
                              src={chain.logo} 
                              alt={chain.name}
                              className="w-4 h-4 rounded-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            {chain.name}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Transactions Table */}
                {transactionsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full animate-pulse" />
                    ))}
                  </div>
                ) : transactions && transactions.length > 0 ? (
                  <div className="rounded-lg border border-border/50 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-[100px]">Chain</TableHead>
                          <TableHead>Hash</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Value</TableHead>
                          <TableHead className="text-right">Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((tx, index) => {
                          const isSent = tx.from.toLowerCase() === address.toLowerCase();
                          const isSuccess = tx.isError === '0';
                          const chainConfig = CHAIN_EXPLORERS[tx.chainId];
                          
                          return (
                            <TableRow 
                              key={`${tx.hash}-${tx.chainId}`}
                              className="transition-all hover:bg-muted/50 animate-in fade-in slide-in-from-bottom-2"
                              style={{ animationDelay: `${index * 30}ms` }}
                            >
                              {/* Chain Badge */}
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <img 
                                    src={chainConfig?.logo} 
                                    alt={tx.chainName}
                                    className="w-5 h-5 rounded-full object-cover flex-shrink-0"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                    }}
                                  />
                                  <div 
                                    className="w-5 h-5 rounded-full flex-shrink-0 hidden" 
                                    style={{ backgroundColor: chainConfig?.color || '#888' }}
                                  />
                                  <span className="text-xs font-medium whitespace-nowrap">
                                    {tx.chainName}
                                  </span>
                                </div>
                              </TableCell>

                              {/* Hash */}
                              <TableCell className="font-mono text-xs">
                                <a
                                  href={`${chainConfig.explorer}/tx/${tx.hash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 hover:text-primary transition-colors group"
                                >
                                  <span className="hidden sm:inline">{tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}</span>
                                  <span className="sm:hidden">{tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}</span>
                                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                              </TableCell>

                              {/* Type */}
                              <TableCell>
                                <Badge 
                                  variant={isSent ? "default" : "secondary"}
                                  className={`transition-all ${
                                    isSent 
                                      ? 'bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 border-blue-500/50' 
                                      : 'bg-green-500/20 text-green-500 hover:bg-green-500/30 border-green-500/50'
                                  }`}
                                >
                                  {isSent ? '↑ Sent' : '↓ Received'}
                                </Badge>
                              </TableCell>

                              {/* Status */}
                              <TableCell>
                                <Badge 
                                  variant={isSuccess ? "outline" : "destructive"}
                                  className={`transition-all ${
                                    isSuccess 
                                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/50' 
                                      : 'bg-red-500/20 text-red-500 border-red-500/50'
                                  }`}
                                >
                                  {isSuccess ? (
                                    <><CheckCircle className="h-3 w-3 mr-1" /> Success</>
                                  ) : (
                                    <><XCircle className="h-3 w-3 mr-1" /> Failed</>
                                  )}
                                </Badge>
                              </TableCell>

                              {/* Value */}
                              <TableCell className="text-right font-mono">
                                <span className={`${isSent ? 'text-blue-500' : 'text-green-500'}`}>
                                  {isSent ? '-' : '+'}{(parseInt(tx.value) / 1e18).toFixed(6)} ETH
                                </span>
                              </TableCell>

                              {/* Time */}
                              <TableCell className="text-right text-xs text-muted-foreground">
                                <div className="flex flex-col items-end">
                                  <span>{formatRelativeTime(parseInt(tx.timeStamp))}</span>
                                  <span className="text-[10px] opacity-60">
                                    {(parseInt(tx.gasUsed) / 1e9).toFixed(2)} Gwei
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium">No transactions found</p>
                    <p className="text-sm mt-1">Try selecting a different chain or date range</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* NFTs Tab */}
          <TabsContent value="nfts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>NFT Collection</CardTitle>
                <CardDescription>NFTs owned across all chains</CardDescription>
              </CardHeader>
              <CardContent>
                {nftsLoading ? (
                  <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <Skeleton key={i} className="h-64 w-full" />
                    ))}
                  </div>
                ) : nfts && nfts.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {nfts.map((nft, i) => {
                      const imageUrl = nft.image?.cachedUrl || nft.image?.thumbnailUrl || nft.image?.pngUrl || nft.raw?.metadata?.image || '';
                      const nftName = nft.name || nft.raw?.metadata?.name || `Token #${nft.tokenId}`;
                      const collectionName = nft.collection?.name || nft.contract?.name || 'Unknown';
                      
                      return (
                        <Card key={`${nft.contract.address}-${nft.tokenId}`} className="overflow-hidden">
                          <div className="aspect-square bg-muted">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={nftName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${nft.contract.address}-${nft.tokenId}`;
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                No Image
                              </div>
                            )}
                          </div>
                          <CardHeader className="p-4">
                            <CardTitle className="text-sm truncate">{nftName}</CardTitle>
                            <CardDescription className="text-xs truncate">
                              {collectionName}
                            </CardDescription>
                            <Badge variant="outline" className="w-fit text-xs mt-2">
                              Ethereum
                            </Badge>
                          </CardHeader>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No NFTs found
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


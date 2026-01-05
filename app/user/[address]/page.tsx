'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetcher } from '@/lib/fetcher';
import { User, TokenBalance, Transaction, NFT } from '@/lib/types';
import { getChainName } from '@/lib/viem';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Trophy, Award, Wallet, Activity } from 'lucide-react';

export default function UserDetailPage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = use(params);

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user', address],
    queryFn: () => fetcher<User>(`/api/user/${address}`),
  });

  const { data: balances, isLoading: balancesLoading } = useQuery({
    queryKey: ['balances', address],
    queryFn: () => fetcher<TokenBalance[]>(`/api/user/${address}/balances`),
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions', address],
    queryFn: () => fetcher<Transaction[]>(`/api/user/${address}/transactions`),
  });

  const { data: nfts, isLoading: nftsLoading } = useQuery({
    queryKey: ['nfts', address],
    queryFn: () => fetcher<NFT[]>(`/api/user/${address}/nfts`),
  });

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
          <CardContent className="pt-6">
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
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total XP</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.totalXP.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quests Completed</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.questsCompleted}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">NFTs</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.nftCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions?.length || 0}</div>
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
          <TabsContent value="balances" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Token Balances</CardTitle>
                <CardDescription>Assets across all chains</CardDescription>
              </CardHeader>
              <CardContent>
                {balancesLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : balances && balances.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Asset</TableHead>
                        <TableHead>Chain</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {balances.map((balance, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">
                            {balance.symbol}
                            <div className="text-xs text-muted-foreground">{balance.name}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{getChainName(balance.chainId)}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {parseFloat(balance.balance).toFixed(4)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No balances found
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Transaction history across all chains</CardDescription>
              </CardHeader>
              <CardContent>
                {transactionsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : transactions && transactions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Hash</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Chain</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((tx) => (
                        <TableRow key={tx.hash}>
                          <TableCell className="font-mono text-xs">
                            <a
                              href={`https://etherscan.io/tx/${tx.hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline flex items-center gap-1"
                            >
                              {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </TableCell>
                          <TableCell>
                            <Badge variant={tx.from.toLowerCase() === address.toLowerCase() ? "default" : "secondary"}>
                              {tx.from.toLowerCase() === address.toLowerCase() ? "Sent" : "Received"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{getChainName(tx.chainId)}</Badge>
                          </TableCell>
                          <TableCell className="text-right">{parseFloat(tx.value).toFixed(4)} ETH</TableCell>
                          <TableCell className="text-right text-xs text-muted-foreground">
                            {new Date(tx.timestamp).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No transactions found
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
                    {nfts.map((nft, i) => (
                      <Card key={i} className="overflow-hidden">
                        <div className="aspect-square bg-muted">
                          <img
                            src={nft.image}
                            alt={nft.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardHeader className="p-4">
                          <CardTitle className="text-sm truncate">{nft.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {nft.collection}
                          </CardDescription>
                          <Badge variant="outline" className="w-fit text-xs mt-2">
                            {getChainName(nft.chainId)}
                          </Badge>
                        </CardHeader>
                      </Card>
                    ))}
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


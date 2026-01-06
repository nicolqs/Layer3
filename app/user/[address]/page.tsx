"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BalancesTab } from "@/components/user-detail/BalancesTab";
import { NFTsTab } from "@/components/user-detail/NFTsTab";
import { TransactionsTab } from "@/components/user-detail/TransactionsTab";
import { UserDetailHeader } from "@/components/user-detail/UserDetailHeader";
import { UserProfileCard } from "@/components/user-detail/UserProfileCard";
import { UserStatsGrid } from "@/components/user-detail/UserStatsGrid";
import { fetcher } from "@/lib/fetcher";
import {
  calculateTransactionStats,
  filterTransactionsByDateRange,
} from "@/lib/transactionStats";
import {
  AlchemyNFT,
  DateRangeFilter,
  MultiChainTransaction,
  TokenBalance,
  User,
} from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { use, useMemo, useState } from "react";

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = use(params);
  const [selectedChain, setSelectedChain] = useState<number | "all">("all");
  const [dateRange, setDateRange] = useState<DateRangeFilter>("all");

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user", address],
    queryFn: () => fetcher<User>(`/api/user/${address}`),
  });

  const { data: balances, isLoading: balancesLoading } = useQuery({
    queryKey: ["balances", address],
    queryFn: () => fetcher<TokenBalance[]>(`/api/user/${address}/balances`),
  });

  const { data: allTransactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["transactions", address, selectedChain],
    queryFn: () =>
      fetcher<MultiChainTransaction[]>(
        `/api/user/${address}/transactions${selectedChain !== "all" ? `?chainId=${selectedChain}` : ""}`
      ),
  });

  const { data: nfts, isLoading: nftsLoading } = useQuery({
    queryKey: ["nfts", address],
    queryFn: () => fetcher<AlchemyNFT[]>(`/api/user/${address}/nfts`),
  });

  // Filter transactions by date range
  const transactions = useMemo(() => {
    if (!allTransactions) return [];
    return filterTransactionsByDateRange(
      allTransactions,
      dateRange
    ) as MultiChainTransaction[];
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
            <Link
              href="/"
              className="text-primary hover:underline mt-4 inline-block"
            >
              Back to Leaderboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-8">
        <UserDetailHeader />
        <UserProfileCard user={user} />
        <UserStatsGrid
          user={user}
          transactionCount={transactions?.length || 0}
        />

        <Tabs defaultValue="balances" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:inline-flex">
            <TabsTrigger value="balances" className="text-xs sm:text-sm">
              Balances
            </TabsTrigger>
            <TabsTrigger value="transactions" className="text-xs sm:text-sm">
              Transactions
            </TabsTrigger>
            <TabsTrigger value="nfts" className="text-xs sm:text-sm">
              NFTs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="balances">
            <BalancesTab balances={balances} isLoading={balancesLoading} />
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionsTab
              transactions={transactions}
              stats={stats}
              isLoading={transactionsLoading}
              address={address}
              selectedChain={selectedChain}
              setSelectedChain={setSelectedChain}
            />
          </TabsContent>

          <TabsContent value="nfts">
            <NFTsTab nfts={nfts} isLoading={nftsLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

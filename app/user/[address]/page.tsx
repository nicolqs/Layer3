"use client";

import { Header } from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BalancesTab } from "@/components/user-detail/BalancesTab";
import { LiveRankTracker } from "@/components/user-detail/LiveRankTracker";
import { NFTsTab } from "@/components/user-detail/NFTsTab";
import { TransactionsTab } from "@/components/user-detail/TransactionsTab";
import { UserProfileCard } from "@/components/user-detail/UserProfileCard";
import { trpc } from "@/lib/client/trpc";
import {
  calculateTransactionStats,
  filterTransactionsByDateRange,
} from "@/lib/transactionStats";
import { DateRangeFilter, MultiChainTransaction } from "@/lib/types";
import { ArrowLeft } from "lucide-react";
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

  // Use tRPC for all data fetching - fully type-safe!
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = trpc.user.get.useQuery({
    address,
  });

  const { data: balances, isLoading: balancesLoading } =
    trpc.user.balances.useQuery({
      address,
    });

  const { data: allTransactions, isLoading: transactionsLoading } =
    trpc.user.transactions.useQuery({
      address,
      chainId: selectedChain === "all" ? undefined : selectedChain,
      limit: 50,
    });

  const { data: nfts, isLoading: nftsLoading } = trpc.user.nfts.useQuery({
    address,
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
      <>
        <Header />
        <div className="min-h-screen bg-background p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </>
    );
  }

  if (userError || !user) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-destructive">
                User Not Found
              </h1>
              <p className="text-muted-foreground">
                {userError?.message ||
                  `The address ${address.slice(0, 6)}...${address.slice(-4)} was not found in the Layer3 leaderboard.`}
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-primary hover:underline mt-4"
              >
                <span>← Back to Leaderboard</span>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background p-4 sm:p-8">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-8">
          {/* Back to Leaderboard Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Leaderboard</span>
          </Link>

          <UserProfileCard user={user} />
          <LiveRankTracker address={address} />

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
    </>
  );
}

'use client'

import { Header } from '@/components/Header'
import { Layer3Icon } from '@/components/Layer3Icon'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BalancesTab } from '@/components/user-detail/BalancesTab'
import { LiveRankTracker } from '@/components/user-detail/LiveRankTracker'
import { NFTsTab } from '@/components/user-detail/NFTsTab'
import { TransactionsTab } from '@/components/user-detail/TransactionsTab'
import { UserProfileCard } from '@/components/user-detail/UserProfileCard'
import { trpc } from '@/lib/client/trpc'
import {
  calculateTransactionStats,
  filterTransactionsByDateRange,
} from '@/lib/transactionStats'
import { DateRangeFilter, MultiChainTransaction } from '@/lib/types'
import { ArrowLeft, Image as ImageIcon, Receipt, Wallet } from 'lucide-react'
import Link from 'next/link'
import { use, useMemo, useState } from 'react'

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ address: string }>
}) {
  const { address } = use(params)
  const [selectedChain, setSelectedChain] = useState<number | 'all'>('all')
  const [dateRange, setDateRange] = useState<DateRangeFilter>('all')

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = trpc.user.get.useQuery({
    address,
  })

  const { data: balancesData, isLoading: balancesLoading } =
    trpc.user.balances.useQuery({
      address,
    })

  const { data: transactionsData, isLoading: transactionsLoading } =
    trpc.user.transactions.useQuery({
      address,
      chainId: selectedChain === 'all' ? undefined : selectedChain,
      limit: 50,
    })

  const { data: nftsData, isLoading: nftsLoading } = trpc.user.nfts.useQuery({
    address,
  })

  // Extract data from responses
  const balances = balancesData?.balances || []
  const allTransactions = transactionsData?.transactions || []
  const nfts = nftsData?.nfts || []

  // Counts for tab badges
  const balanceCount = balances.length
  const nftCount = nfts.length

  // Filter transactions by date range
  const transactions = useMemo(() => {
    if (!allTransactions) return []
    return filterTransactionsByDateRange(
      allTransactions,
      dateRange,
    ) as MultiChainTransaction[]
  }, [allTransactions, dateRange])

  // Calculate stats
  const stats = useMemo(() => {
    return calculateTransactionStats(transactions)
  }, [transactions])

  if (userLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background p-8 flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            {/* Crypto-native spinning blocks animation */}
            <div className="relative inline-block">
              <Layer3Icon className="h-16 w-16 text-primary animate-spin" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
            </div>

            {/* Engaging message */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Indexing the blockchain...
              </h2>
              <p className="text-muted-foreground text-sm">
                Fetching on-chain activity, balances, NFTs, and transaction
                history across multiple chains.
                <br />
                This usually takes just a moment.
              </p>
            </div>

            {/* Optional: Loading skeleton hints */}
            <div className="space-y-3 pt-4">
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
            </div>
          </div>
        </div>
      </>
    )
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
    )
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

          <Tabs defaultValue="balances" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 gap-2 sm:gap-3 bg-transparent p-0 h-auto">
              <TabsTrigger
                value="balances"
                className="
                  flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2
                  px-4 sm:px-6 py-3 sm:py-4
                  rounded-xl
                  border-2 border-border/50
                  bg-card/50
                  data-[state=active]:border-transparent
                  data-[state=active]:bg-gradient-to-br data-[state=active]:from-emerald-500/10 data-[state=active]:via-green-500/10 data-[state=active]:to-teal-500/10
                  data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/20
                  hover:border-emerald-500/50
                  transition-all duration-300
                  text-sm sm:text-base font-semibold
                  data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400
                "
              >
                <Wallet className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="flex items-center gap-2">
                  Balances
                  {balanceCount > 0 && (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 h-5 border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    >
                      {balanceCount}
                    </Badge>
                  )}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="transactions"
                className="
                  flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2
                  px-4 sm:px-6 py-3 sm:py-4
                  rounded-xl
                  border-2 border-border/50
                  bg-card/50
                  data-[state=active]:border-transparent
                  data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500/10 data-[state=active]:via-cyan-500/10 data-[state=active]:to-indigo-500/10
                  data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/20
                  hover:border-blue-500/50
                  transition-all duration-300
                  text-sm sm:text-base font-semibold
                  data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400
                "
              >
                <Receipt className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="flex items-center gap-2">
                  <span className="sm:hidden">Txns</span>
                  <span className="hidden sm:inline">Transactions</span>
                  {transactions.length > 0 && (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 h-5 border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300"
                    >
                      {transactions.length}
                    </Badge>
                  )}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="nfts"
                className="
                  flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2
                  px-4 sm:px-6 py-3 sm:py-4
                  rounded-xl
                  border-2 border-border/50
                  bg-card/50
                  data-[state=active]:border-transparent
                  data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500/10 data-[state=active]:via-pink-500/10 data-[state=active]:to-rose-500/10
                  data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/20
                  hover:border-purple-500/50
                  transition-all duration-300
                  text-sm sm:text-base font-semibold
                  data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400
                "
              >
                <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="flex items-center gap-2">
                  NFTs
                  {nftCount > 0 && (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 h-5 border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300"
                    >
                      {nftCount}
                    </Badge>
                  )}
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="balances">
              <BalancesTab balances={balances} isLoading={balancesLoading} />
            </TabsContent>

            <TabsContent value="transactions">
              <TransactionsTab
                transactions={allTransactions}
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
  )
}

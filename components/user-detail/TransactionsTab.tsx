'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MultiChainTransaction } from '@/lib/types';
import { TransactionStats as Stats } from '@/lib/types';
import { useState } from 'react';
import { TransactionFilters } from './TransactionFilters';
import { TransactionStats } from './TransactionStats';
import { TransactionTable } from './TransactionTable';

interface TransactionsTabProps {
  transactions: MultiChainTransaction[];
  stats: Stats;
  isLoading: boolean;
  address: string;
  selectedChain: number | 'all';
  setSelectedChain: (chain: number | 'all') => void;
}

export function TransactionsTab({
  transactions,
  stats,
  isLoading,
  address,
  selectedChain,
  setSelectedChain,
}: TransactionsTabProps) {
  const [dateRange, setDateRange] = useState<'all' | '7d' | '30d' | '90d'>('all');

  return (
    <div className="space-y-4 sm:space-y-6">
      <TransactionStats stats={stats} />

      <Card className="border-border/50">
        <CardHeader className="pb-3 space-y-3 sm:space-y-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div className="min-w-0">
              <CardTitle className="text-base sm:text-lg">Transaction History</CardTitle>
              <CardDescription className="text-xs sm:text-sm">View across chains</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-3 sm:px-6">
          <TransactionFilters
            selectedChain={selectedChain}
            setSelectedChain={setSelectedChain}
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
          <TransactionTable
            transactions={transactions}
            address={address}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}


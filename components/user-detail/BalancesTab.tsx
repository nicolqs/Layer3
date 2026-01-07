'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  PriceDisplayMode,
  calculateTotalValue,
  formatUSD,
  getPriceDisplayLabel,
} from '@/lib/priceUtils'
import { TokenBalance } from '@/lib/types'
import { DollarSign, LayoutGrid, List, Wallet } from 'lucide-react'
import { useMemo, useState } from 'react'
import { BalanceCardView } from './BalanceCardView'
import { BalanceListView } from './BalanceListView'

interface BalancesTabProps {
  balances?: TokenBalance[]
  isLoading: boolean
}

export function BalancesTab({ balances, isLoading }: BalancesTabProps) {
  const [balanceView, setBalanceView] = useState<'cards' | 'list'>('list')
  const [priceMode, setPriceMode] = useState<PriceDisplayMode>('native')

  // Calculate total portfolio value
  const totalValue = useMemo(() => {
    if (!balances || balances.length === 0) return 0
    return calculateTotalValue(balances)
  }, [balances])

  const togglePriceMode = () => {
    setPriceMode((prev) => (prev === 'native' ? 'usd' : 'native'))
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-gradient-to-br from-card via-card to-accent/5 backdrop-blur">
        <CardHeader className="pb-3 sm:pb-6">
          <div className="flex items-start sm:items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
                <CardTitle className="text-lg sm:text-2xl">Portfolio</CardTitle>
                {totalValue > 0 && (
                  <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                    {formatUSD(totalValue)}
                  </span>
                )}
              </div>
              <CardDescription className="text-xs sm:text-sm">
                Assets across 45+ chains
              </CardDescription>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* Price mode toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={togglePriceMode}
                className="h-7 sm:h-8 px-2 sm:px-3 text-xs font-medium gap-1 sm:gap-1.5 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20 hover:bg-green-500/20"
              >
                <DollarSign className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span className="hidden sm:inline">
                  {getPriceDisplayLabel(priceMode)}
                </span>
              </Button>

              {/* View mode toggle */}
              <div className="flex items-center gap-0.5 sm:gap-1 p-0.5 sm:p-1 rounded-lg bg-muted/50">
                <Button
                  variant={balanceView === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setBalanceView('cards')}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                >
                  <LayoutGrid className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant={balanceView === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setBalanceView('list')}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                >
                  <List className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {isLoading ? (
        balanceView === 'cards' ? (
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-14 sm:h-16 w-full" />
            ))}
          </div>
        )
      ) : balances && balances.length > 0 ? (
        balanceView === 'cards' ? (
          <BalanceCardView balances={balances} priceMode={priceMode} />
        ) : (
          <BalanceListView balances={balances} priceMode={priceMode} />
        )
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Wallet className="h-16 w-16 text-muted-foreground/20 mb-4" />
            <h3 className="text-lg font-semibold mb-1">No Assets Found</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              This address doesn't hold any tokens we track, or they might be on
              unsupported chains.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

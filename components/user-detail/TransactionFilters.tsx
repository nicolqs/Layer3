'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CHAIN_CATEGORIES, getChainInfo } from '@/lib/chains';

interface TransactionFiltersProps {
  selectedChain: number | 'all';
  setSelectedChain: (chain: number | 'all') => void;
  dateRange: 'all' | '7d' | '30d' | '90d';
  setDateRange: (range: 'all' | '7d' | '30d' | '90d') => void;
}

export function TransactionFilters({
  selectedChain,
  setSelectedChain,
  dateRange,
  setDateRange,
}: TransactionFiltersProps) {
  return (
    <div className="flex flex-col gap-3 mb-4 sm:mb-6">
      {/* Date Range Buttons */}
      <div className="flex gap-1.5 sm:gap-2 w-full sm:w-auto overflow-x-auto">
        {(['all', '7d', '30d', '90d'] as const).map((range) => (
          <Button
            key={range}
            variant={dateRange === range ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDateRange(range)}
            className="transition-all text-xs sm:text-sm px-2.5 sm:px-3 h-8 sm:h-9 whitespace-nowrap"
          >
            {range === 'all' ? 'All' : range.toUpperCase()}
          </Button>
        ))}
      </div>

      {/* Chain Selector */}
      <Select
        value={selectedChain.toString()}
        onValueChange={(v: string) => setSelectedChain(v === 'all' ? 'all' : parseInt(v))}
      >
        <SelectTrigger className="w-full sm:w-[280px] text-sm">
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

      {/* Quick Filter Badges */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {[1, 137, 42161, 10, 8453, 56].map((chainId) => {
          const chain = getChainInfo(chainId);
          if (!chain) return null;
          const isSelected = selectedChain === chainId;
          return (
            <button
              key={chainId}
              onClick={() => setSelectedChain(chainId)}
              className={`
                px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium
                transition-all duration-200 border
                ${isSelected
                  ? 'border-primary bg-primary text-primary-foreground shadow-sm scale-105'
                  : 'border-border hover:border-primary/50 hover:bg-accent hover:scale-105'
                }
              `}
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <img 
                  src={chain.logo} 
                  alt={chain.name}
                  className="w-3 h-3 sm:w-4 sm:h-4 rounded-full object-cover"
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
                <span className="hidden sm:inline">{chain.name}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}


'use client'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CHAIN_CATEGORIES, POPULAR_CHAINS, getChainInfo } from '@/lib/chains'
import { DATE_RANGE_OPTIONS, DateRangeFilter } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'

interface TransactionFiltersProps {
  selectedChain: number | 'all'
  setSelectedChain: (chain: number | 'all') => void
  dateRange: DateRangeFilter
  setDateRange: (range: DateRangeFilter) => void
}

export function TransactionFilters({
  selectedChain,
  setSelectedChain,
  dateRange,
  setDateRange,
}: TransactionFiltersProps) {
  const [open, setOpen] = useState(false)

  const selectedChainInfo =
    selectedChain === 'all' ? null : getChainInfo(selectedChain)

  return (
    <div className="flex flex-col gap-3 mb-4 sm:mb-6">
      {/* Date Range Buttons */}
      <div className="flex gap-1.5 sm:gap-2 w-full sm:w-auto overflow-x-auto">
        {DATE_RANGE_OPTIONS.map((range) => (
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

      {/* Chain Selector with Search */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full sm:w-[400px] justify-between h-12 text-base font-medium"
          >
            {selectedChain === 'all' ? (
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  ∞
                </div>
                <span>All Chains</span>
              </div>
            ) : selectedChainInfo ? (
              <div className="flex items-center gap-2.5">
                <img
                  src={selectedChainInfo.logo}
                  alt={selectedChainInfo.name}
                  className="w-6 h-6 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.nextElementSibling?.classList.remove(
                      'hidden',
                    )
                  }}
                />
                <div
                  className="w-6 h-6 rounded-full hidden flex-shrink-0"
                  style={{ backgroundColor: selectedChainInfo.color }}
                />
                <span>{selectedChainInfo.name}</span>
                <span className="text-sm text-muted-foreground">
                  ({selectedChainInfo.nativeCurrency.symbol})
                </span>
              </div>
            ) : (
              'Select chain'
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search chains..."
              className="h-12 text-base"
            />
            <CommandList>
              <CommandEmpty>No chain found.</CommandEmpty>

              {/* All Chains Option */}
              <CommandGroup>
                <CommandItem
                  value="all-chains"
                  onSelect={() => {
                    setSelectedChain('all')
                    setOpen(false)
                  }}
                  className="h-12"
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedChain === 'all' ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                      ∞
                    </div>
                    <span className="font-medium">All Chains</span>
                  </div>
                </CommandItem>
              </CommandGroup>

              {/* Chain Categories */}
              {Object.entries(CHAIN_CATEGORIES).map(([category, chainIds]) => (
                <CommandGroup key={category} heading={category}>
                  {chainIds.map((chainId) => {
                    const chain = getChainInfo(chainId)
                    if (!chain) return null
                    return (
                      <CommandItem
                        key={chainId}
                        value={`${chain.name} ${chain.nativeCurrency.symbol} ${chainId}`}
                        onSelect={() => {
                          setSelectedChain(chainId)
                          setOpen(false)
                        }}
                        className="h-12"
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            selectedChain === chainId
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                        <div className="flex items-center gap-2.5">
                          <img
                            src={chain.logo}
                            alt={chain.name}
                            className="w-6 h-6 rounded-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                              e.currentTarget.nextElementSibling?.classList.remove(
                                'hidden',
                              )
                            }}
                          />
                          <div
                            className="w-6 h-6 rounded-full hidden flex-shrink-0"
                            style={{ backgroundColor: chain.color }}
                          />
                          <span className="font-medium">{chain.name}</span>
                          <span className="text-sm text-muted-foreground">
                            ({chain.nativeCurrency.symbol})
                          </span>
                        </div>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Quick Filter Badges */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {POPULAR_CHAINS.map((chainId: number) => {
          const chain = getChainInfo(chainId)
          if (!chain) return null
          const isSelected = selectedChain === chainId
          return (
            <button
              key={chainId}
              onClick={() => setSelectedChain(chainId)}
              className={`
                px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium
                transition-all duration-200 border
                ${
                  isSelected
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
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
                <span className="hidden sm:inline">{chain.name}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

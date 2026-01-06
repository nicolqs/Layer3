import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CHAIN_EXPLORERS } from '@/lib/chains';
import { formatRelativeTime } from '@/lib/transactionStats';
import { MultiChainTransaction } from '@/lib/types';
import { Activity, CheckCircle, ExternalLink, XCircle } from 'lucide-react';

interface TransactionTableProps {
  transactions: MultiChainTransaction[];
  address: string;
  isLoading: boolean;
}

export function TransactionTable({ transactions, address, isLoading }: TransactionTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2 sm:space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-14 sm:h-16 w-full animate-pulse" />
        ))}
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Activity className="h-12 w-12 mx-auto mb-4 opacity-20" />
        <p className="text-lg font-medium">No transactions found</p>
        <p className="text-sm mt-1">Try selecting a different chain or date range</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/50 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[80px] sm:w-[100px] text-xs sm:text-sm">Chain</TableHead>
              <TableHead className="text-xs sm:text-sm">Hash</TableHead>
              <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Type</TableHead>
              <TableHead className="text-xs sm:text-sm hidden md:table-cell">Status</TableHead>
              <TableHead className="text-right text-xs sm:text-sm">Value</TableHead>
              <TableHead className="text-right text-xs sm:text-sm hidden lg:table-cell">Time</TableHead>
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
                  <TableCell className="py-2.5 sm:py-4">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <img 
                        src={chainConfig?.logo} 
                        alt={tx.chainName}
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-cover flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div 
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex-shrink-0 hidden" 
                        style={{ backgroundColor: chainConfig?.color || '#888' }}
                      />
                      <span className="text-[10px] sm:text-xs font-medium whitespace-nowrap hidden sm:inline">
                        {tx.chainName}
                      </span>
                    </div>
                  </TableCell>

                  {/* Hash */}
                  <TableCell className="font-mono text-[10px] sm:text-xs py-2.5 sm:py-4">
                    <a
                      href={`${chainConfig.explorer}/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-primary transition-colors group"
                    >
                      <span className="hidden md:inline">{tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}</span>
                      <span className="md:hidden">{tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}</span>
                      <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </TableCell>

                  {/* Type (desktop only) */}
                  <TableCell className="py-2.5 sm:py-4 hidden sm:table-cell">
                    <Badge 
                      variant={isSent ? "default" : "secondary"}
                      className={`transition-all text-[10px] sm:text-xs ${
                        isSent 
                          ? 'bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 border-blue-500/50' 
                          : 'bg-green-500/20 text-green-500 hover:bg-green-500/30 border-green-500/50'
                      }`}
                    >
                      {isSent ? '↑ Sent' : '↓ Rcv'}
                    </Badge>
                  </TableCell>

                  {/* Status (tablet+ only) */}
                  <TableCell className="py-2.5 sm:py-4 hidden md:table-cell">
                    <Badge 
                      variant={isSuccess ? "outline" : "destructive"}
                      className={`transition-all text-xs ${
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
                  <TableCell className="text-right font-mono py-2.5 sm:py-4">
                    <div className="flex flex-col items-end">
                      <span className={`text-[10px] sm:text-xs ${isSent ? 'text-blue-500' : 'text-green-500'}`}>
                        {isSent ? '-' : '+'}{(parseInt(tx.value) / 1e18).toFixed(4)}
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-muted-foreground sm:hidden">
                        {isSent ? '↑' : '↓'} {isSuccess ? '✓' : '✗'}
                      </span>
                    </div>
                  </TableCell>

                  {/* Time (desktop only) */}
                  <TableCell className="text-right text-xs text-muted-foreground py-2.5 sm:py-4 hidden lg:table-cell">
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
    </div>
  );
}


import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getChainInfo } from '@/lib/chains';
import { getTokenLogo } from '@/lib/tokens';
import { TokenBalance } from '@/lib/types';
import { PriceDisplayMode, getDisplayValue } from '@/lib/priceUtils';

interface BalanceListViewProps {
  balances: TokenBalance[];
  priceMode: PriceDisplayMode;
}

export function BalanceListView({ balances, priceMode }: BalanceListViewProps) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[50%] text-xs sm:text-sm">Asset</TableHead>
                <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Chain</TableHead>
                <TableHead className="text-right text-xs sm:text-sm">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {balances.map((balance) => {
                const chainInfo = getChainInfo(balance.chainId);
                const tokenLogo = getTokenLogo(balance.symbol);
                const displayValue = getDisplayValue(balance, priceMode);

                return (
                  <TableRow 
                    key={`${balance.symbol}-${balance.chainId}`}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <TableCell className="py-3 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="relative flex-shrink-0">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center ring-2 ring-border/50">
                            <img 
                              loading="lazy"
                              src={tokenLogo} 
                              alt={balance.symbol}
                              className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                              onError={(e) => e.currentTarget.style.display = 'none'}
                            />
                          </div>
                          {chainInfo && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-background border border-border/50 flex items-center justify-center">
                              <img 
                                loading="lazy"
                                src={chainInfo.logo} 
                                alt={chainInfo.name}
                                className="w-2.5 h-2.5 rounded-full object-cover"
                              />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-sm sm:text-base">
                              {balance.symbol}
                            </span>
                            {chainInfo && (
                              <img 
                                loading="lazy"
                                src={chainInfo.logo} 
                                alt={chainInfo.name}
                                className="w-3.5 h-3.5 rounded-full object-cover sm:hidden"
                              />
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">
                            {balance.name}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-3 sm:py-4 hidden sm:table-cell">
                      {chainInfo && (
                        <div className="flex items-center gap-2">
                          <img 
                            loading="lazy"
                            src={chainInfo.logo} 
                            alt={chainInfo.name}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="text-sm font-medium">
                            {chainInfo.name}
                          </span>
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="text-right py-3 sm:py-4">
                      <div className="flex flex-col items-end">
                        <span className="font-semibold text-sm sm:text-base tabular-nums">
                          {displayValue.primary}
                        </span>
                        {displayValue.secondary && (
                          <span className="text-[10px] sm:text-xs text-muted-foreground">
                            ≈ {displayValue.secondary}
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
  );
}


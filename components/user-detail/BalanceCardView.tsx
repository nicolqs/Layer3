import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getChainInfo } from '@/lib/chains';
import { getTokenLogo } from '@/lib/tokens';
import { TokenBalance } from '@/lib/types';

interface BalanceCardViewProps {
  balances: TokenBalance[];
}

export function BalanceCardView({ balances }: BalanceCardViewProps) {
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {balances.map((balance) => {
        const chainInfo = getChainInfo(balance.chainId);
        const tokenLogo = getTokenLogo(balance.symbol);

        return (
          <Card 
            key={`${balance.symbol}-${balance.chainId}`}
            className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-primary/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <CardContent className="p-4 sm:p-6 relative">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="relative">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center ring-2 ring-border/50 group-hover:ring-primary/30 transition-all">
                    <img 
                      loading="lazy"
                      src={tokenLogo} 
                      alt={balance.symbol}
                      className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                      onError={(e) => e.currentTarget.style.display = 'none'}
                    />
                  </div>
                  {chainInfo && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-background border-2 border-border/50 flex items-center justify-center">
                      <img 
                        loading="lazy"
                        src={chainInfo.logo} 
                        alt={chainInfo.name}
                        className="w-3 h-3 rounded-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {chainInfo && (
                  <Badge variant="outline" className="text-xs font-medium">
                    {chainInfo.name}
                  </Badge>
                )}
              </div>

              <div className="space-y-0.5 sm:space-y-1">
                <div className="flex items-baseline gap-1.5 sm:gap-2">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                    {parseFloat(balance.balance).toFixed(4)}
                  </h3>
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                    {balance.symbol}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {balance.name}
                </p>
              </div>

              {balance.value && (
                <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-border/50">
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    ≈ ${balance.value.toFixed(2)} USD
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}


import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getChainInfo } from "@/lib/chains";
import { getTokenLogo } from "@/lib/tokens";
import { TokenBalance } from "@/lib/types";
import { PriceDisplayMode, getDisplayValue } from "@/lib/priceUtils";

interface BalanceCardViewProps {
  balances: TokenBalance[];
  priceMode: PriceDisplayMode;
}

export function BalanceCardView({ balances, priceMode }: BalanceCardViewProps) {
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {balances.map((balance) => {
        const chainInfo = getChainInfo(balance.chainId);
        const tokenLogo = getTokenLogo(balance.symbol);
        const displayValue = getDisplayValue(balance, priceMode);

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
                      onError={(e) => (e.currentTarget.style.display = "none")}
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
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                    {displayValue.primary}
                  </h3>
                  {displayValue.secondary && (
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      ≈ {displayValue.secondary}
                    </p>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {balance.name}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

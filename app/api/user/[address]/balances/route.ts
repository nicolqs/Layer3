import { getTokenPrice } from "@/lib/priceService";
import { ERC20_ABI, POPULAR_TOKENS } from "@/lib/tokens";
import { TokenBalance } from "@/lib/types";
import { chains, getChainClient } from "@/lib/viem";
import { NextRequest, NextResponse } from "next/server";
import { formatUnits, isAddress } from "viem";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    if (!isAddress(address)) {
      return NextResponse.json({ error: "Invalid address" }, { status: 400 });
    }

    const balances: TokenBalance[] = [];

    // Fetch native and ERC20 balances for all chains
    await Promise.all(
      chains.map(async (chain) => {
        try {
          const client = getChainClient(chain.id);

          // Fetch native balance
          const nativeBalance = await client.getBalance({
            address: address as `0x${string}`,
          });

          if (nativeBalance > BigInt(0)) {
            const balance = formatUnits(
              nativeBalance,
              chain.nativeCurrency.decimals
            );
            const price = await getTokenPrice(chain.nativeCurrency.symbol);
            const value = price ? parseFloat(balance) * price : undefined;

            balances.push({
              symbol: chain.nativeCurrency.symbol,
              name: chain.nativeCurrency.name,
              balance,
              decimals: chain.nativeCurrency.decimals,
              chainId: chain.id,
              price,
              value,
            });
          }

          // Fetch ERC20 token balances for this chain
          const tokens = POPULAR_TOKENS[chain.id] || [];

          await Promise.all(
            tokens.map(async (token) => {
              try {
                const balance = (await client.readContract({
                  address: token.address,
                  abi: ERC20_ABI,
                  functionName: "balanceOf",
                  args: [address as `0x${string}`],
                })) as bigint;

                if (balance > BigInt(0)) {
                  const balanceFormatted = formatUnits(balance, token.decimals);
                  const price = await getTokenPrice(token.symbol);
                  const value = price
                    ? parseFloat(balanceFormatted) * price
                    : undefined;

                  balances.push({
                    symbol: token.symbol,
                    name: token.name,
                    balance: balanceFormatted,
                    decimals: token.decimals,
                    chainId: chain.id,
                    price,
                    value,
                  });
                }
              } catch (error) {
                // Silently fail for individual tokens
                console.error(
                  `Error fetching ${token.symbol} balance on chain ${chain.id}:`,
                  error
                );
              }
            })
          );
        } catch (error) {
          console.error(
            `Error fetching balances for chain ${chain.id}:`,
            error
          );
        }
      })
    );

    return NextResponse.json(balances, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("Balance API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch balances" },
      { status: 500 }
    );
  }
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/client/trpc";
import { ArrowDown, ArrowUp, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface LiveRankTrackerProps {
  address: string;
}

/**
 * LiveRankTracker Component
 *
 * Stable real-time rank tracking with validation:
 * 1. Fetches initial rank via query (stable, one-time)
 * 2. Subscribes to rank changes for real-time updates
 * 3. Validates data to prevent wrong notifications
 * 4. Deduplicates history entries
 * 5. Only shows toasts for actual rank changes (not initial load)
 */
export function LiveRankTracker({ address }: LiveRankTrackerProps) {
  const [currentRank, setCurrentRank] = useState<number | null>(null);
  const [rankHistory, setRankHistory] = useState<
    Array<{
      rank: number;
      timestamp: Date;
      change: number;
    }>
  >([]);

  // Fetch initial rank (stable, one-time query)
  const { data: initialRankData } = trpc.leaderboard.getUserRank.useQuery(
    { address },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
    },
  );

  // Set initial rank from query (before subscription starts)
  if (initialRankData?.rank && currentRank === null) {
    setCurrentRank(initialRankData.rank);
  }

  // Subscribe to user rank changes (real-time updates)
  trpc.leaderboard.watchUserRank.useSubscription(
    { address },
    {
      onData: (data) => {
        if (!data || typeof data.rank !== "number" || data.rank <= 0) {
          console.warn("[LiveRankTracker] Invalid rank data received:", data);
          return;
        }

        // Skip initial load toast (isInitial flag from server)
        const isInitialLoad = data.isInitial;
        const change = data.previousRank - data.rank;

        if (data.rank > 0) {
          setCurrentRank(data.rank);
        }

        // Only add to history if rank actually changed (not initial load)
        if (!isInitialLoad && change !== 0) {
          // Additional validation: make sure previous and current rank are different
          if (data.previousRank === data.rank) {
            console.warn(
              "[LiveRankTracker] Rank change detected but ranks are same:",
              data,
            );
            return;
          }

          setRankHistory((prev) => {
            // Prevent duplicate entries
            if (prev.length > 0 && prev[0].rank === data.rank) {
              return prev;
            }

            return [
              {
                rank: data.rank,
                timestamp: new Date(data.timestamp),
                change,
              },
              ...prev.slice(0, 4), // Keep last 5
            ];
          });

          // Show toast notification only for actual rank changes
          if (data.movedUp && change > 0) {
            toast.success(
              `🎉 Rank Up! You moved from #${data.previousRank} to #${data.rank}`,
              {
                description: `You gained ${Math.abs(change)} position${Math.abs(change) > 1 ? "s" : ""}!`,
              },
            );
          } else if (change < 0) {
            toast.info(`Rank Update: #${data.rank}`, {
              description: `You moved from #${data.previousRank}`,
            });
          }
        }
      },
      onError: (err) => {
        console.error("[LiveRankTracker] Subscription error:", err);
      },
    },
  );

  if (currentRank === null) {
    return null;
  }

  if (rankHistory.length === 0) {
    return null;
  }

  return (
    <Card className="border-border/50 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-rose-500/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                Live Rank Tracking
              </p>
              <p className="text-xs text-muted-foreground">
                Real-time position updates
              </p>
            </div>
          </div>

          {rankHistory.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap justify-end">
              {rankHistory.slice(0, 3).map((entry, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className={`text-xs ${
                    entry.change > 0
                      ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
                      : entry.change < 0
                        ? "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
                        : "bg-gray-500/10 border-gray-500/20"
                  }`}
                >
                  {entry.change > 0 && <ArrowUp className="h-3 w-3 mr-1" />}
                  {entry.change < 0 && <ArrowDown className="h-3 w-3 mr-1" />}#
                  {entry.rank}
                  {entry.change !== 0 && (
                    <span className="ml-1 opacity-70">
                      ({entry.change > 0 ? "+" : ""}
                      {entry.change})
                    </span>
                  )}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

'use client'

import { ThemeToggle } from '@/components/ThemeToggle'
import { trpc } from '@/lib/client/trpc'
import { Activity } from 'lucide-react'
import { useState } from 'react'

/**
 * LiveLeaderboardUpdates Component - Compact Sticky Footer
 *
 * Displays real-time leaderboard updates in a minimal sticky footer
 * Shows:
 * - Flashing "LIVE" indicator
 * - Number of updates received
 * - Theme toggle
 */
export function LiveLeaderboardUpdates() {
  const [updateCount, setUpdateCount] = useState(0)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [isFlashing, setIsFlashing] = useState(false)

  // Subscribe to leaderboard updates
  trpc.leaderboard.watchLeaderboard.useSubscription(
    { limit: 10 },
    {
      onData: (data) => {
        setUpdateCount((prev) => prev + 1)
        setLastUpdate(new Date(data.timestamp))
        setIsFlashing(true)

        setTimeout(() => setIsFlashing(false), 800)
      },
      onError: (err) => {
        console.log('Subscription reconnecting...')
      },
    },
  )

  // Format time since last update
  const getTimeSinceUpdate = () => {
    if (!lastUpdate) return 'Connecting...'

    const seconds = Math.floor((Date.now() - lastUpdate.getTime()) / 1000)

    if (seconds < 5) return 'Just now'
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    return `${Math.floor(seconds / 3600)}h ago`
  }

  return (
    <div className="hidden md:block fixed bottom-0 left-0 right-0 z-50 h-[25px] border-t border-border/50 bg-background/95 backdrop-blur-lg shadow-lg">
      <div className="h-full max-w-7xl mx-auto px-4">
        <div className="h-full flex items-center justify-between gap-3">
          {/* Left: Live indicator */}
          <div className="flex items-center gap-2">
            {/* Flashing dot */}
            <div className="relative flex items-center justify-center">
              <div
                className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                  isFlashing
                    ? 'bg-green-500 shadow-lg shadow-green-500/70 scale-125'
                    : 'bg-green-500/60'
                }`}
              />
              {isFlashing && (
                <div className="absolute inset-0 h-1.5 w-1.5 rounded-full bg-green-500 animate-ping opacity-75" />
              )}
            </div>

            {/* LIVE text */}
            <span
              className={`text-[10px] font-bold tracking-wider transition-all duration-300 ${
                isFlashing
                  ? 'text-green-500 scale-105'
                  : 'text-green-600 dark:text-green-400'
              }`}
            >
              LIVE
            </span>

            {/* Separator */}
            <div className="h-2.5 w-px bg-border/50" />

            {/* Last update time */}
            <span className="text-[9px] text-muted-foreground">
              {getTimeSinceUpdate()}
            </span>
          </div>

          {/* Center: Update counter */}
          <div className="flex items-center gap-1.5">
            <Activity className="h-2.5 w-2.5 text-muted-foreground" />
            <span className="text-[9px] text-muted-foreground">Updates</span>
            <div className="flex items-center justify-center min-w-[20px] h-4 px-1 rounded bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30">
              <span className="text-[10px] font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {updateCount}
              </span>
            </div>
          </div>

          {/* Right: Theme toggle */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  )
}

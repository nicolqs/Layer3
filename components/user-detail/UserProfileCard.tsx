'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { getRankStyle, getRankTierLabel } from '@/lib/rankUtils'
import { User } from '@/lib/types'
import { ExternalLink } from 'lucide-react'

interface UserProfileCardProps {
  user: User
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  // Calculate level from XP (every 1000 XP = 1 level)
  const level = Math.floor((user.totalXP || 0) / 1000) || 1

  const rankStyle = getRankStyle(user.rank)
  const RankIcon = rankStyle.icon

  return (
    <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card via-card to-accent/10">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 animate-gradient" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_40%,transparent_100%)]" />

      <CardContent className="relative pt-3 sm:pt-4 pb-3 sm:pb-4 px-4 sm:px-6">
        {/* Mobile: 2 clear rows, Desktop: original single row */}
        <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-6 sm:justify-between">
          {/* Row 1 Mobile: Avatar + Name + Rank */}
          <div className="flex items-start gap-4 sm:flex-1">
            {/* Avatar with level ring */}
            <div className="relative group flex-shrink-0">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/50 to-purple-500/50 rounded-full blur group-hover:blur-md transition-all" />
              <Avatar className="relative h-16 w-16 sm:h-20 sm:w-20 ring-2 ring-primary/20 ring-offset-1 sm:ring-offset-2 ring-offset-background">
                <AvatarImage src={user.avatar} className="object-cover" />
                <AvatarFallback className="text-xl sm:text-2xl font-bold bg-gradient-to-br from-primary/20 to-purple-500/20">
                  {user.username || user.address.slice(2, 4).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Level badge on avatar */}
              <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-blue-500 to-purple-600 text-white text-[11px] sm:text-[10px] font-bold px-2 sm:px-1.5 py-0.5 rounded-full shadow-lg ring-2 ring-background">
                L{level}
              </div>
            </div>

            {/* Name and Address - Takes remaining space on mobile */}
            <div className="min-w-0 flex-1 space-y-1.5 sm:space-y-1.5">
              <div className="space-y-1 sm:space-y-1">
                <h1 className="text-xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent truncate">
                  {user.ensName ||
                    user.username ||
                    `${user.address.slice(0, 6)}...${user.address.slice(-4)}`}
                </h1>

                {/* Show username if ENS exists */}
                {user.ensName && user.username && (
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    @{user.username}
                  </div>
                )}

                {/* Address with view button */}
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <code className="px-2 py-1 rounded bg-muted/50 font-mono text-muted-foreground border border-border/50 hidden sm:inline truncate">
                    {user.address}
                  </code>
                  <code className="px-2 py-1 rounded bg-muted/50 font-mono text-muted-foreground border border-border/50 sm:hidden truncate text-[11px]">
                    {user.address.slice(0, 8)}...{user.address.slice(-6)}
                  </code>

                  <a
                    href={`https://etherscan.io/address/${user.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary/10 hover:bg-primary/20 text-primary text-[11px] sm:text-xs font-medium transition-all hover:scale-105 flex-shrink-0"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span className="hidden sm:inline">View</span>
                  </a>
                </div>
              </div>

              {/* Quick stats - Desktop only, moved to row 2 on mobile */}
              <div className="hidden sm:flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-semibold px-2 py-0.5"
                >
                  {user.totalXP.toLocaleString()} XP 💎
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold px-2 py-0.5"
                >
                  Level {level} ⚡
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold px-2 py-0.5"
                >
                  {user.gmStreak} GM Streak 🔥
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20 text-green-600 dark:text-green-400 text-xs font-semibold px-2 py-0.5"
                >
                  {user.nftCount} NFTs 🖼️
                </Badge>
              </div>
            </div>

            {/* Rank Badge - Desktop only, moved to row 2 on mobile */}
            <div className="hidden sm:flex flex-col items-center gap-1.5 flex-shrink-0">
              <div className="relative group">
                {/* Glow effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${rankStyle.gradient} rounded-xl blur-lg ${rankStyle.glow} opacity-40 group-hover:opacity-60 transition-opacity`}
                />

                {/* Main rank badge */}
                <div
                  className={`relative bg-gradient-to-br ${rankStyle.gradient} rounded-xl p-4 shadow-xl ring-2 ${rankStyle.ring} transform transition-all group-hover:scale-105`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <RankIcon className="h-5 w-5 text-white drop-shadow-lg" />
                    <div className="text-center">
                      <div className="text-[10px] font-bold text-white/90 uppercase tracking-wider">
                        Rank
                      </div>
                      <div className="text-3xl font-black text-white drop-shadow-lg leading-none">
                        #{user.rank}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rank tier label */}
              <Badge
                variant="secondary"
                className="bg-background/80 backdrop-blur text-[10px] font-bold px-2 py-0.5"
              >
                {getRankTierLabel(user.rank)}
              </Badge>
            </div>
          </div>

          {/* Row 2 Mobile: Stats + Rank Badge */}
          <div className="flex sm:hidden items-center justify-between gap-3 pl-20">
            {/* Quick stats - Mobile only */}
            <div className="flex items-center gap-1.5 flex-wrap flex-1">
              <Badge
                variant="outline"
                className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400 text-[11px] font-semibold px-2 py-0.5"
              >
                {user.totalXP.toLocaleString()} XP 💎
              </Badge>
              <Badge
                variant="outline"
                className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400 text-[11px] font-semibold px-2 py-0.5"
              >
                L{level} ⚡
              </Badge>
              <Badge
                variant="outline"
                className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 text-[11px] font-semibold px-2 py-0.5"
              >
                {user.gmStreak} GM 🔥
              </Badge>
              <Badge
                variant="outline"
                className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20 text-green-600 dark:text-green-400 text-[11px] font-semibold px-2 py-0.5"
              >
                {user.nftCount} NFTs 🖼️
              </Badge>
            </div>

            {/* Rank Badge - Mobile only */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className="relative group">
                {/* Glow effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${rankStyle.gradient} rounded-xl blur-md ${rankStyle.glow} opacity-40 transition-opacity`}
                />

                {/* Main rank badge */}
                <div
                  className={`relative bg-gradient-to-br ${rankStyle.gradient} rounded-xl p-3 shadow-xl ring-2 ${rankStyle.ring}`}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <RankIcon className="h-4 w-4 text-white drop-shadow-lg" />
                    <div className="text-center">
                      <div className="text-[9px] font-bold text-white/90 uppercase tracking-wider">
                        Rank
                      </div>
                      <div className="text-2xl font-black text-white drop-shadow-lg leading-none">
                        #{user.rank}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rank tier label */}
              <Badge
                variant="secondary"
                className="bg-background/80 backdrop-blur text-[9px] font-bold px-1.5 py-0.5"
              >
                {getRankTierLabel(user.rank)}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

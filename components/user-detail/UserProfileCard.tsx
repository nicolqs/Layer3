"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getRankStyle, getRankTierLabel } from "@/lib/rankUtils";
import { User } from "@/lib/types";
import { ExternalLink } from "lucide-react";

interface UserProfileCardProps {
  user: User;
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  // Calculate level from XP (every 1000 XP = 1 level)
  const level = Math.floor((user.totalXP || 0) / 1000) || 1;

  const rankStyle = getRankStyle(user.rank);
  const RankIcon = rankStyle.icon;

  return (
    <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card via-card to-accent/10 px-2">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 animate-gradient" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_40%,transparent_100%)]" />

      <CardContent className="relative pt-2 sm:pt-2 pb-2 px-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:justify-between">
          {/* Avatar and Info Section */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            {/* Avatar with level ring */}
            <div className="relative group flex-shrink-0">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/50 to-purple-500/50 rounded-full blur group-hover:blur-md transition-all" />
              <Avatar className="relative h-16 w-16 sm:h-20 sm:w-20 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                <AvatarImage src={user.avatar} className="object-cover" />
                <AvatarFallback className="text-xl sm:text-2xl font-bold bg-gradient-to-br from-primary/20 to-purple-500/20">
                  {user.username || user.address.slice(2, 4).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Level badge on avatar */}
              <div className="absolute -bottom-0.5 -right-0.5 bg-gradient-to-br from-blue-500 to-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg ring-2 ring-background">
                L{level}
              </div>
            </div>

            {/* Name and Address */}
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="space-y-0.5">
                <h1 className="text-xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent truncate">
                  {user.username ||
                    `${user.address.slice(0, 6)}...${user.address.slice(-4)}`}
                </h1>

                {/* Address with copy functionality */}
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <code className="px-2 py-1 rounded bg-muted/50 font-mono text-muted-foreground border border-border/50 hidden sm:inline truncate">
                    {user.address}
                  </code>
                  <code className="px-2 py-1 rounded bg-muted/50 font-mono text-muted-foreground border border-border/50 sm:hidden truncate text-[10px]">
                    {user.address.slice(0, 12)}...{user.address.slice(-10)}
                  </code>

                  <a
                    href={`https://etherscan.io/address/${user.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition-all hover:scale-105 flex-shrink-0"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span className="hidden sm:inline">View</span>
                  </a>
                </div>
              </div>

              {/* Quick stats */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400 text-[10px] sm:text-xs font-semibold px-2 py-0.5"
                >
                  {user.totalXP.toLocaleString()} XP 💎
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] sm:text-xs font-semibold px-2 py-0.5"
                >
                  Level {level} ⚡
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] sm:text-xs font-semibold px-2 py-0.5"
                >
                  {user.gmStreak} GM Streak 🔥
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20 text-green-600 dark:text-green-400 text-[10px] sm:text-xs font-semibold px-2 py-0.5"
                >
                  {user.nftCount} NFTs 🖼️
                </Badge>
              </div>
            </div>
          </div>

          {/* Rank Badge - Gaming Style */}
          <div className="flex flex-col items-center gap-1.5 self-start sm:self-auto flex-shrink-0">
            <div className="relative group">
              {/* Glow effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${rankStyle.gradient} rounded-xl blur-lg ${rankStyle.glow} opacity-40 group-hover:opacity-60 transition-opacity`}
              />

              {/* Main rank badge */}
              <div
                className={`relative bg-gradient-to-br ${rankStyle.gradient} rounded-xl p-3 sm:p-4 shadow-xl ring-2 ${rankStyle.ring} transform transition-all group-hover:scale-105`}
              >
                <div className="flex flex-col items-center gap-1">
                  <RankIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white drop-shadow-lg" />
                  <div className="text-center">
                    <div className="text-[9px] sm:text-[10px] font-bold text-white/90 uppercase tracking-wider">
                      Rank
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white drop-shadow-lg leading-none">
                      #{user.rank}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rank tier label */}
            <Badge
              variant="secondary"
              className="bg-background/80 backdrop-blur text-[9px] sm:text-[10px] font-bold px-2 py-0.5"
            >
              {getRankTierLabel(user.rank)}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

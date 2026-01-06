import { ThemeToggle } from '@/components/ThemeToggle';

export function LeaderboardHeader() {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
        <img 
          src="/layer3-logo.svg" 
          alt="Layer3" 
          className="h-6 sm:h-8 w-auto dark:invert-0 invert flex-shrink-0" 
        />
        <div className="space-y-0.5 sm:space-y-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <p className="text-xs sm:text-sm bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-medium hidden sm:block">
            Top performers in the Layer3 ecosystem
          </p>
          <p className="text-xs bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-medium sm:hidden">
            Top performers
          </p>
        </div>
      </div>
      <ThemeToggle />
    </div>
  );
}


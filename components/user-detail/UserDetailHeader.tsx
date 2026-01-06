import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function UserDetailHeader() {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <Link href="/" className="flex-shrink-0">
          <img 
            src="/layer3-logo.svg" 
            alt="Layer3" 
            className="h-5 sm:h-6 w-auto dark:invert-0 invert hover:opacity-80 transition-opacity" 
          />
        </Link>
        <span className="text-muted-foreground hidden sm:inline">|</span>
        <Link href="/" className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="hidden sm:inline">Back to Leaderboard</span>
          <span className="sm:hidden">Back</span>
        </Link>
      </div>
      <ThemeToggle />
    </div>
  );
}


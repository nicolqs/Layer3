import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { User } from '@/lib/types';
import { ExternalLink } from 'lucide-react';

interface UserProfileCardProps {
  user: User;
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <Card>
      <CardContent className="pt-4 sm:pt-6">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:justify-between">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <Avatar className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-xl sm:text-2xl">
                {user.ensName?.[0]?.toUpperCase() || user.address.slice(2, 4).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-3xl font-bold truncate">
                {user.ensName || `${user.address.slice(0, 6)}...${user.address.slice(-4)}`}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <span className="hidden sm:inline truncate">{user.address}</span>
                <span className="sm:hidden truncate">{user.address.slice(0, 10)}...{user.address.slice(-8)}</span>
                <a
                  href={`https://etherscan.io/address/${user.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground flex-shrink-0"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm sm:text-lg px-3 py-1.5 sm:px-4 sm:py-2 self-start sm:self-auto">
            Rank #{user.rank}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}


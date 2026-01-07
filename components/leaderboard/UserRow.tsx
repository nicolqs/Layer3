import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Layer3User } from "@/lib/types";
import Link from "next/link";
import { RankBadge } from "./RankBadge";

interface UserRowProps {
  user: Layer3User;
}

export function UserRow({ user }: UserRowProps) {
  return (
    <TableRow className="cursor-pointer hover:bg-muted/50">
      {/* Rank */}
      <TableCell className="py-3 sm:py-4">
        <div className="flex items-center justify-center">
          <RankBadge rank={user.rank} />
        </div>
      </TableCell>

      {/* User Info */}
      <TableCell className="py-3 sm:py-4">
        <Link
          href={`/user/${user.address}`}
          className="flex items-center gap-2 sm:gap-3 hover:underline"
        >
          <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
            <AvatarImage
              src={
                user.avatarCid
                  ? `https://ipfs.io/ipfs/${user.avatarCid}`
                  : undefined
              }
            />
            <AvatarFallback className="text-xs sm:text-sm">
              {user.username?.[0]?.toUpperCase() ||
                user.address.slice(2, 4).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="font-medium text-sm sm:text-base truncate">
              {user.username ||
                `${user.address.slice(0, 6)}...${user.address.slice(-4)}`}
            </div>
            {user.username && (
              <div className="text-xs text-muted-foreground hidden sm:block">
                {user.address.slice(0, 6)}...{user.address.slice(-4)}
              </div>
            )}
          </div>
        </Link>
      </TableCell>

      {/* XP */}
      <TableCell className="text-right py-3 sm:py-4">
        <Badge variant="secondary" className="text-xs sm:text-sm">
          {user.xp.toLocaleString()}
        </Badge>
      </TableCell>

      {/* Level */}
      <TableCell className="text-right py-3 sm:py-4 hidden sm:table-cell">
        <Badge variant="outline" className="text-xs sm:text-sm">
          Level {user.level}
        </Badge>
      </TableCell>

      {/* GM Streak */}
      <TableCell className="text-right py-3 sm:py-4 hidden md:table-cell">
        <Badge variant="secondary" className="text-xs sm:text-sm">
          {user.gmStreak} days
        </Badge>
      </TableCell>
    </TableRow>
  );
}

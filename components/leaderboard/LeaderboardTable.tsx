"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Layer3User } from "@/lib/types";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { UserRow } from "./UserRow";

interface LeaderboardTableProps {
  users: Layer3User[];
  isLoading?: boolean;
}

export function LeaderboardTable({ users, isLoading }: LeaderboardTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = useMemo(() => {
    return users.filter(
      (entry) =>
        entry.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.username?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [users, searchQuery]);

  return (
    <Card>
      <CardHeader className="space-y-3 sm:space-y-4">
        <div>
          <CardTitle className="text-lg sm:text-xl">Rankings</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Track the top performers and their progress
          </CardDescription>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by address or ENS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm sm:text-base"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0 sm:p-6">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 sm:w-16 text-xs sm:text-sm">
                    Rank
                  </TableHead>
                  <TableHead className="text-xs sm:text-sm">User</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm">
                    XP
                  </TableHead>
                  <TableHead className="text-right text-xs sm:text-sm hidden sm:table-cell">
                    Level
                  </TableHead>
                  <TableHead className="text-right text-xs sm:text-sm hidden md:table-cell">
                    GM Streak
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <UserRow key={user.address} user={user} />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

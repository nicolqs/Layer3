import { Trophy } from 'lucide-react'

interface RankBadgeProps {
  rank: number
}

export function RankBadge({ rank }: RankBadgeProps) {
  if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
  if (rank === 2) return <Trophy className="h-5 w-5 text-gray-400" />
  if (rank === 3) return <Trophy className="h-5 w-5 text-amber-600" />
  return (
    <span className="text-sm font-semibold text-muted-foreground">#{rank}</span>
  )
}

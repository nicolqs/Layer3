import { Crown, LucideIcon, Medal, Trophy } from 'lucide-react'

export interface RankStyle {
  gradient: string
  icon: LucideIcon
  glow: string
  ring: string
}

/**
 * Get rank styling based on user position
 * Returns gradient colors, icon, glow effect, and ring color
 */
export function getRankStyle(rank: number): RankStyle {
  if (rank === 1) {
    return {
      gradient: 'from-yellow-500 via-amber-500 to-yellow-600',
      icon: Crown,
      glow: 'shadow-yellow-500/50',
      ring: 'ring-yellow-500/30',
    }
  } else if (rank === 2) {
    return {
      gradient: 'from-gray-400 via-gray-300 to-gray-500',
      icon: Medal,
      glow: 'shadow-gray-400/50',
      ring: 'ring-gray-400/30',
    }
  } else if (rank === 3) {
    return {
      gradient: 'from-amber-600 via-orange-500 to-amber-700',
      icon: Medal,
      glow: 'shadow-amber-600/50',
      ring: 'ring-amber-600/30',
    }
  } else if (rank <= 10) {
    return {
      gradient: 'from-blue-500 via-purple-500 to-pink-500',
      icon: Trophy,
      glow: 'shadow-purple-500/50',
      ring: 'ring-purple-500/30',
    }
  } else {
    return {
      gradient: 'from-blue-400 to-cyan-400',
      icon: Trophy,
      glow: 'shadow-blue-500/30',
      ring: 'ring-blue-500/20',
    }
  }
}

/**
 * Get rank tier label based on position
 */
export function getRankTierLabel(rank: number): string {
  if (rank <= 3) return '🏆 Elite'
  if (rank <= 10) return '⭐ Top 10'
  if (rank <= 100) return '🎯 Top 100'
  return '🎮 Player'
}

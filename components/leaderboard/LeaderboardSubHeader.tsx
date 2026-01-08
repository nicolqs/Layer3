export function LeaderboardSubHeader() {
  return (
    <div className="text-center space-y-2">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent uppercase font-[family-name:var(--font-orbitron)]">
        Leaderboard
      </h1>
      <p className="text-sm sm:text-base text-muted-foreground font-medium">
        Top performers in the{' '}
        <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent font-semibold">
          Layer3 ecosystem
        </span>
      </p>
    </div>
  )
}

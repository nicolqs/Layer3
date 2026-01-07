/**
 * AddressDisplay Component
 *
 * Displays an Ethereum address with ENS resolution
 * Shows ENS name if available, otherwise shows truncated address
 */

'use client'

import { useEffect, useState } from 'react'

interface AddressDisplayProps {
  address: string
  truncate?: boolean
  truncateLength?: number
  className?: string
}

/**
 * Simple client-side ENS resolution (cached in component state)
 * For production, consider using a dedicated hook or context
 */
export function AddressDisplay({
  address,
  truncate = true,
  truncateLength = 8,
  className = '',
}: AddressDisplayProps) {
  const [displayName, setDisplayName] = useState<string>('')

  useEffect(() => {
    // For now, just show truncated address
    // ENS resolution would happen here via API or RPC
    if (truncate) {
      const start = truncateLength / 2
      const end = truncateLength / 2
      setDisplayName(`${address.slice(0, 2 + start)}...${address.slice(-end)}`)
    } else {
      setDisplayName(address)
    }

    // TODO: Implement client-side ENS resolution
    // This would call an API endpoint or use viem directly
    // fetch(`/api/ens/resolve?address=${address}`)
    //   .then(res => res.json())
    //   .then(data => {
    //     if (data.ensName) {
    //       setDisplayName(data.ensName)
    //     }
    //   })
  }, [address, truncate, truncateLength])

  return (
    <span className={className} title={address}>
      {displayName}
    </span>
  )
}


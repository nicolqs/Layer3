/**
 * ENS Resolution Service
 *
 * Resolves Ethereum addresses to ENS names with caching
 * Supports:
 * - ENS name resolution (address → name.eth)
 * - Reverse lookups (name.eth → address)
 * - In-memory caching to reduce RPC calls
 */

import { createPublicClient, http, isAddress } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'

// Create a public client for ENS lookups (Ethereum mainnet only)
const ensClient = createPublicClient({
  chain: mainnet,
  transport: http(),
})

/**
 * In-memory cache for ENS lookups
 * Key: lowercase address or ENS name
 * Value: { result: string | null, timestamp: number }
 */
interface CacheEntry {
  result: string | null
  timestamp: number
}

const ensCache = new Map<string, CacheEntry>()
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

/**
 * Check if cache entry is still valid
 */
function isCacheValid(entry: CacheEntry | undefined): boolean {
  if (!entry) return false
  return Date.now() - entry.timestamp < CACHE_DURATION
}

/**
 * Resolve an Ethereum address to its ENS name
 * @param address - Ethereum address (0x...)
 * @returns ENS name or null if not found
 *
 * @example
 * const name = await resolveAddress('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
 * // Returns: 'vitalik.eth'
 */
export async function resolveAddress(
  address: string,
): Promise<string | null> {
  if (!isAddress(address)) {
    return null
  }

  const key = address.toLowerCase()
  const cached = ensCache.get(key)

  if (isCacheValid(cached)) {
    return cached!.result
  }

  try {
    const ensName = await ensClient.getEnsName({
      address: address as `0x${string}`,
    })

    // Cache the result (even if null)
    ensCache.set(key, {
      result: ensName,
      timestamp: Date.now(),
    })

    return ensName
  } catch (error) {
    console.error(`[ENS] Failed to resolve address ${address}:`, error)
    // Cache null result to avoid repeated failures
    ensCache.set(key, {
      result: null,
      timestamp: Date.now(),
    })
    return null
  }
}

/**
 * Resolve an ENS name to its Ethereum address
 * @param name - ENS name (e.g., 'vitalik.eth')
 * @returns Ethereum address or null if not found
 *
 * @example
 * const addr = await resolveEnsName('vitalik.eth')
 * // Returns: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
 */
export async function resolveEnsName(name: string): Promise<string | null> {
  const key = name.toLowerCase()
  const cached = ensCache.get(key)

  if (isCacheValid(cached)) {
    return cached!.result
  }

  try {
    const normalizedName = normalize(name)
    const address = await ensClient.getEnsAddress({
      name: normalizedName,
    })

    // Cache the result
    ensCache.set(key, {
      result: address,
      timestamp: Date.now(),
    })

    return address
  } catch (error) {
    console.error(`[ENS] Failed to resolve name ${name}:`, error)
    // Cache null result
    ensCache.set(key, {
      result: null,
      timestamp: Date.now(),
    })
    return null
  }
}

/**
 * Get display name for an address (ENS if available, otherwise truncated)
 * @param address - Ethereum address
 * @param fallbackLength - Length of truncated address if no ENS (default: 8)
 * @returns Display name
 *
 * @example
 * const display = await getDisplayName('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
 * // Returns: 'vitalik.eth' (if ENS exists) or '0xd8dA...6045' (if not)
 */
export async function getDisplayName(
  address: string,
  fallbackLength: number = 8,
): Promise<string> {
  const ensName = await resolveAddress(address)
  if (ensName) {
    return ensName
  }

  // Fallback to truncated address
  if (!isAddress(address)) {
    return address
  }

  const start = fallbackLength / 2
  const end = fallbackLength / 2
  return `${address.slice(0, 2 + start)}...${address.slice(-end)}`
}

/**
 * Batch resolve multiple addresses to ENS names
 * @param addresses - Array of Ethereum addresses
 * @returns Map of address → ENS name (or null)
 *
 * @example
 * const names = await batchResolveAddresses(['0x...', '0x...'])
 * // Returns: Map { '0x...' => 'vitalik.eth', '0x...' => null }
 */
export async function batchResolveAddresses(
  addresses: string[],
): Promise<Map<string, string | null>> {
  const results = new Map<string, string | null>()

  // Resolve all addresses in parallel
  await Promise.all(
    addresses.map(async (address) => {
      const ensName = await resolveAddress(address)
      results.set(address.toLowerCase(), ensName)
    }),
  )

  return results
}

/**
 * Clear the ENS cache (useful for testing or manual refresh)
 */
export function clearEnsCache(): void {
  ensCache.clear()
  console.log('[ENS] Cache cleared')
}

/**
 * Get cache statistics
 */
export function getEnsCacheStats() {
  return {
    size: ensCache.size,
    entries: Array.from(ensCache.entries()).map(([key, value]) => ({
      key,
      hasResult: value.result !== null,
      age: Math.floor((Date.now() - value.timestamp) / 1000),
    })),
  }
}


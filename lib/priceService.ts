/**
 * Price Service - CoinGecko Integration
 *
 * Fetches real-time token prices from CoinGecko API with 1-minute caching.
 * Returns undefined if prices are unavailable - no mock fallback.
 * Better to show no price than wrong price.
 */

/**
 * Map token symbols to CoinGecko IDs
 */
const SYMBOL_TO_COINGECKO_ID: Record<string, string> = {
  // Major cryptocurrencies
  ETH: 'ethereum',
  WETH: 'weth',
  BTC: 'bitcoin',
  WBTC: 'wrapped-bitcoin',

  // Stablecoins
  USDC: 'usd-coin',
  USDT: 'tether',
  DAI: 'dai',
  BUSD: 'binance-usd',

  // Layer 1s
  BNB: 'binancecoin',
  MATIC: 'matic-network',
  WMATIC: 'wmatic',
  AVAX: 'avalanche-2',
  SOL: 'solana',
  CELO: 'celo',
  xDAI: 'xdai',
  FTM: 'fantom',
  DOT: 'polkadot',
  ADA: 'cardano',
  ATOM: 'cosmos',

  // Layer 2 / Tokens
  ARB: 'arbitrum',
  OP: 'optimism',
  MNT: 'mantle',
  GLMR: 'moonbeam',
  XDC: 'xdce-crowd-sale',

  // DeFi tokens
  LINK: 'chainlink',
  UNI: 'uniswap',
  AAVE: 'aave',
  CRV: 'curve-dao-token',
  SNX: 'havven',
  COMP: 'compound-governance-token',
  MKR: 'maker',
  SHIB: 'shiba-inu',
  DOGE: 'dogecoin',
}

/**
 * Price cache with 1-minute expiration
 */
interface PriceCache {
  prices: Record<string, number>
  timestamp: number
}

let priceCache: PriceCache | null = null
const CACHE_DURATION = 60 * 1000 // 1 minute in milliseconds

/**
 * Mutex to prevent concurrent API calls
 * CRITICAL: Ensures CoinGecko is called ONLY ONCE per minute
 */
let fetchInProgress = false
let lastFetchAttempt = 0
const MIN_FETCH_INTERVAL = 60 * 1000 // 1 minute - STRICT rate limit

/**
 * Check if cache is still valid
 */
function isCacheValid(): boolean {
  if (!priceCache) return false
  const now = Date.now()
  return now - priceCache.timestamp < CACHE_DURATION
}

/**
 * Fetch prices from CoinGecko API (bulk fetch)
 * @param symbols - Array of token symbols to fetch
 * @returns Record of symbol to price in USD
 */
async function fetchPricesFromCoinGecko(
  symbols: string[],
): Promise<Record<string, number>> {
  try {
    // Convert symbols to CoinGecko IDs
    const coinIds = symbols
      .map((symbol) => SYMBOL_TO_COINGECKO_ID[symbol.toUpperCase()])
      .filter(Boolean)

    if (coinIds.length === 0) {
      console.warn('No valid CoinGecko IDs found for symbols:', symbols)
      return {}
    }

    const apiKey = process.env.COINGECKO_API_KEY
    const baseUrl = apiKey
      ? 'https://pro-api.coingecko.com/api/v3'
      : 'https://api.coingecko.com/api/v3'

    const url = new URL(`${baseUrl}/simple/price`)
    url.searchParams.set('ids', coinIds.join(','))
    url.searchParams.set('vs_currencies', 'usd')
    if (apiKey) {
      url.searchParams.set('x_cg_pro_api_key', apiKey)
    }

    const fetchTime = new Date().toISOString()
    console.log(
      `[CoinGecko] 🌐 API CALL at ${fetchTime} - Fetching ${coinIds.length} tokens`,
    )

    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      console.error(
        `[CoinGecko] ❌ API error: ${response.status} ${response.statusText}`,
      )
      throw new Error(
        `CoinGecko API error: ${response.status} ${response.statusText}`,
      )
    }

    const data = await response.json()

    // Map CoinGecko IDs back to symbols
    const prices: Record<string, number> = {}
    for (const symbol of symbols) {
      const coinId = SYMBOL_TO_COINGECKO_ID[symbol.toUpperCase()]
      if (coinId && data[coinId]?.usd) {
        prices[symbol.toUpperCase()] = data[coinId].usd
      }
    }

    console.log(
      `[CoinGecko] Successfully fetched ${Object.keys(prices).length} prices`,
    )

    return prices
  } catch (error) {
    console.error('[CoinGecko] Failed to fetch prices:', error)
    return {}
  }
}

/**
 * Ensure all common tokens are in cache
 * Fetches and caches prices if cache is invalid
 *
 * CRITICAL: Uses mutex to ensure ONLY ONE API call per minute
 */
async function ensurePricesInCache(): Promise<void> {
  const now = Date.now()

  if (isCacheValid()) {
    return
  }

  // Check if another fetch is already in progress
  if (fetchInProgress) {
    console.log(
      '[PriceService] Fetch already in progress, using existing cache',
    )
    return
  }

  // Enforce strict rate limit (1 minute minimum between attempts)
  const timeSinceLastFetch = now - lastFetchAttempt
  if (timeSinceLastFetch < MIN_FETCH_INTERVAL) {
    const waitTime = Math.ceil((MIN_FETCH_INTERVAL - timeSinceLastFetch) / 1000)
    console.log(
      `[PriceService] ⏱️  Rate limit: must wait ${waitTime}s before next fetch (no prices shown until then)`,
    )
    return
  }

  // Acquire lock and fetch
  fetchInProgress = true
  lastFetchAttempt = now

  try {
    console.log(
      '[PriceService] 🔄 Fetching fresh prices from CoinGecko (once per minute)...',
    )

    const allSymbols = Object.keys(SYMBOL_TO_COINGECKO_ID)

    // Fetch from CoinGecko (SINGLE API CALL)
    const fetchedPrices = await fetchPricesFromCoinGecko(allSymbols)

    // Use only real prices from CoinGecko (no mock fallback)
    const realPrices: Record<string, number> = {}

    for (const [symbol, price] of Object.entries(fetchedPrices)) {
      if (price > 0) {
        realPrices[symbol] = price
      }
    }

    priceCache = {
      prices: realPrices,
      timestamp: Date.now(),
    }

    console.log(
      `[PriceService] ✅ Cache updated with ${Object.keys(realPrices).length} real prices (valid for 1 minute)`,
    )
  } catch (error) {
    console.error('[PriceService] ❌ Failed to update cache:', error)
    // Keep using old cache (or no prices if cache is empty)
    // No mock fallback - better to show no price than wrong price
  } finally {
    fetchInProgress = false
  }
}

/**
 * Get price for a token symbol
 * @param symbol - Token symbol (e.g., "ETH", "USDC")
 * @returns Price in USD, or undefined if not available
 */
export function getTokenPrice(symbol: string): number | undefined {
  if (isCacheValid() && priceCache) {
    return priceCache.prices[symbol.toUpperCase()]
  }

  return undefined
}

/**
 * Get prices for multiple tokens (async with cache refresh)
 * @param symbols - Array of token symbols
 * @returns Record of symbol to price
 */
export async function getTokenPricesAsync(
  symbols: string[],
): Promise<Record<string, number | undefined>> {
  await ensurePricesInCache()

  const prices: Record<string, number | undefined> = {}

  for (const symbol of symbols) {
    prices[symbol] = getTokenPrice(symbol)
  }

  return prices
}

/**
 * Get prices for multiple tokens (sync - uses cache if available)
 * @param symbols - Array of token symbols
 * @returns Record of symbol to price
 */
export function getTokenPrices(
  symbols: string[],
): Record<string, number | undefined> {
  const prices: Record<string, number | undefined> = {}

  for (const symbol of symbols) {
    prices[symbol] = getTokenPrice(symbol)
  }

  return prices
}

/**
 * Calculate token value in USD
 * @param balance - Token balance as string
 * @param symbol - Token symbol
 * @returns USD value, or undefined if price not available
 */
export function calculateTokenValue(
  balance: string,
  symbol: string,
): number | undefined {
  const price = getTokenPrice(symbol)
  if (!price) return undefined

  const amount = parseFloat(balance)
  if (isNaN(amount)) return undefined

  return amount * price
}

/**
 * Manually refresh the price cache
 * Useful for on-demand updates
 *
 * Note: Still respects rate limits (1 call per minute max)
 */
export async function refreshPriceCache(): Promise<void> {
  priceCache = null
  await ensurePricesInCache()
}

// DO NOT auto-initialize on module load to avoid rate limit issues
// Cache will be populated on first actual request

/**
 * Price Service for fetching crypto token prices
 *
 * Currently uses mock data, but designed to easily integrate
 * with real price APIs (CoinGecko, CoinMarketCap, etc.)
 */

/**
 * Mock token prices in USD
 * TODO: Replace with real API integration (CoinGecko, CoinMarketCap, etc.)
 */
const MOCK_PRICES: Record<string, number> = {
  // Major cryptocurrencies
  ETH: 2345.67,
  WETH: 2345.67,
  BTC: 43250.0,
  WBTC: 43250.0,

  // Stablecoins
  USDC: 1.0,
  USDT: 1.0,
  DAI: 1.0,
  BUSD: 1.0,

  // Layer 1s
  BNB: 315.5,
  MATIC: 0.85,
  WMATIC: 0.85,
  AVAX: 38.75,
  SOL: 98.5,
  CELO: 0.65,
  xDAI: 1.0,

  // Layer 2 / Tokens
  ARB: 1.35,
  OP: 2.15,
  MNT: 0.75,
  GLMR: 0.45,
  XDC: 0.055,

  // DeFi tokens
  LINK: 14.85,
  UNI: 6.25,
  AAVE: 95.5,
  CRV: 0.85,
  SNX: 2.45,
  COMP: 55.75,
  MKR: 1650.0,

  // Other popular tokens
  SHIB: 0.000009,
  DOGE: 0.085,
  DOT: 7.35,
  ADA: 0.52,
  ATOM: 9.85,
};

/**
 * Get price for a token symbol
 * @param symbol - Token symbol (e.g., "ETH", "USDC")
 * @returns Price in USD, or undefined if not found
 */
export function getTokenPrice(symbol: string): number | undefined {
  return MOCK_PRICES[symbol.toUpperCase()];
}

/**
 * Get prices for multiple tokens
 * @param symbols - Array of token symbols
 * @returns Record of symbol to price
 */
export function getTokenPrices(
  symbols: string[]
): Record<string, number | undefined> {
  const prices: Record<string, number | undefined> = {};

  for (const symbol of symbols) {
    prices[symbol] = getTokenPrice(symbol);
  }

  return prices;
}

/**
 * Calculate token value in USD
 * @param balance - Token balance as string
 * @param symbol - Token symbol
 * @returns USD value, or undefined if price not available
 */
export function calculateTokenValue(
  balance: string,
  symbol: string
): number | undefined {
  const price = getTokenPrice(symbol);
  if (!price) return undefined;

  const amount = parseFloat(balance);
  if (isNaN(amount)) return undefined;

  return amount * price;
}

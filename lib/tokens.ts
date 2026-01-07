export interface TokenInfo {
  address: `0x${string}`;
  symbol: string;
  name: string;
  decimals: number;
  logo: string;
}

export const POPULAR_TOKENS: Record<number, TokenInfo[]> = {
  // Ethereum Mainnet
  1: [
    {
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
      logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg",
    },
    {
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      symbol: "USDT",
      name: "Tether",
      decimals: 6,
      logo: "https://cryptologos.cc/logos/tether-usdt-logo.svg",
    },
    {
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      symbol: "DAI",
      name: "Dai Stablecoin",
      decimals: 18,
      logo: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg",
    },
    {
      address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      symbol: "WBTC",
      name: "Wrapped Bitcoin",
      decimals: 8,
      logo: "https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.svg",
    },
    {
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      symbol: "WETH",
      name: "Wrapped Ether",
      decimals: 18,
      logo: "https://cryptologos.cc/logos/ethereum-eth-logo.svg",
    },
    {
      address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
      symbol: "LINK",
      name: "Chainlink",
      decimals: 18,
      logo: "https://cryptologos.cc/logos/chainlink-link-logo.svg",
    },
    {
      address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      symbol: "UNI",
      name: "Uniswap",
      decimals: 18,
      logo: "https://cryptologos.cc/logos/uniswap-uni-logo.svg",
    },
  ],

  // Polygon
  137: [
    {
      address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
      logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg",
    },
    {
      address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      symbol: "USDT",
      name: "Tether",
      decimals: 6,
      logo: "https://cryptologos.cc/logos/tether-usdt-logo.svg",
    },
    {
      address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
      symbol: "DAI",
      name: "Dai Stablecoin",
      decimals: 18,
      logo: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg",
    },
    {
      address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      symbol: "WETH",
      name: "Wrapped Ether",
      decimals: 18,
      logo: "https://cryptologos.cc/logos/ethereum-eth-logo.svg",
    },
    {
      address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      symbol: "WMATIC",
      name: "Wrapped Matic",
      decimals: 18,
      logo: "https://cryptologos.cc/logos/polygon-matic-logo.svg",
    },
  ],

  // Arbitrum
  42161: [
    {
      address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
      logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg",
    },
    {
      address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
      symbol: "USDT",
      name: "Tether",
      decimals: 6,
      logo: "https://cryptologos.cc/logos/tether-usdt-logo.svg",
    },
    {
      address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      symbol: "DAI",
      name: "Dai Stablecoin",
      decimals: 18,
      logo: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg",
    },
    {
      address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
      symbol: "WETH",
      name: "Wrapped Ether",
      decimals: 18,
      logo: "https://cryptologos.cc/logos/ethereum-eth-logo.svg",
    },
    {
      address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
      symbol: "ARB",
      name: "Arbitrum",
      decimals: 18,
      logo: "https://cryptologos.cc/logos/arbitrum-arb-logo.svg",
    },
  ],

  // Optimism
  10: [
    {
      address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
      logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg",
    },
    {
      address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
      symbol: "USDT",
      name: "Tether",
      decimals: 6,
      logo: "https://cryptologos.cc/logos/tether-usdt-logo.svg",
    },
    {
      address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      symbol: "DAI",
      name: "Dai Stablecoin",
      decimals: 18,
      logo: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg",
    },
    {
      address: "0x4200000000000000000000000000000000000006",
      symbol: "WETH",
      name: "Wrapped Ether",
      decimals: 18,
      logo: "https://cryptologos.cc/logos/ethereum-eth-logo.svg",
    },
    {
      address: "0x4200000000000000000000000000000000000042",
      symbol: "OP",
      name: "Optimism",
      decimals: 18,
      logo: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.svg",
    },
  ],

  // Base
  8453: [
    {
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
      logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg",
    },
    {
      address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
      symbol: "DAI",
      name: "Dai Stablecoin",
      decimals: 18,
      logo: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg",
    },
    {
      address: "0x4200000000000000000000000000000000000006",
      symbol: "WETH",
      name: "Wrapped Ether",
      decimals: 18,
      logo: "https://cryptologos.cc/logos/ethereum-eth-logo.svg",
    },
  ],
};

// Helper to get token logo by symbol
export function getTokenLogo(symbol: string): string {
  const logoMap: Record<string, string> = {
    // Native currencies
    ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.svg",
    WETH: "https://cryptologos.cc/logos/ethereum-eth-logo.svg",
    MATIC: "https://cryptologos.cc/logos/polygon-matic-logo.svg",
    WMATIC: "https://cryptologos.cc/logos/polygon-matic-logo.svg",
    BNB: "https://cryptologos.cc/logos/bnb-bnb-logo.svg",
    AVAX: "https://cryptologos.cc/logos/avalanche-avax-logo.svg",
    CELO: "https://cryptologos.cc/logos/celo-celo-logo.svg",
    xDAI: "https://cryptologos.cc/logos/gnosis-gno-gno-logo.svg",
    GLMR: "https://cryptologos.cc/logos/moonbeam-glmr-logo.svg",
    MNT: "https://icons.llamao.fi/icons/chains/rsz_mantle.jpg",
    XDC: "https://icons.llamao.fi/icons/chains/rsz_xdc.jpg",

    // Stablecoins
    USDC: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg",
    USDT: "https://cryptologos.cc/logos/tether-usdt-logo.svg",
    DAI: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg",

    // DeFi tokens
    WBTC: "https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.svg",
    LINK: "https://cryptologos.cc/logos/chainlink-link-logo.svg",
    UNI: "https://cryptologos.cc/logos/uniswap-uni-logo.svg",
    ARB: "https://cryptologos.cc/logos/arbitrum-arb-logo.svg",
    OP: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.svg",
  };

  return (
    logoMap[symbol] || "https://cryptologos.cc/logos/ethereum-eth-logo.svg"
  );
}

// ERC20 ABI - only the balanceOf function we need
export const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
] as const;

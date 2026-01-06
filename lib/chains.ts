export interface ChainConfig {
  name: string;
  explorer: string;
  nativeCurrency: {
    symbol: string;
    decimals: number;
  };
  color: string; // For UI visual distinction
  logo: string; // Chain logo URL
}

export const CHAIN_EXPLORERS: Record<number, ChainConfig> = {
  1: {
    name: 'Ethereum',
    explorer: 'https://etherscan.io',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    color: '#627EEA',
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
  },
  10: {
    name: 'Optimism',
    explorer: 'https://optimistic.etherscan.io',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    color: '#FF0420',
    logo: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.svg',
  },
  56: {
    name: 'BNB Chain',
    explorer: 'https://bscscan.com',
    nativeCurrency: { symbol: 'BNB', decimals: 18 },
    color: '#F3BA2F',
    logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg',
  },
  100: {
    name: 'Gnosis',
    explorer: 'https://gnosisscan.io',
    nativeCurrency: { symbol: 'xDAI', decimals: 18 },
    color: '#04795B',
    logo: 'https://cryptologos.cc/logos/gnosis-gno-gno-logo.svg',
  },
  137: {
    name: 'Polygon',
    explorer: 'https://polygonscan.com',
    nativeCurrency: { symbol: 'MATIC', decimals: 18 },
    color: '#8247E5',
    logo: 'https://cryptologos.cc/logos/polygon-matic-logo.svg',
  },
  324: {
    name: 'zkSync Era',
    explorer: 'https://explorer.zksync.io',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    color: '#8C8DFC',
    logo: 'https://cryptologos.cc/logos/zksync-zk-logo.svg',
  },
  1284: {
    name: 'Moonbeam',
    explorer: 'https://moonscan.io',
    nativeCurrency: { symbol: 'GLMR', decimals: 18 },
    color: '#53CBC9',
    logo: 'https://cryptologos.cc/logos/moonbeam-glmr-logo.svg',
  },
  5000: {
    name: 'Mantle',
    explorer: 'https://mantlescan.xyz',
    nativeCurrency: { symbol: 'MNT', decimals: 18 },
    color: '#000000',
    logo: 'https://icons.llamao.fi/icons/chains/rsz_mantle.jpg',
  },
  8453: {
    name: 'Base',
    explorer: 'https://basescan.org',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    color: '#0052FF',
    logo: 'https://icons.llamao.fi/icons/chains/rsz_base.jpg',
  },
  42161: {
    name: 'Arbitrum',
    explorer: 'https://arbiscan.io',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    color: '#28A0F0',
    logo: 'https://cryptologos.cc/logos/arbitrum-arb-logo.svg',
  },
  42220: {
    name: 'Celo',
    explorer: 'https://celoscan.io',
    nativeCurrency: { symbol: 'CELO', decimals: 18 },
    color: '#FBCC5C',
    logo: 'https://cryptologos.cc/logos/celo-celo-logo.svg',
  },
  43114: {
    name: 'Avalanche',
    explorer: 'https://snowtrace.io',
    nativeCurrency: { symbol: 'AVAX', decimals: 18 },
    color: '#E84142',
    logo: 'https://cryptologos.cc/logos/avalanche-avax-logo.svg',
  },
  50: {
    name: 'XDC Network',
    explorer: 'https://xdcscan.io',
    nativeCurrency: { symbol: 'XDC', decimals: 18 },
    color: '#0D7EBD',
    logo: 'https://icons.llamao.fi/icons/chains/rsz_xdc.jpg',
  },
  59144: {
    name: 'Linea',
    explorer: 'https://lineascan.build',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    color: '#121212',
    logo: 'https://icons.llamao.fi/icons/chains/rsz_linea.jpg',
  },
  534352: {
    name: 'Scroll',
    explorer: 'https://scrollscan.com',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    color: '#FFEEDA',
    logo: 'https://icons.llamao.fi/icons/chains/rsz_scroll.jpg',
  },
};

export const SUPPORTED_CHAINS = Object.keys(CHAIN_EXPLORERS).map(Number).sort((a, b) => a - b);

// Helper to get chain info
export function getChainInfo(chainId: number): ChainConfig | undefined {
  return CHAIN_EXPLORERS[chainId];
}

// Group chains by category for UI
export const CHAIN_CATEGORIES = {
  'Ethereum L1': [1],
  'L2 Scaling': [10, 42161, 8453, 324, 534352, 59144, 5000],
  'Alt L1s': [56, 137, 43114, 42220, 100, 1284, 50],
};

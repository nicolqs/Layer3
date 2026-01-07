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
  // ========== Ethereum & Ethereum L2s ==========
  1: {
    name: "Ethereum",
    explorer: "https://etherscan.io",
    nativeCurrency: { symbol: "ETH", decimals: 18 },
    color: "#627EEA",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.svg",
  },
  10: {
    name: "Optimism",
    explorer: "https://optimistic.etherscan.io",
    nativeCurrency: { symbol: "ETH", decimals: 18 },
    color: "#FF0420",
    logo: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.svg",
  },
  42161: {
    name: "Arbitrum One",
    explorer: "https://arbiscan.io",
    nativeCurrency: { symbol: "ETH", decimals: 18 },
    color: "#28A0F0",
    logo: "https://cryptologos.cc/logos/arbitrum-arb-logo.svg",
  },
  42170: {
    name: "Arbitrum Nova",
    explorer: "https://nova.arbiscan.io",
    nativeCurrency: { symbol: "ETH", decimals: 18 },
    color: "#FFA500",
    logo: "https://icons.llamao.fi/icons/chains/rsz_arbitrum_nova.jpg",
  },
  8453: {
    name: "Base",
    explorer: "https://basescan.org",
    nativeCurrency: { symbol: "ETH", decimals: 18 },
    color: "#0052FF",
    logo: "https://icons.llamao.fi/icons/chains/rsz_base.jpg",
  },
  81457: {
    name: "Blast",
    explorer: "https://blastscan.io",
    nativeCurrency: { symbol: "ETH", decimals: 18 },
    color: "#FCFC03",
    logo: "https://icons.llamao.fi/icons/chains/rsz_blast.jpg",
  },
  59144: {
    name: "Linea",
    explorer: "https://lineascan.build",
    nativeCurrency: { symbol: "ETH", decimals: 18 },
    color: "#121212",
    logo: "https://icons.llamao.fi/icons/chains/rsz_linea.jpg",
  },
  7777777: {
    name: "Zora",
    explorer: "https://explorer.zora.energy",
    nativeCurrency: { symbol: "ETH", decimals: 18 },
    color: "#000000",
    logo: "https://icons.llamao.fi/icons/chains/rsz_zora.jpg",
  },
  534352: {
    name: "Scroll",
    explorer: "https://scrollscan.com",
    nativeCurrency: { symbol: "ETH", decimals: 18 },
    color: "#FFEEDA",
    logo: "https://icons.llamao.fi/icons/chains/rsz_scroll.jpg",
  },
  167000: {
    name: "Taiko",
    explorer: "https://taikoscan.io",
    nativeCurrency: { symbol: "ETH", decimals: 18 },
    color: "#E81899",
    logo: "https://icons.llamao.fi/icons/chains/rsz_taiko.jpg",
  },
  5000: {
    name: "Mantle",
    explorer: "https://mantlescan.xyz",
    nativeCurrency: { symbol: "MNT", decimals: 18 },
    color: "#000000",
    logo: "https://icons.llamao.fi/icons/chains/rsz_mantle.jpg",
  },
  1088: {
    name: "Metis",
    explorer: "https://explorer.metis.io",
    nativeCurrency: { symbol: "METIS", decimals: 18 },
    color: "#00DACC",
    logo: "https://icons.llamao.fi/icons/chains/rsz_metis.jpg",
  },
  34443: {
    name: "Mode",
    explorer: "https://modescan.io",
    nativeCurrency: { symbol: "ETH", decimals: 18 },
    color: "#DFFE00",
    logo: "https://icons.llamao.fi/icons/chains/rsz_mode.jpg",
  },
  690: {
    name: "Redstone",
    explorer: "https://explorer.redstone.xyz",
    nativeCurrency: { symbol: "ETH", decimals: 18 },
    color: "#FF0000",
    logo: "https://icons.llamao.fi/icons/chains/rsz_redstone.jpg",
  },
  7560: {
    name: "Cyber",
    explorer: "https://cyberscan.co",
    nativeCurrency: { symbol: "ETH", decimals: 18 },
    color: "#0CFF00",
    logo: "https://icons.llamao.fi/icons/chains/rsz_cyber.jpg",
  },
  252: {
    name: "Fraxtal",
    explorer: "https://fraxscan.com",
    nativeCurrency: { symbol: "frxETH", decimals: 18 },
    color: "#000000",
    logo: "https://icons.llamao.fi/icons/chains/rsz_fraxtal.jpg",
  },
  255: {
    name: "Kroma",
    explorer: "https://kromascan.com",
    nativeCurrency: { symbol: "ETH", decimals: 18 },
    color: "#00C58E",
    logo: "https://icons.llamao.fi/icons/chains/rsz_kroma.jpg",
  },
  957: {
    name: "Lyra",
    explorer: "https://lyrascan.io",
    nativeCurrency: { symbol: "ETH", decimals: 18 },
    color: "#2C2C5C",
    logo: "https://icons.llamao.fi/icons/chains/rsz_lyra.jpg",
  },
  5151: {
    name: "Loot",
    explorer: "https://explorer.lootchain.com",
    nativeCurrency: { symbol: "AGLD", decimals: 18 },
    color: "#000000",
    logo: "https://icons.llamao.fi/icons/chains/rsz_loot.jpg",
  },

  // ========== Major EVM L1s / Sidechains ==========
  56: {
    name: "BNB Chain",
    explorer: "https://bscscan.com",
    nativeCurrency: { symbol: "BNB", decimals: 18 },
    color: "#F3BA2F",
    logo: "https://cryptologos.cc/logos/bnb-bnb-logo.svg",
  },
  137: {
    name: "Polygon",
    explorer: "https://polygonscan.com",
    nativeCurrency: { symbol: "MATIC", decimals: 18 },
    color: "#8247E5",
    logo: "https://cryptologos.cc/logos/polygon-matic-logo.svg",
  },
  1101: {
    name: "Polygon zkEVM",
    explorer: "https://zkevm.polygonscan.com",
    nativeCurrency: { symbol: "ETH", decimals: 18 },
    color: "#7B3FE4",
    logo: "https://icons.llamao.fi/icons/chains/rsz_polygon_zkevm.jpg",
  },
  43114: {
    name: "Avalanche",
    explorer: "https://snowtrace.io",
    nativeCurrency: { symbol: "AVAX", decimals: 18 },
    color: "#E84142",
    logo: "https://cryptologos.cc/logos/avalanche-avax-logo.svg",
  },
  250: {
    name: "Fantom",
    explorer: "https://ftmscan.com",
    nativeCurrency: { symbol: "FTM", decimals: 18 },
    color: "#1969FF",
    logo: "https://cryptologos.cc/logos/fantom-ftm-logo.svg",
  },
  1284: {
    name: "Moonbeam",
    explorer: "https://moonscan.io",
    nativeCurrency: { symbol: "GLMR", decimals: 18 },
    color: "#53CBC9",
    logo: "https://cryptologos.cc/logos/moonbeam-glmr-logo.svg",
  },
  1285: {
    name: "Moonriver",
    explorer: "https://moonriver.moonscan.io",
    nativeCurrency: { symbol: "MOVR", decimals: 18 },
    color: "#F2B705",
    logo: "https://icons.llamao.fi/icons/chains/rsz_moonriver.jpg",
  },
  25: {
    name: "Cronos",
    explorer: "https://cronoscan.com",
    nativeCurrency: { symbol: "CRO", decimals: 18 },
    color: "#002D74",
    logo: "https://cryptologos.cc/logos/cronos-cro-logo.svg",
  },
  100: {
    name: "Gnosis",
    explorer: "https://gnosisscan.io",
    nativeCurrency: { symbol: "xDAI", decimals: 18 },
    color: "#04795B",
    logo: "https://cryptologos.cc/logos/gnosis-gno-gno-logo.svg",
  },
  42220: {
    name: "Celo",
    explorer: "https://celoscan.io",
    nativeCurrency: { symbol: "CELO", decimals: 18 },
    color: "#FBCC5C",
    logo: "https://cryptologos.cc/logos/celo-celo-logo.svg",
  },
  1313161554: {
    name: "Aurora",
    explorer: "https://aurorascan.dev",
    nativeCurrency: { symbol: "ETH", decimals: 18 },
    color: "#70D44B",
    logo: "https://icons.llamao.fi/icons/chains/rsz_aurora.jpg",
  },
  1666600000: {
    name: "Harmony",
    explorer: "https://explorer.harmony.one",
    nativeCurrency: { symbol: "ONE", decimals: 18 },
    color: "#00ADE8",
    logo: "https://cryptologos.cc/logos/harmony-one-logo.svg",
  },
  66: {
    name: "OKX Chain",
    explorer: "https://www.oklink.com/okc",
    nativeCurrency: { symbol: "OKT", decimals: 18 },
    color: "#000000",
    logo: "https://icons.llamao.fi/icons/chains/rsz_okc.jpg",
  },

  // ========== zk / App-Specific / Emerging Chains ==========
  324: {
    name: "zkSync Era",
    explorer: "https://explorer.zksync.io",
    nativeCurrency: { symbol: "ETH", decimals: 18 },
    color: "#8C8DFC",
    logo: "https://cryptologos.cc/logos/zksync-zk-logo.svg",
  },
  109: {
    name: "Shibarium",
    explorer: "https://shibariumscan.io",
    nativeCurrency: { symbol: "BONE", decimals: 18 },
    color: "#FFA409",
    logo: "https://icons.llamao.fi/icons/chains/rsz_shibarium.jpg",
  },
  199: {
    name: "BitTorrent",
    explorer: "https://bttcscan.com",
    nativeCurrency: { symbol: "BTT", decimals: 18 },
    color: "#000000",
    logo: "https://icons.llamao.fi/icons/chains/rsz_bttc.jpg",
  },
  61: {
    name: "Ethereum Classic",
    explorer: "https://blockscout.com/etc/mainnet",
    nativeCurrency: { symbol: "ETC", decimals: 18 },
    color: "#328332",
    logo: "https://cryptologos.cc/logos/ethereum-classic-etc-logo.svg",
  },
  128: {
    name: "HECO",
    explorer: "https://hecoinfo.com",
    nativeCurrency: { symbol: "HT", decimals: 18 },
    color: "#01943F",
    logo: "https://icons.llamao.fi/icons/chains/rsz_heco.jpg",
  },
  11297108109: {
    name: "Palm",
    explorer: "https://explorer.palm.io",
    nativeCurrency: { symbol: "PALM", decimals: 18 },
    color: "#1A1A1A",
    logo: "https://icons.llamao.fi/icons/chains/rsz_palm.jpg",
  },
  30: {
    name: "Rootstock",
    explorer: "https://explorer.rsk.co",
    nativeCurrency: { symbol: "RBTC", decimals: 18 },
    color: "#00A651",
    logo: "https://icons.llamao.fi/icons/chains/rsz_rsk.jpg",
  },
  42262: {
    name: "Oasis Emerald",
    explorer: "https://explorer.emerald.oasis.dev",
    nativeCurrency: { symbol: "ROSE", decimals: 18 },
    color: "#0092F6",
    logo: "https://icons.llamao.fi/icons/chains/rsz_oasis.jpg",
  },

  // Legacy chains for backward compatibility
  50: {
    name: "XDC Network",
    explorer: "https://xdcscan.io",
    nativeCurrency: { symbol: "XDC", decimals: 18 },
    color: "#0D7EBD",
    logo: "https://icons.llamao.fi/icons/chains/rsz_xdc.jpg",
  },
};

export const SUPPORTED_CHAINS = Object.keys(CHAIN_EXPLORERS)
  .map(Number)
  .sort((a, b) => a - b);

// Popular chains for quick filtering in UI (most commonly used chains)
export const POPULAR_CHAINS = [
  1, // Ethereum
  10, // Optimism
  56, // BNB Chain
  137, // Polygon
  8453, // Base
  42161, // Arbitrum One
  43114, // Avalanche
  250, // Fantom
] as const;

// Helper to get chain info
export function getChainInfo(chainId: number): ChainConfig | undefined {
  return CHAIN_EXPLORERS[chainId];
}

// Group chains by category for UI
export const CHAIN_CATEGORIES = {
  "Ethereum & L2s": [
    1, 10, 42161, 42170, 8453, 81457, 59144, 7777777, 534352, 167000, 5000,
    1088, 34443, 690, 7560, 252, 255, 957, 5151,
  ],
  "Major L1s": [56, 137, 1101, 43114, 250, 1284, 1285, 25, 100, 42220],
  "Advanced & zk": [
    324, 1313161554, 1666600000, 66, 109, 199, 61, 128, 11297108109, 30, 42262,
    50,
  ],
};

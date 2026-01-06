export interface User {
  address: string;
  ensName?: string;
  avatar?: string;
  totalXP: number;
  rank: number;
  questsCompleted: number;
  nftCount: number;
  joinedAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  address: string;
  ensName?: string;
  avatar?: string;
  xp: number;
  questsCompleted: number;
  change?: number; // rank change
}

export interface Layer3User {
  rank: number;
  address: string;
  avatarCid?: string;
  username?: string;
  gmStreak: number;
  xp: number;
  level: number;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  chainId: number;
  status: 'success' | 'failed';
}

export interface EtherscanTransaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  methodId: string;
  functionName: string;
}

export interface MultiChainTransaction extends EtherscanTransaction {
  chainId: number;
  chainName: string;
}

export interface TransactionStats {
  totalTransactions: number;
  totalVolume: string;
  successRate: number;
  totalGasFees: string;
}

export interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  chainId: number;
  price?: number;
  value?: number;
  logo?: string;
}

export interface NFTCollection {
  name: string;
  slug?: string;
  externalUrl?: string;
  bannerImageUrl?: string;
}

export interface NFTImage {
  cachedUrl?: string;
  thumbnailUrl?: string;
  pngUrl?: string;
  contentType?: string;
  size?: number;
}

export interface NFTMetadata {
  name?: string;
  description?: string;
  image?: string;
  external_url?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
}

export interface AlchemyNFT {
  tokenId: string;
  tokenType: string;
  name?: string;
  description?: string;
  image: NFTImage;
  raw: {
    metadata: NFTMetadata;
    tokenUri?: string;
  };
  collection?: NFTCollection;
  mint?: {
    mintAddress?: string;
    blockNumber?: number;
    timestamp?: string;
  };
  contract: {
    address: string;
    name?: string;
    symbol?: string;
    totalSupply?: string;
  };
}

export interface NFT {
  tokenId: string;
  name: string;
  description?: string;
  image: string;
  collection: string | NFTCollection;
  chainId: number;
  contractAddress: string;
}

export interface UserStats {
  totalTransactions: number;
  totalVolume: string;
  chainsActive: number;
  firstTransaction?: number;
  lastTransaction?: number;
}


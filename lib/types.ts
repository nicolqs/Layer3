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

export interface NFT {
  tokenId: string;
  name: string;
  description?: string;
  image: string;
  collection: string;
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


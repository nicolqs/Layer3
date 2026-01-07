import { createPublicClient, http } from "viem";
import { mainnet, polygon, arbitrum, optimism, base } from "viem/chains";

export const chains = [mainnet, polygon, arbitrum, optimism, base] as const;

export type SupportedChain = (typeof chains)[number];

export const chainClients = {
  [mainnet.id]: createPublicClient({
    chain: mainnet,
    transport: http(),
  }),
  [polygon.id]: createPublicClient({
    chain: polygon,
    transport: http(),
  }),
  [arbitrum.id]: createPublicClient({
    chain: arbitrum,
    transport: http(),
  }),
  [optimism.id]: createPublicClient({
    chain: optimism,
    transport: http(),
  }),
  [base.id]: createPublicClient({
    chain: base,
    transport: http(),
  }),
};

export const getChainClient = (chainId: number) => {
  return chainClients[chainId as keyof typeof chainClients];
};

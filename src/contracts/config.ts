export const CONTRACT_ADDRESSES = {
  BLOCK_ESTATE_FACTORY: process.env.NEXT_PUBLIC_FACTORY_ADDRESS ?? '',
} as const;

export const SUPPORTED_CHAINS = {
  BSC_TESTNET: 97,
} as const;

export const CHAIN_NAMES = {
  [SUPPORTED_CHAINS.BSC_TESTNET]: 'BSC Testnet',
} as const;

export const RPC_URLS = {
  [SUPPORTED_CHAINS.BSC_TESTNET]: 'https://bsc-testnet.blockpi.network/v1/rpc/private',
} as const;

export const BLOCK_EXPLORERS = {
  [SUPPORTED_CHAINS.BSC_TESTNET]: 'https://testnet.bscscan.com',
} as const;

export const DEFAULT_CHAIN_ID = SUPPORTED_CHAINS.BSC_TESTNET;

// Helper type for chain IDs
export type SupportedChainId = (typeof SUPPORTED_CHAINS)[keyof typeof SUPPORTED_CHAINS];

// Helper function to check if a chain ID is supported
export function isSupportedChainId(chainId: number): chainId is SupportedChainId {
  return Object.values(SUPPORTED_CHAINS).includes(chainId as SupportedChainId);
}

// Helper function to get chain name
export function getChainName(chainId: SupportedChainId): string {
  return CHAIN_NAMES[chainId];
}

// Helper function to get RPC URL
export function getRpcUrl(chainId: SupportedChainId): string {
  return RPC_URLS[chainId];
}

// Helper function to get block explorer URL
export function getBlockExplorerUrl(chainId: SupportedChainId): string {
  return BLOCK_EXPLORERS[chainId];
}

// Helper function to get transaction URL
export function getTransactionUrl(chainId: SupportedChainId, txHash: string): string {
  return `${BLOCK_EXPLORERS[chainId]}/tx/${txHash}`;
}

// Helper function to get address URL
export function getAddressUrl(chainId: SupportedChainId, address: string): string {
  return `${BLOCK_EXPLORERS[chainId]}/address/${address}`;
}

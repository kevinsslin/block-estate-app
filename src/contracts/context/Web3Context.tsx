import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { PublicClient, WalletClient } from 'viem';
import { useAccount, useChainId, usePublicClient, useSwitchChain, useWalletClient } from 'wagmi';

import { DEFAULT_CHAIN_ID, getChainName, isSupportedChainId } from '../config';

interface Web3ContextType {
  // Connection state
  isConnected: boolean;
  isWrongNetwork: boolean;

  // Chain info
  chainId: number | undefined;
  chainName: string | undefined;

  // Account info
  address: `0x${string}` | undefined;

  // Clients
  publicClient: PublicClient | null;
  walletClient: WalletClient | null;

  // Actions
  switchToDefaultChain: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType>({
  // Connection state
  isConnected: false,
  isWrongNetwork: false,

  // Chain info
  chainId: undefined,
  chainName: undefined,

  // Account info
  address: undefined,

  // Clients
  publicClient: null,
  walletClient: null,

  // Actions
  switchToDefaultChain: async () => {},
});

export function Web3Provider({ children }: { children: ReactNode }) {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { switchChain } = useSwitchChain();

  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  useEffect(() => {
    if (!chainId) return;
    setIsWrongNetwork(!isSupportedChainId(chainId));
  }, [chainId]);

  const chainName = chainId && isSupportedChainId(chainId) ? getChainName(chainId) : undefined;

  const switchToDefaultChain = async () => {
    if (!switchChain) return;
    try {
      await switchChain({
        chainId: DEFAULT_CHAIN_ID,
      });
    } catch (error) {
      console.error('Failed to switch chain:', error);
      throw error; // Re-throw to let the caller handle it
    }
  };

  return (
    <Web3Context.Provider
      value={{
        // Connection state
        isConnected,
        isWrongNetwork,

        // Chain info
        chainId,
        chainName,

        // Account info
        address,

        // Clients
        publicClient: publicClient ?? null,
        walletClient: walletClient ?? null,

        // Actions
        switchToDefaultChain,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}

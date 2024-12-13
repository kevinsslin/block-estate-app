'use client';

import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { bscTestnet } from 'wagmi/chains';

import '@rainbow-me/rainbowkit/styles.css';

interface ProvidersProps {
  children: React.ReactElement | React.ReactElement[];
}

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: 'BlockEstate',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? '',
  chains: [bscTestnet],
});

export function Providers({ children }: ProvidersProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

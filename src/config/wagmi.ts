import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { bscTestnet } from 'wagmi/chains';

import '@rainbow-me/rainbowkit/styles.css';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (!projectId) {
  console.warn('Missing NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID');
}

export const config = getDefaultConfig({
  appName: 'BlockEstate',
  projectId: projectId ?? '',
  chains: [bscTestnet],
  ssr: true,
});

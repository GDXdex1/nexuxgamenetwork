'use client';

import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { registerSlushWallet } from '@mysten/slush-wallet';
import { useWalletSession } from '@/hooks/useWalletSession';
import { Toaster } from '@/components/ui/sonner';
import { SessionIndicator } from '@/components/SessionIndicator';
import '@mysten/dapp-kit/dist/index.css';

// Register ONLY Slush Wallet
const slushWallet = registerSlushWallet('Slush');

// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
  mainnet: { url: getFullnodeUrl('mainnet') },
  testnet: { url: getFullnodeUrl('testnet') },
  devnet: { url: getFullnodeUrl('devnet') },
  localnet: { url: getFullnodeUrl('localnet') },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect slushWallet={{ name: 'Jablix Arena' }}>
          <SessionManager>
            {children}
            <SessionIndicator />
            <Toaster position="top-center" richColors closeButton />
          </SessionManager>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

/**
 * Internal component to manage wallet session
 * Must be inside WalletProvider to access wallet hooks
 */
function SessionManager({ children }: { children: React.ReactNode }) {
  useWalletSession();
  return <>{children}</>;
}

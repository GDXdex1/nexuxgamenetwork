'use client';

import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { useState } from 'react';
import { toast } from 'sonner';

/**
 * Session Indicator - Wallet Button Fixed Position
 * Shows wallet connection button in bottom-right corner
 * Session timeout (30 min) runs in background via useWalletSession hook
 */

export function SessionIndicator() {
  const account = useCurrentAccount();
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopyAddress = async (): Promise<void> => {
    if (!account) return;

    try {
      await navigator.clipboard.writeText(account.address);
      setIsCopied(true);
      toast.success('Address copied to clipboard!');
      
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error: unknown) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy address');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-slate-900/95 backdrop-blur-sm border-2 border-purple-500/50 rounded-xl px-4 py-3 shadow-2xl hover:shadow-purple-500/30 transition-all">
        {account ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-slate-400 font-semibold">Connected</span>
            </div>
            <div 
              onClick={handleCopyAddress}
              className="flex items-center gap-2 cursor-pointer group hover:bg-slate-800/50 px-2 py-1 rounded-lg transition-all"
              title="Click to copy address"
            >
              <span className="text-sm font-mono text-white">
                {account.address.slice(0, 6)}...{account.address.slice(-4)}
              </span>
              <button
                className="text-slate-400 hover:text-purple-400 transition-colors"
                aria-label="Copy wallet address"
              >
                {isCopied ? (
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
            <ConnectButton />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <span className="text-xs text-slate-400 font-semibold">Connect Wallet</span>
            <ConnectButton />
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useCurrentAccount } from '@mysten/dapp-kit';
import { useJxcBalance, useUserJabs } from '@/hooks/useSuiData';
import { formatJxcBalance, getAddressExplorerLink, COIN_TYPES } from '@/config/suiConfig';
import { useState } from 'react';
import { CheckCircle2, Copy, ExternalLink, Loader2, TrendingUp, Eye, Send, ArrowLeftRight } from 'lucide-react';
import WalletJabsList from './WalletJabsList';
import TransferManager from './TransferManager';

interface WalletProps {
  onBackToMain: () => void;
}

export default function Wallet({ onBackToMain }: WalletProps) {
  const account = useCurrentAccount();
  const jxcBalanceQuery = useJxcBalance();
  const jabsQuery = useUserJabs();
  const [copied, setCopied] = useState(false);
  const [showJabsList, setShowJabsList] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);

  // Format address for display (shortened)
  const shortAddress = account?.address 
    ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}`
    : '';

  // Copy address to clipboard
  const handleCopyAddress = async () => {
    if (account?.address) {
      await navigator.clipboard.writeText(account.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // JXC Balance
  const jxcBalance = jxcBalanceQuery.data?.totalBalance || 0n;
  const jxcFormatted = formatJxcBalance(jxcBalance);

  // Jabs Count
  const jabsCount = jabsQuery.data?.length || 0;
  const elementalCount = jabsQuery.data?.filter(j => j.type === 'elemental').length || 0;
  const specialCount = jabsQuery.data?.filter(j => j.type === 'special').length || 0;

  // Show Jabs list if requested
  if (showJabsList) {
    return <WalletJabsList onBackToWallet={() => setShowJabsList(false)} />;
  }

  // Show Transfer Manager if requested
  if (showTransfer) {
    const scannedJabs = (jabsQuery.data || []).map(jab => ({
      id: `jablix_${jab.type_id}`,
      objectId: jab.id,
      type: jab.type,
      name: jab.name,
      phase: jab.phase,
      imageUrl: jab.image,
    }));

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 p-4 md:p-8 pt-16 md:pt-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => setShowTransfer(false)}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              ← Back to Wallet
            </button>
          </div>
          <TransferManager 
            jablixList={scannedJabs}
            onTransferComplete={() => {
              jxcBalanceQuery.refetch();
              jabsQuery.refetch();
            }}
          />
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 p-4 md:p-8 pt-16 md:pt-8 flex items-center justify-center">
        <div className="max-w-md bg-gradient-to-br from-purple-900/90 to-pink-900/90 border-4 border-pink-500/50 rounded-3xl p-8 text-center backdrop-blur-sm shadow-2xl">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300 mb-4">
            Wallet Locked
          </h2>
          <p className="text-pink-200 mb-6">
            Connect your Sui wallet to access your inventory, JXC balance, and transfer assets.
          </p>
          <button
            onClick={onBackToMain}
            className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg"
          >
            ← Back to Main Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 p-4 md:p-8 pt-16 md:pt-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Banner */}
        <div className="mb-6 relative rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/6a31ada0-0910-47a2-b8a7-fb2de97048b4-jG3gX9tWmrrESJpHzXgRARh8djhnBz"
            alt="Wallet Banner"
            className="w-full h-40 md:h-56 lg:h-72 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <button
            onClick={onBackToMain}
            className="absolute top-4 right-4 bg-black/50 backdrop-blur-md hover:bg-black/70 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg border-2 border-white/20"
          >
            ← Back
          </button>
          <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6">
            <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-lg">
              💰 My Wallet
            </h1>
          </div>
        </div>

        {/* Wallet Address Card */}
        <div className="mb-6 bg-gradient-to-br from-purple-900/90 to-pink-900/90 border-4 border-pink-500/50 rounded-3xl p-4 md:p-6 shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs md:text-sm text-pink-300 mb-1">Connected Wallet</p>
              <button
                onClick={handleCopyAddress}
                className="flex items-center gap-2 text-lg md:text-xl font-mono text-white hover:text-pink-200 transition-colors group"
              >
                {shortAddress}
                {copied ? (
                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0" />
                ) : (
                  <Copy className="w-4 h-4 md:w-5 md:h-5 opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                )}
              </button>
              {copied && (
                <p className="text-xs text-green-400 mt-1">Address copied!</p>
              )}
            </div>
            <a
              href={getAddressExplorerLink(account.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden md:inline">View on Explorer</span>
              <span className="md:hidden">Explorer</span>
            </a>
          </div>
        </div>

        {/* Balance Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
          {/* JXC Balance Card */}
          <div className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 border-4 border-pink-500/50 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-xs md:text-sm text-pink-300 mb-1">JXC Balance</p>
                <h2 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300 break-all">
                  {jxcFormatted}
                </h2>
              </div>
              <div className="bg-gradient-to-br from-pink-500/20 to-orange-500/20 p-2 md:p-3 rounded-xl border-2 border-pink-400/30 flex-shrink-0">
                <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-pink-300" />
              </div>
            </div>
            {jxcBalanceQuery.isLoading && (
              <div className="flex items-center gap-2 text-pink-300 mb-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                <p className="text-sm">Loading...</p>
              </div>
            )}
            <div className="pt-4 border-t border-pink-500/30">
              <p className="text-xs text-pink-300 mb-3">
                Official currency of Jablix Arena
              </p>
              <a
                href={`https://suiscan.xyz/testnet/coin/${COIN_TYPES.JXC}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-pink-300 hover:text-pink-200 transition-colors bg-pink-500/10 hover:bg-pink-500/20 px-3 py-2 rounded-lg border border-pink-500/30"
              >
                <ExternalLink className="w-3 h-3" />
                View Token Contract
              </a>
            </div>
          </div>

          {/* Jabs Collection Card */}
          <div className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 border-4 border-pink-500/50 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-xs md:text-sm text-pink-300 mb-1">Jabs Collection</p>
                <h2 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300">
                  {jabsCount} Jabs
                </h2>
              </div>
              <div className="bg-gradient-to-br from-orange-500/20 to-pink-500/20 p-2 md:p-3 rounded-xl border-2 border-orange-400/30 flex-shrink-0">
                <span className="text-3xl md:text-4xl">🎴</span>
              </div>
            </div>
            {jabsQuery.isLoading && (
              <div className="flex items-center gap-2 text-pink-300 mb-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                <p className="text-sm">Loading...</p>
              </div>
            )}
            <div className="pt-4 border-t border-pink-500/30 flex gap-4 mb-4">
              <div>
                <p className="text-xl md:text-2xl font-bold text-pink-200">{elementalCount}</p>
                <p className="text-xs text-pink-300">Elementals</p>
              </div>
              <div className="border-l border-pink-500/30 pl-4">
                <p className="text-xl md:text-2xl font-bold text-orange-200">{specialCount}</p>
                <p className="text-xs text-orange-300">Specials</p>
              </div>
            </div>
            <button
              onClick={() => setShowJabsList(true)}
              disabled={jabsCount === 0}
              className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-2 md:py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Eye className="w-4 h-4 md:w-5 md:h-5" />
              View All Jabs
            </button>
          </div>
        </div>

        {/* Transfer Assets Section */}
        <div className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 border-4 border-pink-500/50 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-sm mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-3 rounded-xl border-2 border-cyan-400/30">
              <ArrowLeftRight className="w-6 h-6 md:w-8 md:h-8 text-cyan-300" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                Transfer Assets
              </h2>
              <p className="text-xs md:text-sm text-cyan-300/80">
                Send JXC tokens, Jabs NFTs, or Gyms to other addresses
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowTransfer(true)}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 md:py-4 px-4 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
          >
            <Send className="w-5 h-5" />
            Open Transfer Manager
          </button>
        </div>

        {/* Info Footer */}
        <div className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 border-4 border-pink-500/50 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-sm">
          <div className="text-center">
            <p className="text-4xl md:text-5xl mb-3">🌐</p>
            <p className="text-lg md:text-xl font-bold text-pink-200 mb-2">
              Powered by Sui Blockchain
            </p>
            <p className="text-xs md:text-sm text-pink-300">
              All transactions are verified on-chain for maximum security and transparency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useCurrentAccount } from '@mysten/dapp-kit';
import { useJxcBalance, useUserJabs } from '@/hooks/useSuiData';
import { formatJxcBalance, getAddressExplorerLink, COIN_TYPES } from '@/config/suiConfig';
import { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
  TrendingUp,
  Eye,
  Send,
  ArrowLeftRight,
  ArrowLeft,
  Shield,
  Zap,
  Sword,
  Search,
  Lock,
  ChevronRight,
  Coins,
  LayoutDashboard
} from 'lucide-react';
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
      <div className="min-h-screen bg-[#010101] text-white p-4 md:p-8 relative overflow-hidden font-sans">
        <div className="absolute inset-0 tech-bg-grid opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-8">
            <button
              onClick={() => setShowTransfer(false)}
              className="group relative p-4 bg-white/5 border border-white/10 hover:border-primary transition-all rounded-tr-xl flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
              <span className="ml-2 text-xs font-black uppercase tracking-widest hidden md:inline">Back_To_Vault</span>
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
      <div className="min-h-screen bg-[#010101] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 tech-bg-grid opacity-10 pointer-events-none" />
        <div className="max-w-md w-full bg-black/40 border-2 border-red-500/20 rounded-tr-[3rem] p-12 text-center backdrop-blur-xl relative z-10">
          <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse text-red-500">
            <Lock className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase font-heading text-white mb-4">
            AUTH_REQUIRED
          </h2>
          <p className="text-xs text-white/40 uppercase tracking-widest mb-8 leading-relaxed">
            "Neural link with decentralized storage not established. Connect Sui wallet to proceed."
          </p>
          <button
            onClick={onBackToMain}
            className="w-full py-4 bg-white/5 border border-white/10 text-white hover:border-primary hover:text-primary font-black uppercase text-xs tracking-[0.3em] transition-all rounded-tr-xl"
          >
            Terminal_Exit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010101] text-white p-4 md:p-8 relative overflow-hidden font-sans">
      {/* Tech Grid Background */}
      <div className="absolute inset-0 tech-bg-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Navigation HUD */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6 border-b border-primary/20 pb-8">
          <div className="flex items-center gap-6">
            <button
              onClick={onBackToMain}
              className="group relative p-4 bg-white/5 border border-white/10 hover:border-primary transition-all rounded-tr-xl flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
            </button>
            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-[1px] bg-primary/40" />
                <span className="text-[10px] font-black tracking-[0.3em] text-primary/60 uppercase">Asset_Inventory</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase font-heading">
                NEURAL <span className="text-primary neon-text-orange">VAULT</span>
              </h1>
            </div>
          </div>

          {/* Wallet Quick Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleCopyAddress}
              className="flex flex-col items-end group"
            >
              <span className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Wallet_Protocol</span>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-tr-xl group-hover:border-primary/50 transition-all">
                <span className="text-xs font-mono text-white/60 group-hover:text-primary transition-colors">{shortAddress}</span>
                {copied ? (
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3 text-white/20 group-hover:text-primary" />
                )}
              </div>
            </button>
            <a
              href={getAddressExplorerLink(account.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-white/5 border border-white/10 hover:border-primary hover:text-primary transition-all rounded-tr-xl flex items-center justify-center"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Global Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* JXC Balance Card */}
          <div className="md:col-span-2 relative group">
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors rounded-tr-[3rem] border border-white/10 group-hover:border-primary/30" />
            <div className="relative p-8 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <Coins className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Balance_Index</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white uppercase font-heading">
                  {jxcFormatted} <span className="text-xl text-primary font-mono not-italic opacity-40">JXC</span>
                </h2>
                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                  <a
                    href={`https://suiscan.xyz/testnet/coin/${COIN_TYPES.JXC}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/5 hover:border-primary/40 rounded text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Smart_Contract
                  </a>
                </div>
              </div>
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center rounded-full border-2 border-primary/20 bg-primary/5 group-hover:scale-105 transition-transform duration-500">
                  <TrendingUp className="w-12 h-12 md:w-16 md:h-16 text-primary animate-pulse" />
                </div>
                <div className="absolute inset-0 bg-primary/20 blur-[50px] opacity-20 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Asset Count Quick HUD */}
          <div className="bg-black/40 border border-white/10 p-8 rounded-tr-[2rem] relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <LayoutDashboard className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Unit_Registry</span>
              </div>

              <div className="space-y-6">
                <div className="flex items-end justify-between border-b border-white/5 pb-2">
                  <div>
                    <p className="text-[8px] font-black text-white/20 uppercase">Core_Modules</p>
                    <p className="text-2xl font-black text-white">{elementalCount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-white/20 uppercase text-primary">PHASE_01/02</p>
                  </div>
                </div>
                <div className="flex items-end justify-between border-b border-white/5 pb-2">
                  <div>
                    <p className="text-[8px] font-black text-white/20 uppercase">Special_Protocols</p>
                    <p className="text-2xl font-black text-white">{specialCount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-white/20 uppercase text-primary italic font-heading">ELITE</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowJabsList(true)}
                disabled={jabsCount === 0}
                className="w-full mt-8 py-4 bg-primary text-black font-black uppercase text-xs tracking-widest hover:bg-white transition-all rounded disabled:opacity-20 disabled:cursor-not-allowed group shadow-lg shadow-primary/20"
              >
                <div className="flex items-center justify-center gap-2">
                  <Eye className="w-4 h-4" />
                  Launch_Visualizer
                </div>
              </button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 skew-x-[-12deg] translate-x-16 -translate-y-8 pointer-events-none" />
          </div>
        </div>

        {/* Tactical Actions HUD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Transfer HUD */}
          <div className="group relative overflow-hidden bg-black/60 border border-white/10 rounded-tr-[2.5rem] p-8 hover:border-cyan-500/50 transition-all duration-300">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center rounded-tr-xl">
                <ArrowLeftRight className="w-7 h-7 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-2xl font-black italic tracking-tighter uppercase font-heading text-white">Transfer_Link</h3>
                <p className="text-[9px] font-black uppercase tracking-widest text-cyan-400/60">Sync_Asset_Data_Channels</p>
              </div>
            </div>

            <p className="text-xs text-white/30 uppercase tracking-widest mb-8 leading-relaxed">
              "Secure peer-to-peer relay for JXC tokens and Unit objects. Verification required for all outgoing signals."
            </p>

            <button
              onClick={() => setShowTransfer(true)}
              className="w-full py-4 bg-cyan-500 text-black font-black uppercase text-[11px] tracking-[0.3em] hover:bg-white transition-all rounded flex items-center justify-center gap-2 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]"
            >
              <Send className="w-4 h-4" />
              Open_Transfer_Console
            </button>
          </div>

          {/* Network Intelligence HUD */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-tr-[2.5rem] relative overflow-hidden flex flex-col justify-center text-center group">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:border-primary/50 transition-colors">
              <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">🌐</span>
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 mb-2">Network_Backbone</p>
            <h4 className="text-xl font-black italic text-white uppercase font-heading mb-3">SUI_BETA_GRID</h4>
            <p className="text-[10px] text-white/20 italic max-w-[280px] mx-auto">
              "Decentralized ledger synchronization established and maintained at 100% integrity."
            </p>
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

      </div>

      {/* Animated HUD Footer */}
      <div className="mt-12 text-center text-[8px] font-black uppercase tracking-[0.5em] text-white/10">
        Cipher_Security_Protocol_V_1.0.4 // Connection_Steady_0ms
      </div>
    </div>
  );
}

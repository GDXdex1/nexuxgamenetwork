'use client';

import { useState } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { useAdminDashboard, formatTreasuryData } from '@/hooks/useTreasuryData';
import {
  createAdminMintTransaction,
  createBurnTransaction,
  createPauseTreasuryTransaction,
  createUnpauseTreasuryTransaction,
  createTransferAdminCapTransaction,
  validateMintAmount,
} from '@/utils/adminTransactions';
import { SHARED_OBJECTS, jxcToSmallestUnit, jxcFromSmallestUnit, JABLIXCOIN_CONSTANTS } from '@/config/suiConfig';
import {
  ArrowLeft,
  Settings,
  Coins,
  Flame,
  Lock,
  Unlock,
  ExternalLink,
  ShieldAlert,
  Activity,
  Box,
  TrendingUp,
  LayoutDashboard,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface AdminPanelProps {
  onBackToMain: () => void;
}

export default function AdminPanel({ onBackToMain }: AdminPanelProps) {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const {
    treasury,
    treasuryLoading,
    adminCapId,
    isAdmin,
    adminCapLoading,
    jxcCoins,
    refetchTreasury,
  } = useAdminDashboard();

  const [mintAmount, setMintAmount] = useState<string>('');
  const [burnCoinId, setBurnCoinId] = useState<string>('');
  const [transferAddress, setTransferAddress] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // CRITICAL: Only allow access to the two admin wallets from the contract
  const ADMIN_WALLET_1 = '0x554a2392980b0c3e4111c9a0e8897e632d41847d04cbd41f9e081e49ba2eb04a';
  const ADMIN_WALLET_2 = '0x9e7aaf5f56ae094eadf9ca7f2856f533bcbf12fcc9bb9578e43ca770599a5dce';
  const isAdminWallet = account?.address === ADMIN_WALLET_1 || account?.address === ADMIN_WALLET_2;

  // Handle mint tokens
  const handleMint = async (): Promise<void> => {
    if (!adminCapId || !treasury || !account) {
      setStatus('❌ Admin access required');
      return;
    }

    const amount = parseFloat(mintAmount);
    if (isNaN(amount) || amount <= 0) {
      setStatus('❌ Invalid amount');
      return;
    }

    const amountInSmallestUnit = jxcToSmallestUnit(amount);

    if (!validateMintAmount(amountInSmallestUnit)) {
      const maxMintFormatted = jxcFromSmallestUnit(JABLIXCOIN_CONSTANTS.MAX_MINT_PER_TX);
      setStatus(`❌ Amount exceeds max mint per tx: ${maxMintFormatted.toLocaleString()} JXC`);
      return;
    }

    if (amountInSmallestUnit > treasury.remaining) {
      setStatus('❌ Amount exceeds remaining supply');
      return;
    }

    setIsLoading(true);
    setStatus('⏳ Minting tokens...');

    try {
      const tx = createAdminMintTransaction(
        amountInSmallestUnit,
        account.address,
        adminCapId,
        SHARED_OBJECTS.JXC_TREASURY
      );

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            setStatus(`✅ Minted ${amount.toLocaleString()} JXC successfully!`);
            setMintAmount('');
            refetchTreasury();
            setTimeout(() => setIsLoading(false), 1000);
          },
          onError: (error) => {
            setStatus(`❌ Mint failed: ${error.message}`);
            setIsLoading(false);
          },
        }
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setStatus(`❌ Error: ${errorMessage}`);
      setIsLoading(false);
    }
  };

  // Handle burn tokens
  const handleBurn = async (): Promise<void> => {
    if (!burnCoinId || !treasury) {
      setStatus('❌ Please select a coin to burn');
      return;
    }

    setIsLoading(true);
    setStatus('⏳ Burning tokens...');

    try {
      const tx = createBurnTransaction(burnCoinId, SHARED_OBJECTS.JXC_TREASURY);

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            setStatus('✅ Tokens burned successfully!');
            setBurnCoinId('');
            refetchTreasury();
            setTimeout(() => setIsLoading(false), 1000);
          },
          onError: (error) => {
            setStatus(`❌ Burn failed: ${error.message}`);
            setIsLoading(false);
          },
        }
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setStatus(`❌ Error: ${errorMessage}`);
      setIsLoading(false);
    }
  };

  // Handle pause/unpause treasury
  const handleTogglePause = async (): Promise<void> => {
    if (!adminCapId || !treasury) {
      setStatus('❌ Admin access required');
      return;
    }

    setIsLoading(true);
    setStatus(treasury.paused ? '⏳ Unpausing treasury...' : '⏳ Pausing treasury...');

    try {
      const tx = treasury.paused
        ? createUnpauseTreasuryTransaction(adminCapId, SHARED_OBJECTS.JXC_TREASURY)
        : createPauseTreasuryTransaction(adminCapId, SHARED_OBJECTS.JXC_TREASURY);

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            setStatus(`✅ Treasury ${treasury.paused ? 'unpaused' : 'paused'} successfully!`);
            refetchTreasury();
            setTimeout(() => setIsLoading(false), 1000);
          },
          onError: (error) => {
            setStatus(`❌ Operation failed: ${error.message}`);
            setIsLoading(false);
          },
        }
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setStatus(`❌ Error: ${errorMessage}`);
      setIsLoading(false);
    }
  };

  const formattedData = treasury ? formatTreasuryData(treasury) : null;

  if (!account || adminCapLoading || treasuryLoading) {
    return (
      <div className="min-h-screen bg-[#010101] flex items-center justify-center p-4">
        <div className="text-center">
          <Activity className="w-12 h-12 text-primary animate-pulse mx-auto mb-6" />
          <p className="text-[10px] font-black uppercase text-white/30 tracking-[0.5em]">Authenticating_Admin_Stream...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin || !isAdminWallet) {
    return (
      <div className="min-h-screen bg-[#010101] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 tech-bg-grid opacity-10 pointer-events-none" />
        <div className="max-w-md w-full bg-black/40 border-2 border-red-500/20 rounded-tr-[3rem] p-12 text-center backdrop-blur-xl relative z-10">
          <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse text-red-500">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase font-heading text-white mb-4">
            FORBIDDEN
          </h2>
          <p className="text-xs text-white/40 uppercase tracking-widest mb-8 leading-relaxed">
            "Your neural signature does not match authorized administrator protocols. Session termination recommended."
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
      <div className="absolute inset-0 tech-bg-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Navigation HUD */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 border-b border-primary/20 pb-8">
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
                <span className="text-[10px] font-black tracking-[0.3em] text-primary/60 uppercase">System_Administration</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase font-heading">
                TREASURY <span className="text-primary neon-text-orange">CORE</span>
              </h1>
            </div>
          </div>

          {/* Admin Status HUD */}
          <div className="flex items-center gap-6 bg-black/40 border border-white/10 px-8 py-3 rounded-bl-3xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">Admin_Verified</span>
            </div>
            <div className="w-[1px] h-6 bg-white/10" />
            <div className="text-right">
              <p className="text-[8px] font-black text-white/20 uppercase">Treasury_State</p>
              <p className={`text-[10px] font-black uppercase ${treasury?.paused ? 'text-red-500' : 'text-green-500'}`}>
                {treasury?.paused ? 'PAUSED' : 'OPERATIONAL'}
              </p>
            </div>
          </div>
        </div>

        {/* Global Analytics HUD */}
        {formattedData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { title: 'Circulating_Supply', value: formattedData.circulatingSupplyFormatted, icon: Coins, color: 'text-green-500' },
              { title: 'Remaining_Issuance', value: formattedData.remainingFormatted, icon: TrendingUp, color: 'text-blue-500' },
              { title: 'Max_Threshold', value: formattedData.maxSupplyFormatted, icon: LayoutDashboard, color: 'text-purple-500' },
              { title: 'Minted_Saturation', value: `${formattedData.percentMinted}%`, icon: Activity, color: 'text-primary' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-black/40 border border-white/10 p-6 rounded relative overflow-hidden group hover:border-primary/30 transition-all">
                <div className="relative z-10">
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">{stat.title}</p>
                  <p className={`text-2xl font-black italic font-heading ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className="absolute -bottom-2 -right-2 w-16 h-16 opacity-5 pointer-events-none group-hover:scale-110 transition-transform" />
              </div>
            ))}
          </div>
        )}

        {/* Tactical Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Action Card: Minting */}
          <div className="group relative">
            <div className="absolute inset-0 bg-primary/5 rounded-tr-[3rem] border border-white/10" />
            <div className="relative p-10">
              <div className="flex items-center gap-3 mb-8">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-black italic uppercase tracking-widest text-white">Issue_Currency</h3>
              </div>
              <div className="space-y-6">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black uppercase text-[10px]">AMT</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={mintAmount}
                    onChange={(e) => setMintAmount(e.target.value)}
                    className="w-full bg-black border border-white/10 px-16 py-4 rounded text-lg font-mono tracking-tighter focus:border-primary transition-all text-white placeholder:text-white/5"
                  />
                </div>
                <button
                  onClick={handleMint}
                  disabled={isLoading || treasury?.paused || !mintAmount}
                  className="w-full py-5 bg-primary text-black font-black uppercase text-xs tracking-widest hover:bg-white transition-all rounded shadow-lg shadow-primary/20 disabled:opacity-20 flex items-center justify-center gap-3"
                >
                  <Coins className="w-4 h-4 fill-current" />
                  Execute_Mint_Stream
                </button>
              </div>
            </div>
          </div>

          {/* Action Card: Burning */}
          <div className="bg-white/[0.02] border border-white/10 rounded-tr-[3rem] p-10 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-8">
              <Flame className="w-6 h-6 text-red-500" />
              <h3 className="text-xl font-black italic uppercase tracking-widest text-white">Destroy_Supply</h3>
            </div>
            <div className="space-y-6">
              <select
                value={burnCoinId}
                onChange={(e) => setBurnCoinId(e.target.value)}
                className="w-full bg-black border border-white/10 p-4 rounded text-xs font-mono uppercase tracking-widest text-white/60 focus:border-red-500/50 transition-all outline-none"
              >
                <option value="">SELECT_COIN_OBJECT_ID</option>
                {jxcCoins.map((coin) => (
                  <option key={coin.objectId} value={coin.objectId}>
                    {jxcFromSmallestUnit(coin.balance).toFixed(2)} JXC - {coin.objectId.slice(0, 12)}...
                  </option>
                ))}
              </select>
              <button
                onClick={handleBurn}
                disabled={isLoading || treasury?.paused || !burnCoinId}
                className="w-full py-5 bg-red-600 text-white font-black uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all rounded shadow-lg shadow-red-500/20 disabled:opacity-20 flex items-center justify-center gap-3"
              >
                <Flame className="w-4 h-4" />
                Execute_Purge_Protocol
              </button>
            </div>
          </div>

          {/* Action Card: Pause Control */}
          <div className="bg-black/60 border border-white/10 p-10 rounded-tr-[3rem]">
            <div className="flex items-center gap-3 mb-8">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
              <h3 className="text-xl font-black italic uppercase tracking-widest text-white">Emergency_Protocol</h3>
            </div>
            <button
              onClick={handleTogglePause}
              disabled={isLoading}
              className={`w-full py-5 font-black uppercase text-xs tracking-widest transition-all rounded flex items-center justify-center gap-3 ${treasury?.paused
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-yellow-600 text-black hover:bg-white'
                }`}
            >
              {treasury?.paused ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              {treasury?.paused ? 'RESUME_TREASURY_OPS' : 'HALT_TREASURY_OPS'}
            </button>
          </div>

          {/* Internal Meta HUD */}
          <div className="p-10 border border-dashed border-white/10 rounded-tr-[3rem] text-center flex flex-col justify-center">
            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.5em] mb-4">Security_Verification_Log</p>
            <div className="bg-black/40 p-4 rounded-xl text-left border border-white/5">
              <p className="text-[10px] font-mono text-green-500/60 leading-relaxed">
                [SYS] Neural signature verified.<br />
                [SYS] Treasury link active (SUI TESTNET).<br />
                [SYS] Shared object: JXC_TREASURY loaded.<br />
                [SYS] Ready for instruction input.
              </p>
            </div>
          </div>
        </div>

        {/* Global Alert Area */}
        {status && (
          <div className="mt-8 animate-in slide-in-from-top-4 duration-300">
            <div className="bg-white/5 border border-primary/20 p-4 rounded flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/80">{status}</p>
              <button onClick={() => setStatus('')} className="text-white/20 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
          </div>
        )}

      </div>

      {/* Decorative X icon for closing alerts (needs import) */}
    </div>
  );
}

// Add X to lucide imports at top
import { X } from 'lucide-react';

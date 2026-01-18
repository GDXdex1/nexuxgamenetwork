'use client'
import { useEffect, useState } from 'react';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import BattleArenaWrapper from '@/components/BattleArenaWrapper';
import BattleModeSelector from '@/components/BattleModeSelector';
import type { BattleMode } from '@/components/BattleModeSelector';
import MatchmakingWrapper from '@/components/MatchmakingWrapper';
import JablixGymNew from '@/components/JablixGymNew';
import JablixGenesisWrapper from '@/components/JablixGenesisWrapper';
import MarketplaceWrapper from '@/components/MarketplaceWrapper';
import Forum from '@/components/Forum';
import Wallet from '@/components/Wallet';
import AdminPanel from '@/components/AdminPanel';
import JablixBook from '@/components/JablixBook';
import JablixEvolution from '@/components/JablixEvolution';
import type { MatchData } from '@/components/Matchmaking';
import { sdk } from "@farcaster/miniapp-sdk";
import { useAddMiniApp } from "@/hooks/useAddMiniApp";
import { useQuickAuth } from "@/hooks/useQuickAuth";
import { useIsInFarcaster } from "@/hooks/useIsInFarcaster";
import { useJxcBalance, useSuiBalance, useUserJabs } from '@/hooks/useSuiData';
import { jxcFromSmallestUnit } from '@/config/suiConfig';
import { useRouter } from 'next/navigation';
import {
  Zap,
  Sword,
  ShoppingBag,
  MessageSquare,
  Book,
  Sparkles,
  Wallet as WalletIcon,
  Settings,
  ArrowLeft,
  Shield,
  Coins,
  LayoutDashboard
} from 'lucide-react';

type GameState = 'main' | 'modeSelect' | 'matchmaking' | 'gym' | 'genesis' | 'marketplace' | 'battle' | 'forum' | 'wallet' | 'admin' | 'book' | 'evolution';

export default function JablixArena() {
  const router = useRouter();
  // Jablix Arena - Main Game Component
  const { addMiniApp } = useAddMiniApp();
  const isInFarcaster = useIsInFarcaster();
  const account = useCurrentAccount();
  const [gameState, setGameState] = useState<GameState>('main');
  const [currentMatch, setCurrentMatch] = useState<MatchData | null>(null);
  const [selectedMode, setSelectedMode] = useState<BattleMode | null>(null);

  // Get user balances
  const jxcBalanceQuery = useJxcBalance();
  const suiBalanceQuery = useSuiBalance();
  const jabsQuery = useUserJabs();

  const jxcBalance = jxcBalanceQuery.data?.totalBalance
    ? jxcFromSmallestUnit(jxcBalanceQuery.data.totalBalance)
    : 0;

  const suiBalance = suiBalanceQuery.data?.totalBalance
    ? Number(suiBalanceQuery.data.totalBalance) / 1_000_000_000
    : 0;

  const jablixCount = jabsQuery.data?.length || 0;

  useQuickAuth(isInFarcaster);

  useEffect(() => {
    const tryAddMiniApp = async () => {
      try {
        await addMiniApp();
      } catch (error) {
        console.error('Failed to add mini app:', error);
      }
    };

    tryAddMiniApp();
  }, [addMiniApp]);

  useEffect(() => {
    const initializeFarcaster = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 100));

        if (document.readyState !== 'complete') {
          await new Promise<void>(resolve => {
            if (document.readyState === 'complete') {
              resolve();
            } else {
              window.addEventListener('load', () => resolve(), { once: true });
            }
          });
        }

        await sdk.actions.ready();
        console.log('Farcaster SDK initialized successfully - app fully loaded');
      } catch (error) {
        console.error('Failed to initialize Farcaster SDK:', error);

        setTimeout(async () => {
          try {
            await sdk.actions.ready();
            console.log('Farcaster SDK initialized on retry');
          } catch (retryError) {
            console.error('Farcaster SDK retry failed:', retryError);
          }
        }, 1000);
      }
    };

    initializeFarcaster();
  }, []);

  const handleMatchFound = (matchData: MatchData): void => {
    setCurrentMatch(matchData);
    setGameState('battle');
  };

  const handleBackToMain = (): void => {
    setGameState('main');
    setCurrentMatch(null);
    setSelectedMode(null);
  };

  const handleBackToModeSelect = (): void => {
    setGameState('modeSelect');
    setCurrentMatch(null);
  };

  const handleModeSelect = (mode: BattleMode): void => {
    setSelectedMode(mode);
    if (mode === 'random' || mode === 'ai') {
      setGameState('matchmaking');
    } else if (mode === 'gym') {
      setGameState('gym');
    }
  };

  // Main Menu
  if (gameState === 'main') {
    return (
      <main className="min-h-screen bg-[#010101] text-white relative overflow-hidden font-sans">
        {/* Background Tech Layer */}
        <div className="absolute inset-0 tech-bg-grid opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />

        {/* Top Decorative Line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent z-20" />

        {/* Hero Section / Banner */}
        <div className="relative h-[25vh] md:h-[35vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#010101] via-transparent to-transparent z-10" />
          <img
            src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/29973595-1e22-47bd-ac6d-ee040ee06efa-7GPiFWVzCQ093tX2AJdbk337pDSHA7"
            alt="Jablix Arena"
            className="w-full h-full object-cover grayscale opacity-40"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4 mt-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-[2px] bg-primary animate-pulse" />
              <h2 className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">Tactical_Combat_System</h2>
              <div className="w-12 h-[2px] bg-primary animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter text-white uppercase font-heading drop-shadow-[0_0_30px_rgba(255,107,0,0.2)]">
              JABLIX <span className="text-primary neon-text-orange">ARENA</span>
            </h1>
          </div>
        </div>

        {/* Global HUD Content */}
        <div className="relative z-20 container mx-auto px-4 -mt-12 pb-24">

          {/* Top HUD Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Wallet Info Tile */}
            <div className="md:col-span-2 bg-black/60 border border-primary/20 p-4 rounded-tr-3xl backdrop-blur-md flex flex-wrap items-center justify-between gap-6">
              {account ? (
                <>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded bg-primary/10 border border-primary/30 flex items-center justify-center">
                      <WalletIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-primary/60 uppercase tracking-widest">Operator_Connected</p>
                      <p className="text-sm font-mono font-bold text-white">{account.address.slice(0, 8)}...{account.address.slice(-6)}</p>
                    </div>
                  </div>
                  <div className="flex gap-8">
                    <div className="text-center md:text-left">
                      <p className="text-[8px] font-black text-primary/40 uppercase tracking-widest flex items-center gap-1 justify-center md:justify-start">
                        <Coins className="w-2 h-2" /> Assets_JXC
                      </p>
                      <p className="text-xl font-black text-white">{jxcBalance.toLocaleString()}</p>
                    </div>
                    <div className="text-center md:text-left">
                      <p className="text-[8px] font-black text-blue-400/40 uppercase tracking-widest flex items-center gap-1 justify-center md:justify-start">
                        <Zap className="w-2 h-2" /> Native_SUI
                      </p>
                      <p className="text-xl font-black text-white">{suiBalance.toFixed(3)}</p>
                    </div>
                    <div className="text-center md:text-left">
                      <p className="text-[8px] font-black text-green-400/40 uppercase tracking-widest">Units_Active</p>
                      <p className="text-xl font-black text-white">{jablixCount}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full flex items-center justify-between">
                  <p className="text-xs font-black text-white/40 uppercase tracking-widest">Critical: Auth_Required_To_Proceed</p>
                  <ConnectButton />
                </div>
              )}
            </div>

            {/* Quick Actions / Status */}
            <div className="bg-black/40 border border-white/5 p-4 flex flex-col justify-center gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-white/40 uppercase">System_Status</span>
                <span className="flex items-center gap-1.5 text-[10px] font-black text-green-500 uppercase">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Online
                </span>
              </div>
              <div className="h-[2px] bg-white/5 w-full" />
              <p className="text-[9px] font-mono text-white/30 leading-tight">
                NEXT_GEN_BATTLE_STATION // DRARIUX_NETWORK_CORE
              </p>
            </div>
          </div>

          {/* Navigational Matrix / Grid Menu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. BATTLE MODE */}
            <button
              onClick={() => setGameState('modeSelect')}
              disabled={!account}
              className="group relative h-48 bg-black border border-primary/30 rounded-br-3xl overflow-hidden transition-all duration-500 hover:border-primary hover:shadow-[0_0_30px_rgba(255,107,0,0.15)] disabled:opacity-40"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

              <div className="absolute top-4 left-4 p-3 bg-primary text-black rounded skew-x-[-12deg]">
                <Sword className="w-6 h-6 skew-x-[12deg]" />
              </div>

              <div className="absolute bottom-4 left-4 text-left">
                <h3 className="text-2xl font-black italic text-white uppercase group-hover:text-primary transition-colors">Combat_Zone</h3>
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mt-1">Multiplayer / AI Arena</p>
              </div>

              {/* Animated Corner */}
              <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center overflow-hidden">
                <div className="absolute w-12 h-[1px] bg-primary/40 rotate-45 translate-x-3 -translate-y-3" />
              </div>
            </button>

            {/* 2. JABLIX GENESIS */}
            <button
              onClick={() => setGameState('genesis')}
              disabled={!account}
              className="group relative h-48 bg-black border border-white/10 overflow-hidden transition-all duration-500 hover:border-pink-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] disabled:opacity-40"
            >
              <div className="absolute top-4 left-4 p-3 bg-pink-600/20 text-pink-500 border border-pink-500/30 rounded">
                <Sparkles className="w-6 h-6 outline-none" />
              </div>
              <div className="absolute bottom-4 left-4 text-left">
                <h3 className="text-2xl font-black italic text-white uppercase group-hover:text-pink-500 transition-colors">Genesis_Module</h3>
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mt-1">Mint / Fabricate Units</p>
              </div>
              <div className="absolute inset-0 bg-tech-scan opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
            </button>

            {/* 3. MARKETPLACE */}
            <button
              onClick={() => setGameState('marketplace')}
              disabled={!account}
              className="group relative h-48 bg-black border border-white/10 overflow-hidden transition-all duration-500 hover:border-yellow-500 hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] disabled:opacity-40"
            >
              <div className="absolute top-4 left-4 p-3 bg-yellow-600/20 text-yellow-500 border border-yellow-500/30 rounded">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="absolute bottom-4 left-4 text-left">
                <h3 className="text-2xl font-black italic text-white uppercase group-hover:text-yellow-500 transition-colors">Market_Link</h3>
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mt-1">Trade / Exchange Assets</p>
              </div>
            </button>

            {/* 4. MY WALLET */}
            <button
              onClick={() => setGameState('wallet')}
              disabled={!account}
              className="group relative h-48 bg-black border border-white/10 rounded-bl-3xl overflow-hidden transition-all duration-500 hover:border-cyan-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] disabled:opacity-40"
            >
              <div className="absolute top-4 left-4 p-3 bg-cyan-600/20 text-cyan-500 border border-cyan-500/30 rounded">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <div className="absolute bottom-4 left-4 text-left">
                <h3 className="text-2xl font-black italic text-white uppercase group-hover:text-cyan-500 transition-colors">Armory_Vault</h3>
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mt-1">Units / Stats / Inventory</p>
              </div>
            </button>

            {/* 5. COMMUNITY FORUM */}
            <button
              onClick={() => setGameState('forum')}
              disabled={!account}
              className="group relative h-40 bg-black/40 border border-white/5 overflow-hidden transition-all hover:bg-black/60 hover:border-white/20"
            >
              <div className="flex items-center gap-4 p-6">
                <div className="p-3 bg-white/5 text-white/40 rounded border border-white/10 group-hover:text-white transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-black text-white uppercase tracking-tight">Comm_Link</h4>
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Global Forum</p>
                </div>
              </div>
            </button>

            {/* 6. JABLIX BOOK */}
            <button
              onClick={() => setGameState('book')}
              disabled={!account}
              className="group relative h-40 bg-black/40 border border-white/5 overflow-hidden transition-all hover:bg-black/60 hover:border-white/20"
            >
              <div className="flex items-center gap-4 p-6">
                <div className="p-3 bg-white/5 text-white/40 rounded border border-white/10 group-hover:text-white transition-colors">
                  <Book className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-black text-white uppercase tracking-tight">Archives</h4>
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Unit Databank</p>
                </div>
              </div>
            </button>

            {/* 7. JABLIX EVOLUTION */}
            <button
              onClick={() => setGameState('evolution')}
              disabled={!account}
              className="group relative h-40 bg-black/40 border border-white/5 overflow-hidden transition-all hover:bg-black/60 hover:border-white/20"
            >
              <div className="flex items-center gap-4 p-6">
                <div className="p-3 bg-white/5 text-white/40 rounded border border-white/10 group-hover:text-white transition-colors">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-black text-white uppercase tracking-tight">Evolution</h4>
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Mutation_Lab</p>
                </div>
              </div>
            </button>

            {/* 8. ADMIN / BACK LINK */}
            <div className="grid grid-cols-1 gap-2">
              {account && (account.address === '0x554a2392980b0c3e4111c9a0e8897e632d41847d04cbd41f9e081e49ba2eb04a' || account.address === '0x9e7aaf5f56ae094eadf9ca7f2856f533bcbf12fcc9bb9578e43ca770599a5dce') && (
                <button
                  onClick={() => setGameState('admin')}
                  className="h-19 group bg-red-950/20 border border-red-500/20 hover:border-red-500 transition-all p-4 flex items-center gap-3"
                >
                  <Settings className="w-4 h-4 text-red-500" />
                  <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Core_Settings</span>
                </button>
              )}
              <button
                onClick={() => router.push('/game')}
                className="h-19 group bg-white/5 border border-white/10 hover:border-white/40 transition-all p-4 flex items-center gap-3"
              >
                <ArrowLeft className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                <span className="text-[10px] font-black text-white/40 group-hover:text-white uppercase tracking-widest transition-colors">Return_To_Hub</span>
              </button>
            </div>
          </div>

          {/* Site Footer HUD */}
          <div className="mt-16 border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">SUI_ENCRYPTED_ASSETS</p>
              </div>
              <div className="w-[1px] h-4 bg-white/10 hidden md:block" />
              <p className="text-[9px] font-mono text-white/20">V_0.8.2_BETA // JABLIX_PROTOCOL</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[8px] font-black text-white/30 uppercase tracking-widest">
                PackageID: {`0x${process.env.NEXT_PUBLIC_PACKAGE_ID || '337ec3a90dc6b0768b63a15d40b53365e2f1cafe89475b01485309d6e6c61cb0'}`.slice(0, 10)}...
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Battle Mode Selection
  if (gameState === 'modeSelect') {
    return (
      <BattleModeSelector
        onModeSelect={handleModeSelect}
        onBack={handleBackToMain}
      />
    );
  }

  // Matchmaking
  if (gameState === 'matchmaking' && selectedMode) {
    return (
      <MatchmakingWrapper
        mode={selectedMode}
        onMatchFound={handleMatchFound}
        onCancel={handleBackToModeSelect}
      />
    );
  }

  // Battle Arena
  if (gameState === 'battle') {
    return (
      <BattleArenaWrapper
        matchData={currentMatch}
        onBackToMain={handleBackToMain}
      />
    );
  }

  // Jablix Gym
  if (gameState === 'gym') {
    return (
      <JablixGymNew onBackToMain={handleBackToMain} />
    );
  }

  // Genesis (Minting)
  if (gameState === 'genesis') {
    return (
      <JablixGenesisWrapper onBackToMain={handleBackToMain} />
    );
  }

  // Marketplace
  if (gameState === 'marketplace') {
    return (
      <MarketplaceWrapper onBackToMain={handleBackToMain} />
    );
  }

  // Forum
  if (gameState === 'forum') {
    return (
      <Forum onBackToMain={handleBackToMain} />
    );
  }

  // Wallet
  if (gameState === 'wallet') {
    return (
      <Wallet onBackToMain={handleBackToMain} />
    );
  }

  // Admin Panel
  if (gameState === 'admin') {
    return (
      <AdminPanel onBackToMain={handleBackToMain} />
    );
  }

  // Jablix Book
  if (gameState === 'book') {
    return (
      <JablixBook onBackToMain={handleBackToMain} />
    );
  }

  // Jablix Evolution
  if (gameState === 'evolution') {
    return (
      <JablixEvolution onBackToMain={handleBackToMain} />
    );
  }

  return null;
}

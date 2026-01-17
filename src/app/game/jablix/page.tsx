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
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        {/* Enhanced Banner at Top */}
        <div className="relative z-10 w-full">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-600/30 to-transparent blur-3xl" />
          <img 
            src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/29973595-1e22-47bd-ac6d-ee040ee06efa-7GPiFWVzCQ093tX2AJdbk337pDSHA7" 
            alt="Jablix Arena"
            className="w-full h-56 md:h-72 lg:h-96 object-cover border-b-4 border-purple-500 shadow-2xl relative"
            style={{
              filter: 'brightness(1.1) contrast(1.2) saturate(1.3)',
            }}
          />
        </div>

        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[600px] h-[600px] bg-purple-500/30 rounded-full blur-3xl animate-pulse top-20 -left-40" />
          <div className="absolute w-[600px] h-[600px] bg-indigo-500/30 rounded-full blur-3xl animate-pulse bottom-20 -right-40" style={{ animationDelay: '2s' }} />
          <div className="absolute w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-3xl animate-pulse top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '4s' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center p-8 py-16">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 drop-shadow-2xl mb-6 animate-pulse"
              style={{
                textShadow: '0 0 80px rgba(168, 85, 247, 0.8), 0 0 120px rgba(168, 85, 247, 0.4)',
                letterSpacing: '0.05em'
              }}>
              JABLIX ARENA
            </h1>
            <p className="text-2xl md:text-3xl text-purple-100 font-bold mb-4 text-center max-w-3xl drop-shadow-lg">
              ⚔️ Epic 3v3 NFT Card Battles on Sui Blockchain ⚔️
            </p>
            <p className="text-lg md:text-xl text-purple-300 font-semibold text-center max-w-2xl">
              Battle • Mint • Trade • Dominate the Arena!
            </p>
          </div>

          {/* Wallet Connection Status */}
          {account ? (
            <div className="mb-8 p-6 bg-gradient-to-r from-cyan-900/50 to-blue-900/50 backdrop-blur-lg rounded-2xl border-2 border-cyan-400/30 shadow-2xl">
              <div className="flex flex-col gap-3 items-center">
                <p className="text-cyan-100 font-bold text-lg">
                  Connected: {account.address.slice(0, 6)}...{account.address.slice(-4)}
                </p>
                <div className="flex gap-6 text-center">
                  <div>
                    <p className="text-cyan-300 text-sm">JXC Balance</p>
                    <p className="text-white font-bold text-xl">{jxcBalance.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-cyan-300 text-sm">SUI Balance</p>
                    <p className="text-white font-bold text-xl">{suiBalance.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-cyan-300 text-sm">Jabs</p>
                    <p className="text-white font-bold text-xl">{jablixCount}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8">
              <ConnectButton />
            </div>
          )}

          {/* Menu Buttons */}
          <div className="flex flex-col gap-6 w-full max-w-xl mt-8">
            <button
              onClick={() => setGameState('modeSelect')}
              disabled={!account}
              className="group relative bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 hover:from-green-500 hover:via-emerald-500 hover:to-green-500
                       text-white font-black py-7 px-12 rounded-2xl text-2xl
                       transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-green-500/60
                       border-4 border-green-400 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              
              <span className="flex items-center justify-center gap-3 relative z-10">
                <span className="text-3xl">⚔️</span>
                <span>BATTLE MODE</span>
                <span className="text-3xl">⚔️</span>
              </span>
              <p className="text-sm font-semibold mt-2 opacity-90 relative z-10">
                {account ? 'Random • AI • Gym' : 'Connect wallet to play'}
              </p>
            </button>

            <button
              onClick={() => setGameState('genesis')}
              disabled={!account}
              className="group relative bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 hover:from-pink-500 hover:via-purple-500 hover:to-pink-500
                       text-white font-black py-7 px-12 rounded-2xl text-2xl
                       transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-pink-500/60
                       border-4 border-pink-400 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              
              <span className="flex items-center justify-center gap-3 relative z-10">
                <span className="text-3xl">✨</span>
                <span>JABLIX GENESIS</span>
                <span className="text-3xl">🎨</span>
              </span>
              <p className="text-sm font-semibold mt-2 opacity-90 relative z-10">
                {account ? 'Mint powerful Jabs' : 'Connect wallet to mint'}
              </p>
            </button>

            <button
              onClick={() => setGameState('marketplace')}
              disabled={!account}
              className="group relative bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-600 hover:from-yellow-500 hover:via-amber-500 hover:to-yellow-500
                       text-white font-black py-7 px-12 rounded-2xl text-2xl
                       transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-yellow-500/60
                       border-4 border-yellow-400 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              
              <span className="flex items-center justify-center gap-3 relative z-10">
                <span className="text-3xl">🛒</span>
                <span>MARKETPLACE</span>
                <span className="text-3xl">💰</span>
              </span>
              <p className="text-sm font-semibold mt-2 opacity-90 relative z-10">
                {account ? 'Trade Jablix NFTs' : 'Connect wallet to trade'}
              </p>
            </button>

            <button
              onClick={() => setGameState('forum')}
              disabled={!account}
              className="group relative bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-500 hover:via-blue-500 hover:to-indigo-500
                       text-white font-black py-7 px-12 rounded-2xl text-2xl
                       transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-indigo-500/60
                       border-4 border-indigo-400 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              
              <span className="flex items-center justify-center gap-3 relative z-10">
                <span className="text-3xl">💬</span>
                <span>COMMUNITY FORUM</span>
                <span className="text-3xl">🌐</span>
              </span>
              <p className="text-sm font-semibold mt-2 opacity-90 relative z-10">
                {account ? 'Connect with players' : 'Connect wallet to join'}
              </p>
            </button>

            <button
              onClick={() => setGameState('book')}
              disabled={!account}
              className="group relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500
                       text-white font-black py-7 px-12 rounded-2xl text-2xl
                       transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/60
                       border-4 border-blue-400 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              
              <span className="flex items-center justify-center gap-3 relative z-10">
                <span className="text-3xl">📖</span>
                <span>JABLIX BOOK</span>
                <span className="text-3xl">🔖</span>
              </span>
              <p className="text-sm font-semibold mt-2 opacity-90 relative z-10">
                {account ? 'View all Jabs' : 'Connect wallet to view'}
              </p>
            </button>

            <button
              onClick={() => setGameState('evolution')}
              disabled={!account}
              className="group relative bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 hover:from-violet-500 hover:via-fuchsia-500 hover:to-violet-500
                       text-white font-black py-7 px-12 rounded-2xl text-2xl
                       transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-violet-500/60
                       border-4 border-violet-400 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              
              <span className="flex items-center justify-center gap-3 relative z-10">
                <span className="text-3xl">✨</span>
                <span>JABLIX EVOLUTION</span>
                <span className="text-3xl">🔮</span>
              </span>
              <p className="text-sm font-semibold mt-2 opacity-90 relative z-10">
                {account ? 'Evolve your Jabs' : 'Connect wallet to evolve'}
              </p>
            </button>

            <button
              onClick={() => setGameState('wallet')}
              disabled={!account}
              className="group relative bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-600 hover:from-cyan-500 hover:via-teal-500 hover:to-cyan-500
                       text-white font-black py-7 px-12 rounded-2xl text-2xl
                       transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-cyan-500/60
                       border-4 border-cyan-400 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              
              <span className="flex items-center justify-center gap-3 relative z-10">
                <span className="text-3xl">💼</span>
                <span>MY WALLET</span>
                <span className="text-3xl">💎</span>
              </span>
              <p className="text-sm font-semibold mt-2 opacity-90 relative z-10">
                {account ? 'View your collection' : 'Connect wallet to view'}
              </p>
            </button>

            {account && (account.address === '0x554a2392980b0c3e4111c9a0e8897e632d41847d04cbd41f9e081e49ba2eb04a' || account.address === '0x9e7aaf5f56ae094eadf9ca7f2856f533bcbf12fcc9bb9578e43ca770599a5dce') && (
              <button
                onClick={() => setGameState('admin')}
                className="group relative bg-gradient-to-r from-red-600 via-orange-600 to-red-600 hover:from-red-500 hover:via-orange-500 hover:to-red-500
                         text-white font-black py-7 px-12 rounded-2xl text-2xl
                         transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-red-500/60
                         border-4 border-red-400 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                
                <span className="flex items-center justify-center gap-3 relative z-10">
                  <span className="text-3xl">⚙️</span>
                  <span>ADMIN PANEL</span>
                  <span className="text-3xl">🔐</span>
                </span>
                <p className="text-sm font-semibold mt-2 opacity-90 relative z-10">
                  Admin controls
                </p>
              </button>
            )}

            {/* Back to Drariux Game */}
            <button
              onClick={() => router.push('/game')}
              className="group relative bg-gradient-to-r from-gray-600 via-slate-600 to-gray-600 hover:from-gray-500 hover:via-slate-500 hover:to-gray-500
                       text-white font-black py-5 px-12 rounded-2xl text-xl
                       transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-gray-500/60
                       border-4 border-gray-400 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              
              <span className="flex items-center justify-center gap-3 relative z-10">
                <span className="text-2xl">←</span>
                <span>BACK TO DRARIUX GAME</span>
              </span>
            </button>
          </div>

          {/* Footer Info */}
          <div className="mt-12 text-center">
            <p className="text-purple-200 text-sm opacity-80">
              Powered by Sui Blockchain • Built with Next.js
            </p>
            <p className="text-purple-300 text-xs mt-2 opacity-60">
              Contract: {`0x${process.env.NEXT_PUBLIC_PACKAGE_ID || '337ec3a90dc6b0768b63a15d40b53365e2f1cafe89475b01485309d6e6c61cb0'}`.slice(0, 10)}...
            </p>
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

'use client';

import { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useBattle } from '@/hooks/useBattle';
import type { BattleMode } from './BattleModeSelector';
import type { BattleStartEvent } from '@/types/battle.types';

interface MatchmakingProps {
  mode: BattleMode;
  selectedTeam: string[];
  betLevel: number;
  onMatchFound: (matchData: MatchData) => void;
  onCancel: () => void;
}

export interface MatchData {
  matchId: string;
  playerTeam: string[];
  enemyTeam: string[];
  isHost: boolean;
  mode: 'ai' | 'random' | 'gym';
}

export default function Matchmaking({ mode, selectedTeam, betLevel, onMatchFound, onCancel }: MatchmakingProps) {
  const account = useCurrentAccount();
  const { isConnected, joinRandom, startAI, onBattleStart } = useBattle();
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchTime, setSearchTime] = useState<number>(0);
  const [playersInQueue, setPlayersInQueue] = useState<number>(1);

  // Get mode-specific titles
  const getModeTitle = (): string => {
    if (mode === 'random') return '🎲 Random Matchmaking';
    if (mode === 'ai') return '🤖 AI Battle Mode';
    return '⚔️ Find Opponent';
  };

  const getModeDescription = (): string => {
    if (mode === 'random') return 'Finding random opponents worldwide...';
    if (mode === 'ai') return 'Preparing AI opponent...';
    return 'Connect with players in real-time';
  };

  // Listen for battle start event from Socket.IO
  useEffect(() => {
    const unsubscribe = onBattleStart((data: BattleStartEvent) => {
      console.log('[Matchmaking] Battle start event received:', data);
      setIsSearching(false);
      toast.success('Match found! Preparing battle...');
      
      const matchData: MatchData = {
        matchId: data.battleId,
        playerTeam: selectedTeam,
        enemyTeam: [],
        isHost: true,
        mode: mode,
      };
      
      onMatchFound(matchData);
    });

    return unsubscribe;
  }, [onBattleStart, selectedTeam, mode, onMatchFound]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isSearching) {
      // Timer for display
      interval = setInterval(() => {
        setSearchTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSearching]);

  const startSearch = (): void => {
    if (!account?.address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (selectedTeam.length !== 3) {
      toast.error('Please select 3 Jablixes for your team');
      return;
    }

    if (!isConnected) {
      toast.error('Not connected to battle server. Connecting...');
      return;
    }

    setIsSearching(true);
    setSearchTime(0);

    // Use Socket.IO directly for both AI and Random modes
    if (mode === 'ai') {
      console.log('[Matchmaking] Starting AI battle via Socket.IO');
      startAI(selectedTeam, 'medium');
      toast.success('Starting AI battle...');
    } else if (mode === 'random') {
      console.log('[Matchmaking] Joining random matchmaking via Socket.IO');
      joinRandom(selectedTeam, betLevel);
      toast.success('Joined matchmaking queue');
    }
  };

  const cancelSearch = (): void => {
    setIsSearching(false);
    setSearchTime(0);
    toast.info('Search cancelled');
    onCancel();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-2xl w-full relative z-10">
        {/* Home Button with Logo - Top Left */}
        <div className="absolute top-0 left-0">
          <button
            onClick={onCancel}
            className="transition-all transform hover:scale-110 active:scale-95"
            title="Return to Main Menu"
          >
            <img 
              src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/56fa9ed2-8a4e-42ba-8746-d03370944e7d-k39OOt1uF85tIpdfal9oa1yj57AqgR"
              alt="Home"
              className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-2xl"
            />
          </button>
        </div>

        {/* Banner */}
        <div className="text-center mb-12">
          <img
            src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/4f3ded0e-dfc8-4203-a8b5-c5520107ed9b-4CHtf1hokrrrUpgGLZRmBEQ5pDYP3C"
            alt="Jablix Arena Banner"
            className="w-full max-w-3xl mx-auto rounded-3xl shadow-2xl border-4 border-purple-500/50 mb-8 hover:border-purple-400/70 transition-all duration-300"
          />
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-3">
            {getModeTitle()}
          </h2>
          <p className="text-xl text-purple-200 font-bold tracking-wide">
            {mode === 'random' ? 'Global Matchmaking System' : mode === 'ai' ? 'Practice Mode - Battle AI Opponents' : '3v3 NFT Card Battles'}
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <span className="px-4 py-2 bg-purple-800/50 rounded-full text-sm text-purple-200 border border-purple-500/30">
              ⚡ Fast-Paced
            </span>
            <span className="px-4 py-2 bg-indigo-800/50 rounded-full text-sm text-indigo-200 border border-indigo-500/30">
              🎮 Strategic
            </span>
            <span className="px-4 py-2 bg-blue-800/50 rounded-full text-sm text-blue-200 border border-blue-500/30">
              🌐 Global
            </span>
          </div>
        </div>

        {/* Matchmaking Card */}
        <div className="bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-gray-900/90 backdrop-blur-xl border-4 border-purple-500/50 rounded-3xl p-10 shadow-2xl">
          {/* Wallet Connection Warning */}
          {!account && (
            <Alert className="mb-6 bg-red-900/50 border-red-500">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className="text-white font-semibold">
                ⚠️ You need to connect your Sui wallet in Jablix Arena before starting a battle
              </AlertDescription>
            </Alert>
          )}

          {!isSearching ? (
            // Initial state - Search button
            <div className="text-center">
              <div className="mb-10">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full blur-2xl opacity-50 animate-pulse" />
                  <div className="relative p-8 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-full shadow-2xl">
                    {mode === 'ai' ? (
                      <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    ) : (
                      <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    )}
                  </div>
                </div>
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-4">
                  {getModeTitle()}
                </h2>
                <p className="text-gray-400 text-lg">
                  {getModeDescription()}
                </p>
              </div>

              <Button
                onClick={startSearch}
                disabled={!account}
                className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 hover:from-green-700 hover:via-emerald-700 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-black py-8 px-16 rounded-2xl text-3xl transition-all transform hover:scale-110 active:scale-95 shadow-2xl hover:shadow-green-500/50 w-full"
              >
                {mode === 'ai' ? '🤖 START AI BATTLE' : '🎮 FIND MATCH'}
              </Button>

              {/* Additional info */}
              <div className="mt-10 pt-8 border-t border-gray-700/50">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div className="group hover:scale-110 transition-transform">
                    <div className="text-4xl mb-2 group-hover:scale-125 transition-transform">⚡</div>
                    <div className="text-sm text-gray-400 font-semibold">Instant</div>
                  </div>
                  <div className="group hover:scale-110 transition-transform">
                    <div className="text-4xl mb-2 group-hover:scale-125 transition-transform">🌐</div>
                    <div className="text-sm text-gray-400 font-semibold">Worldwide</div>
                  </div>
                  <div className="group hover:scale-110 transition-transform">
                    <div className="text-4xl mb-2 group-hover:scale-125 transition-transform">🏆</div>
                    <div className="text-sm text-gray-400 font-semibold">Competitive</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Searching state
            <div className="text-center">
              <div className="mb-10">
                {/* Search Animation */}
                <div className="relative inline-block">
                  <div className="w-40 h-40 border-8 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-28 h-28 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-full flex items-center justify-center shadow-2xl">
                      <svg
                        className="w-14 h-14 text-white animate-pulse"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mt-8 mb-4">
                  {mode === 'ai' ? 'Preparing AI Opponent...' : 'Searching for Opponent...'}
                </h2>
                <p className="text-3xl text-purple-300 font-mono font-bold">
                  {Math.floor(searchTime / 60)}:{(searchTime % 60).toString().padStart(2, '0')}
                </p>
              </div>

              {/* Queue Info - Only show for random mode */}
              {mode === 'random' && (
                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-2 border-purple-600/50 rounded-2xl p-8 mb-8 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-gray-400 text-lg font-semibold">Players in queue:</span>
                    <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                      {playersInQueue}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-lg font-semibold">Region:</span>
                    <span className="text-white font-bold text-xl">🌍 Global</span>
                  </div>
                </div>
              )}

              {/* AI Info */}
              {mode === 'ai' && (
                <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-2 border-blue-500/50 rounded-2xl p-6 mb-8">
                  <p className="text-blue-200 text-center font-semibold">
                    🤖 AI opponent is being generated with random Jabs...
                  </p>
                </div>
              )}

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="bg-gray-800 h-3 rounded-full overflow-hidden border border-purple-600/30">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 transition-all duration-1000 animate-pulse"
                    style={{ width: `${Math.min((searchTime / 10) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <Button
                onClick={cancelSearch}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black py-6 px-12 rounded-2xl text-2xl transition-all transform hover:scale-110 active:scale-95 shadow-2xl hover:shadow-red-500/50 w-full"
              >
                ❌ CANCEL SEARCH
              </Button>

              {/* Tips while waiting */}
              <div className="mt-8 pt-6 border-t border-gray-700/50">
                <p className="text-sm text-gray-400 italic">
                  💡 Tip: {mode === 'ai' 
                    ? 'AI battles are perfect for testing new strategies and team compositions' 
                    : 'Each Jablix has unique abilities based on their element'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="text-center mt-10">
          <p className="text-sm text-gray-500">
            {mode === 'random' 
              ? 'Real-time matchmaking system • Powered by SpacetimeDB' 
              : mode === 'ai'
              ? 'Practice mode • Smart AI opponents'
              : 'Matchmaking system • Powered by Sui Network'}
          </p>
        </div>
      </div>
    </div>
  );
}

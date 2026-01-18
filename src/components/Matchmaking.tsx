'use client';

import { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { AlertCircle, Target, Activity, Zap, Radio, Globe, Shield, Sword, X, ChevronRight, TrendingUp } from 'lucide-react';
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
    if (mode === 'random') return 'RANDOM_LINK';
    if (mode === 'ai') return 'AI_CALIBRATION';
    return 'UNIT_DEPLOYMENT';
  };

  // Listen for battle start event from Socket.IO
  useEffect(() => {
    const unsubscribe = onBattleStart((data: BattleStartEvent) => {
      console.log('[Matchmaking] Battle start event received:', data);
      setIsSearching(false);
      toast.success(
        <div className="bg-black border border-primary/50 p-4 rounded-xl">
          <p className="font-black text-primary uppercase text-xs mb-1 tracking-widest">Signal_Captured</p>
          <p className="text-[10px] text-white/60 uppercase">Match confirmed. Initializing arena environment...</p>
        </div>
      );

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
      toast.error('Connect wallet to establish neural bridge.');
      return;
    }

    if (selectedTeam.length !== 3) {
      toast.error('Select 3 tactical units for deployment.');
      return;
    }

    if (!isConnected) {
      toast.error('Tactical server offline. Retrying link...');
      return;
    }

    setIsSearching(true);
    setSearchTime(0);

    if (mode === 'ai') {
      startAI(selectedTeam, 'medium');
    } else if (mode === 'random') {
      joinRandom(selectedTeam, betLevel);
    }
  };

  return (
    <div className="min-h-screen bg-[#010101] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Tech Grid Background */}
      <div className="absolute inset-0 tech-bg-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10 text-center">
        {/* Navigation HUD */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity">
          <button onClick={onCancel} className="flex items-center gap-2 group">
            <div className="w-8 h-[1px] bg-primary group-hover:w-12 transition-all" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Abort_Signal</span>
          </button>
        </div>

        {/* Tactical Banner HUD */}
        <div className="mb-12 relative group">
          <div className="absolute inset-x-0 -bottom-4 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="w-24 h-24 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
            {mode === 'ai' ? <Zap className="w-10 h-10 text-primary" /> : <Globe className="w-10 h-10 text-primary" />}
          </div>

          <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white uppercase font-heading mb-2">
            {getModeTitle()}
          </h2>
          <div className="flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.4em] text-white/20">
            <span>Sector_49</span>
            <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            <span>Protocol_V8</span>
          </div>
        </div>

        {/* Search Module HUD */}
        <div className="bg-black/40 border border-white/10 rounded-tr-[4rem] p-12 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -translate-y-16 translate-x-16 rounded-full blur-3xl" />

          {!isSearching ? (
            <div className="animate-in fade-in zoom-in duration-500">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-12 leading-loose max-w-[400px] mx-auto">
                {mode === 'random'
                  ? '"Scanning global network for unauthorized combat signatures. Stake verified for engagement."'
                  : '"Initializing local AI construct with randomized unit parameters for tactical training."'}
              </p>

              <button
                onClick={startSearch}
                disabled={!account}
                className="w-full py-8 bg-primary text-black font-black uppercase text-base tracking-[0.5em] hover:bg-white transition-all rounded shadow-[0_0_30px_rgba(255,107,0,0.2)] disabled:opacity-20 flex items-center justify-center gap-6"
              >
                <Sword className="w-6 h-6 fill-current" />
                INIT_SEQUENCE
              </button>

              <div className="mt-12 grid grid-cols-3 gap-8 opacity-20">
                {['SEC_STREAM', 'BIO_SYNC', 'JXC_TRANS'].map((t, idx) => (
                  <div key={idx} className="text-center">
                    <p className="text-[8px] font-black uppercase tracking-widest">{t}</p>
                    <div className="w-8 h-[1px] bg-white mx-auto mt-2" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center animate-in fade-in duration-500">
              {/* Search Animation Component */}
              <div className="relative w-48 h-48 mx-auto mb-10">
                <div className="absolute inset-0 border-[3px] border-primary/20 rounded-full" />
                <div className="absolute inset-0 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
                <div className="absolute inset-4 border border-white/5 rounded-full animate-pulse" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Elapsed</p>
                  <p className="text-3xl font-black font-mono tracking-tighter text-white">
                    {Math.floor(searchTime / 60)}:{(searchTime % 60).toString().padStart(2, '0')}
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-black italic uppercase tracking-[0.2em] text-white mb-4">
                INTERCEPTING_SIGNAL...
              </h3>

              {/* Queue Status HUD */}
              {mode === 'random' && (
                <div className="flex items-center justify-center gap-8 mb-10 py-4 bg-white/5 border border-white/5 rounded-xl">
                  <div className="text-left">
                    <p className="text-[7px] font-black text-white/20 uppercase tracking-widest">Nodes_In_Queue</p>
                    <p className="text-lg font-black text-primary">{playersInQueue}</p>
                  </div>
                  <div className="w-[1px] h-8 bg-white/10" />
                  <div className="text-left">
                    <p className="text-[7px] font-black text-white/20 uppercase tracking-widest">Network_Range</p>
                    <p className="text-lg font-black text-white">GLOBAL</p>
                  </div>
                </div>
              )}

              <button
                onClick={cancelSearch}
                className="w-full py-5 bg-white/5 border border-white/10 text-white/40 hover:text-white hover:border-red-500/50 transition-all rounded font-black uppercase text-[10px] tracking-[0.4em]"
              >
                HALT_SEARCH_OP
              </button>
            </div>
          )}
        </div>

        {/* HUD Metadata Decorations */}
        <div className="mt-20 flex flex-col items-center gap-6 opacity-5 pointer-events-none">
          <div className="flex items-center gap-4">
            <div className="w-16 h-[1px] bg-white" />
            <p className="text-[8px] font-black uppercase tracking-[1em]">Tactical_Stream_Decrypted</p>
            <div className="w-16 h-[1px] bg-white" />
          </div>
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-white rounded-full" />)}
          </div>
        </div>
      </div>
    </div>
  );
}

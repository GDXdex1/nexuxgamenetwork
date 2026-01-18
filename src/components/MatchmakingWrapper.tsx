'use client';

import { useState } from 'react';
import type { BattleMode } from './BattleModeSelector';
import TeamLobby from './TeamLobby';
import Matchmaking from './Matchmaking';
import type { MatchData } from './Matchmaking';
import { Target, Shield, Zap, TrendingUp, Layers, ChevronRight, Activity } from 'lucide-react';

interface MatchmakingWrapperProps {
  mode: BattleMode;
  onMatchFound: (matchData: MatchData) => void;
  onCancel: () => void;
}

type MatchmakingState = 'lobby' | 'searching' | 'matched';

export default function MatchmakingWrapper({ mode, onMatchFound, onCancel }: MatchmakingWrapperProps) {
  const [state, setState] = useState<MatchmakingState>('lobby');
  const [selectedTeam, setSelectedTeam] = useState<string[]>([]);
  const [betLevel, setBetLevel] = useState<number>(0); // 0: 500 JXC, 1: 1000 JXC, 2: 3000 JXC

  const handleTeamReady = (team: string[]): void => {
    setSelectedTeam(team);
    setState('searching');
  };

  const handleMatchFound = (matchData: MatchData): void => {
    onMatchFound(matchData);
  };

  const handleCancel = (): void => {
    setState('lobby');
    setSelectedTeam([]);
    onCancel();
  };

  // Show lobby first for team selection
  if (state === 'lobby') {
    return (
      <div className="relative">
        {/* Bet Level Selector - Only for non-AI modes */}
        {mode !== 'ai' && (
          <div className="fixed md:absolute top-20 md:top-4 right-4 z-50 bg-black/80 backdrop-blur-xl border border-primary/40 rounded-tr-3xl p-6 shadow-2xl animate-in slide-in-from-right duration-500">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-primary" />
              <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Risk_Assessment</p>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { level: 0, label: 'Standard', amount: '500 JXC', icon: Layers },
                { level: 1, label: 'High_Risk', amount: '1,000 JXC', icon: TrendingUp },
                { level: 2, label: 'Elite_Stake', amount: '3,000 JXC', icon: Zap }
              ].map((bet) => (
                <button
                  key={bet.level}
                  onClick={() => setBetLevel(bet.level)}
                  className={`group px-6 py-3 rounded border font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-between gap-8 ${betLevel === bet.level
                      ? 'bg-primary border-primary text-black shadow-[0_0_20px_rgba(255,107,0,0.3)]'
                      : 'bg-white/5 border-white/10 text-white/40 hover:border-primary/50'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <bet.icon className={`w-3 h-3 ${betLevel === bet.level ? 'text-black' : 'text-primary/60'}`} />
                    <span>{bet.label}</span>
                  </div>
                  <span className={`${betLevel === bet.level ? 'text-black/60' : 'text-white/20'}`}>{bet.amount}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 text-center">
              <p className="text-[7px] font-black text-white/20 uppercase tracking-[0.3em]">Neural_Confirmation_Pending</p>
            </div>
          </div>
        )}
        <TeamLobby
          mode={mode}
          betLevel={mode === 'ai' ? 0 : betLevel}
          onTeamReady={handleTeamReady}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  // Show matchmaking search
  return (
    <Matchmaking
      mode={mode}
      selectedTeam={selectedTeam}
      betLevel={mode === 'ai' ? 0 : betLevel}
      onMatchFound={handleMatchFound}
      onCancel={handleCancel}
    />
  );
}

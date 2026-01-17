'use client';

import { useState } from 'react';
import type { BattleMode } from './BattleModeSelector';
import TeamLobby from './TeamLobby';
import Matchmaking from './Matchmaking';
import type { MatchData } from './Matchmaking';

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
          <div className="absolute top-4 right-4 z-50 bg-gradient-to-br from-purple-900/90 to-pink-900/90 backdrop-blur-xl border-2 border-pink-500 rounded-2xl p-4">
            <p className="text-white font-bold mb-2 text-center">Select Bet Level</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setBetLevel(0)}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  betLevel === 0 
                    ? 'bg-green-600 text-white scale-105' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🟢 500 JXC
              </button>
              <button
                onClick={() => setBetLevel(1)}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  betLevel === 1 
                    ? 'bg-blue-600 text-white scale-105' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🔵 1,000 JXC
              </button>
              <button
                onClick={() => setBetLevel(2)}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  betLevel === 2 
                    ? 'bg-purple-600 text-white scale-105' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🟣 3,000 JXC
              </button>
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

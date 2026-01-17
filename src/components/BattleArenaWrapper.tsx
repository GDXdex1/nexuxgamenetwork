'use client';

import BattleArena from './BattleArena';
import type { MatchData } from './Matchmaking';

interface BattleArenaWrapperProps {
  matchData: MatchData | null;
  onBackToMain: () => void;
}

export default function BattleArenaWrapper({ matchData, onBackToMain }: BattleArenaWrapperProps) {
  if (!matchData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center p-8">
        <div className="max-w-4xl w-full bg-gradient-to-br from-purple-900/80 to-indigo-900/80 border-4 border-purple-500/50 rounded-3xl p-12 shadow-2xl text-center">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-6">
            ⚔️ NO MATCH DATA ⚔️
          </h1>
          <p className="text-2xl text-purple-200 mb-8">
            Match data not found. Please start a new battle.
          </p>
          <button
            onClick={onBackToMain}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black py-6 px-12 rounded-2xl text-2xl transition-all transform hover:scale-105 shadow-2xl"
          >
            ← Back to Main Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <BattleArena 
      matchId={matchData.matchId} 
      onBackToMain={onBackToMain}
      playerTeam={matchData.playerTeam}
      mode={matchData.mode}
    />
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useUserJabs } from '@/hooks/useSuiData';
import type { Jablix } from '@/hooks/useSuiData';
import type { BattleMode } from './BattleModeSelector';

interface TeamLobbyProps {
  mode: BattleMode;
  betLevel: number;
  onTeamReady: (team: string[]) => void;
  onCancel: () => void;
}

export default function TeamLobby({ mode, betLevel, onTeamReady, onCancel }: TeamLobbyProps) {
  const account = useCurrentAccount();
  const { data: userJabs, isLoading } = useUserJabs();
  const [selectedTeam, setSelectedTeam] = useState<string[]>([]);
  const [hoveredJab, setHoveredJab] = useState<string | null>(null);

  const betAmounts = [500, 1000, 3000];
  const betAmount = betAmounts[betLevel];

  const toggleJabSelection = (jabId: string): void => {
    if (selectedTeam.includes(jabId)) {
      // Remove from team
      setSelectedTeam(selectedTeam.filter(id => id !== jabId));
    } else {
      // Add to team (max 3)
      if (selectedTeam.length < 3) {
        setSelectedTeam([...selectedTeam, jabId]);
      }
    }
  };

  const handleStartBattle = (): void => {
    if (selectedTeam.length === 3) {
      onTeamReady(selectedTeam);
    }
  };

  const getJabById = (id: string): Jablix | undefined => {
    return userJabs?.find(jab => jab.id === id);
  };

  const getModeTitle = (): string => {
    if (mode === 'random') return '🎲 Random Battle';
    if (mode === 'ai') return '🤖 AI Battle';
    return '⚔️ PvP Battle';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 flex items-center justify-center relative">
        {/* Back Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 left-4 z-50 transition-transform hover:scale-110"
        >
          <img 
            src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/56fa9ed2-8a4e-42ba-8746-d03370944e7d-k39OOt1uF85tIpdfal9oa1yj57AqgR"
            alt="Back"
            className="w-16 h-16 object-contain drop-shadow-2xl"
          />
        </button>
        
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-xl font-bold mb-6">Loading your Jabs...</p>
          <Button
            onClick={onCancel}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-black py-3 px-8 rounded-2xl transition-all transform hover:scale-110"
          >
            ← Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 p-4 pt-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Back Button */}
      <button
        onClick={onCancel}
        className="absolute top-4 left-4 z-50 transition-transform hover:scale-110"
      >
        <img 
          src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/56fa9ed2-8a4e-42ba-8746-d03370944e7d-k39OOt1uF85tIpdfal9oa1yj57AqgR"
          alt="Back"
          className="w-16 h-16 object-contain drop-shadow-2xl"
        />
      </button>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300 mb-4">
            {getModeTitle()} - Team Selection
          </h1>
          <p className="text-xl text-white font-bold mb-4">
            Select 3 Jabs for battle
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="px-6 py-3 bg-purple-900/80 rounded-full border-2 border-pink-500">
              <span className="text-pink-300 font-bold">Bet: {betAmount} JXC</span>
            </div>
            <div className="px-6 py-3 bg-orange-900/80 rounded-full border-2 border-orange-500">
              <span className="text-orange-300 font-bold">Selected: {selectedTeam.length}/3</span>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {!account && (
          <Alert className="mb-6 bg-red-900/80 border-red-500 max-w-3xl mx-auto">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="text-white font-semibold">
              ⚠️ Connect your wallet to select your team
            </AlertDescription>
          </Alert>
        )}

        {userJabs && userJabs.length === 0 && (
          <Alert className="mb-6 bg-orange-900/80 border-orange-500 max-w-3xl mx-auto">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="text-white font-semibold">
              📦 You don't have any Jabs yet. Visit Jablix Genesis to mint!
            </AlertDescription>
          </Alert>
        )}

        {userJabs && userJabs.length < 3 && userJabs.length > 0 && (
          <Alert className="mb-6 bg-yellow-900/80 border-yellow-500 max-w-3xl mx-auto">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="text-white font-semibold">
              ⚠️ You need at least 3 Jabs to battle. You have {userJabs.length}.
            </AlertDescription>
          </Alert>
        )}

        {/* Selected Team Preview */}
        {selectedTeam.length > 0 && (
          <div className="mb-8 bg-gradient-to-br from-purple-900/80 to-pink-900/80 backdrop-blur-xl border-4 border-pink-500/50 rounded-3xl p-6 max-w-4xl mx-auto">
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300 mb-4 text-center">
              Your Team
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {selectedTeam.map((jabId, index) => {
                const jab = getJabById(jabId);
                if (!jab) return null;
                return (
                  <div key={jabId} className="relative">
                    <div className="bg-gradient-to-br from-purple-800 to-pink-800 rounded-xl p-3 border-2 border-pink-400">
                      <div className="aspect-square rounded-lg overflow-hidden mb-2">
                        <img
                          src={jab.image.startsWith('http') ? jab.image : `https://ipfs.io/ipfs/${jab.image}`}
                          alt={jab.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-white font-bold text-sm text-center truncate">{jab.name}</p>
                      <div className="absolute top-1 right-1 bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                );
              })}
              {/* Empty slots */}
              {[...Array(3 - selectedTeam.length)].map((_, i) => (
                <div key={`empty-${i}`} className="bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-600 aspect-square flex items-center justify-center">
                  <span className="text-gray-500 text-4xl font-bold">?</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Jabs Grid */}
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border-4 border-purple-500/50 rounded-3xl p-6 mb-8">
          <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-6">
            Your Jabs Collection ({userJabs?.length || 0})
          </h3>

          {userJabs && userJabs.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {userJabs.map((jab) => {
                const isSelected = selectedTeam.includes(jab.id);
                const isHovered = hoveredJab === jab.id;

                return (
                  <button
                    key={jab.id}
                    onClick={() => toggleJabSelection(jab.id)}
                    onMouseEnter={() => setHoveredJab(jab.id)}
                    onMouseLeave={() => setHoveredJab(null)}
                    className={`relative transition-all transform ${
                      isSelected 
                        ? 'scale-105 ring-4 ring-pink-500' 
                        : isHovered 
                        ? 'scale-105' 
                        : 'hover:scale-105'
                    }`}
                    disabled={selectedTeam.length >= 3 && !isSelected}
                  >
                    <div className={`bg-gradient-to-br ${
                      isSelected 
                        ? 'from-pink-600 to-orange-600' 
                        : 'from-purple-900 to-pink-900'
                    } rounded-xl p-3 border-2 ${
                      isSelected ? 'border-pink-400' : 'border-purple-600'
                    }`}>
                      <div className="aspect-square rounded-lg overflow-hidden mb-2 relative">
                        <img
                          src={jab.image.startsWith('http') ? jab.image : `https://ipfs.io/ipfs/${jab.image}`}
                          alt={jab.name}
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-pink-500/30 flex items-center justify-center">
                            <div className="bg-pink-500 rounded-full w-12 h-12 flex items-center justify-center">
                              <span className="text-white text-2xl font-bold">✓</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-white font-bold text-sm truncate">{jab.name}</p>
                      <div className="flex justify-between text-xs text-gray-300 mt-1">
                        <span>HP: {jab.hp}</span>
                        <span>ATK: {jab.attack}</span>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold border-2 border-white">
                        {selectedTeam.indexOf(jab.id) + 1}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No Jabs found in your wallet</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={onCancel}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-black py-6 px-12 rounded-2xl text-xl transition-all transform hover:scale-110"
          >
            ❌ Cancel
          </Button>
          <Button
            onClick={handleStartBattle}
            disabled={selectedTeam.length !== 3}
            className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 hover:from-green-700 hover:via-emerald-700 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-black py-6 px-12 rounded-2xl text-xl transition-all transform hover:scale-110 disabled:scale-100"
          >
            {selectedTeam.length === 3 ? '⚔️ START BATTLE' : `SELECT ${3 - selectedTeam.length} MORE`}
          </Button>
        </div>
      </div>
    </div>
  );
}

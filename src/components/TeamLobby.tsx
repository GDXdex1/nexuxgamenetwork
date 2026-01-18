'use client';

import { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { AlertCircle, Loader2, ArrowLeft, Sword, Shield, Zap, Target, Layers, Box, ChevronRight, Activity, AlertTriangle, X } from 'lucide-react';
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
      setSelectedTeam(selectedTeam.filter(id => id !== jabId));
    } else {
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
    if (mode === 'random') return 'RANDOM_BATTLE';
    if (mode === 'ai') return 'AI_SIMULATION';
    return 'RANKED_PVP';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#010101] flex items-center justify-center p-4">
        <div className="text-center">
          <Activity className="w-12 h-12 text-primary animate-spin mx-auto mb-6" />
          <p className="text-[10px] font-black uppercase text-white/30 tracking-[0.5em] animate-pulse">Syncing_Neural_Inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010101] text-white p-4 md:p-8 relative overflow-hidden font-sans">
      <div className="absolute inset-0 tech-bg-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Navigation HUD */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6 border-b border-primary/20 pb-8">
          <div className="flex items-center gap-6">
            <button
              onClick={onCancel}
              className="group relative p-4 bg-white/5 border border-white/10 hover:border-primary transition-all rounded-tr-xl flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
            </button>
            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-[1px] bg-primary/40" />
                <span className="text-[10px] font-black tracking-[0.3em] text-primary/60 uppercase">Deployment_Center</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase font-heading">
                {getModeTitle()} <span className="text-white/20">/</span> <span className="text-primary neon-text-orange">LOBBY</span>
              </h1>
            </div>
          </div>

          {/* Selection HUD */}
          <div className="flex items-center gap-6 bg-black/40 border border-white/10 px-8 py-3 rounded-bl-3xl backdrop-blur-md">
            <div className="text-center">
              <p className="text-[8px] font-black text-white/30 uppercase tracking-widest leading-none mb-1">Risk_Stake</p>
              <p className="text-lg font-black text-primary">{betAmount} JXC</p>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-[8px] font-black text-white/30 uppercase tracking-widest leading-none mb-1">Units_Ready</p>
              <p className="text-lg font-black text-white">{selectedTeam.length}/3</p>
            </div>
          </div>
        </div>

        {/* Selected Team Preview HUD */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-4 h-4 text-primary" />
            <h2 className="text-xs font-black text-white/40 uppercase tracking-widest">Selected_Formation</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[0, 1, 2].map((index) => {
              const jabId = selectedTeam[index];
              const jab = jabId ? getJabById(jabId) : null;

              return (
                <div key={index} className="group relative">
                  {jab ? (
                    <div className="bg-black/60 border-2 border-primary/40 rounded-tr-[2rem] p-6 flex items-center gap-6 animate-in zoom-in duration-300">
                      <div className="w-20 h-20 relative bg-white/5 rounded-full overflow-hidden border border-white/10">
                        <img
                          src={jab.image.startsWith('http') ? jab.image : `https://ipfs.io/ipfs/${jab.image}`}
                          alt={jab.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-xs font-black text-white uppercase truncate max-w-[120px]">{jab.name}</p>
                          <span className="text-[8px] font-black text-primary px-2 py-0.5 border border-primary/20 rounded">UNIT_0{index + 1}</span>
                        </div>
                        <div className="flex gap-4">
                          <div className="text-center">
                            <p className="text-[7px] font-black text-white/20 uppercase">HP</p>
                            <p className="text-[10px] font-black text-white">{jab.hp}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[7px] font-black text-white/20 uppercase">ATK</p>
                            <p className="text-[10px] font-black text-white">{jab.attack}</p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleJabSelection(jab.id)}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-black border border-white/10 rounded-full flex items-center justify-center hover:border-red-500 transition-colors"
                      >
                        <X className="w-4 h-4 text-white/40" />
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white/5 border border-dashed border-white/10 rounded-tr-[2rem] p-8 flex flex-col items-center justify-center text-center group-hover:border-primary/20 transition-colors h-[116px]">
                      <Layers className="w-6 h-6 text-white/10 mb-2 group-hover:text-primary/20 transition-colors" />
                      <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Awaiting_Selection</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Collection Grid HUD */}
        <div className="bg-white/[0.02] border border-white/10 rounded-tr-[3rem] p-8 lg:p-12 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3">
              <Box className="w-5 h-5 text-primary/60" />
              <h3 className="text-xl font-black italic uppercase tracking-widest">Unit_Inventory <span className="text-[10px] text-white/20 non-italic ml-2">[{userJabs?.length || 0}_CAPACITY]</span></h3>
            </div>

            <div className="flex gap-4">
              {!account && <div className="flex items-center gap-2 text-red-500/60 bg-red-500/5 px-4 py-1.5 rounded border border-red-500/10"><AlertTriangle className="w-3 h-3" /><span className="text-[9px] font-black uppercase tracking-widest">Connect_Wallet_To_Access</span></div>}
              {userJabs && userJabs.length < 3 && userJabs.length > 0 && <div className="flex items-center gap-2 text-orange-500/60 bg-orange-500/5 px-4 py-1.5 rounded border border-orange-500/10"><AlertCircle className="w-3 h-3" /><span className="text-[9px] font-black uppercase tracking-widest">Insufficient_Units_For_Combat</span></div>}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {userJabs?.map((jab) => {
              const isSelected = selectedTeam.includes(jab.id);
              const JabIcon = isSelected ? Shield : Zap;

              return (
                <button
                  key={jab.id}
                  onClick={() => toggleJabSelection(jab.id)}
                  disabled={selectedTeam.length >= 3 && !isSelected}
                  className={`group relative bg-black border rounded-tr-xl overflow-hidden transition-all duration-300 ${isSelected ? 'border-primary ring-1 ring-primary/40' : 'border-white/10 hover:border-white/30'
                    } disabled:opacity-20`}
                >
                  <div className="aspect-square relative bg-white/5">
                    <img
                      src={jab.image.startsWith('http') ? jab.image : `https://ipfs.io/ipfs/${jab.image}`}
                      alt={jab.name}
                      className={`w-full h-full object-cover transition-transform duration-500 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center animate-pulse">
                        <div className="bg-primary text-black p-2 rounded-full shadow-[0_0_20px_rgba(255,107,0,0.5)]">
                          <Sword className="w-6 h-6 fill-current" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-black/60 backdrop-blur-md">
                    <p className="text-[10px] font-black text-white uppercase truncate mb-1">{jab.name}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <span className="text-[8px] font-black text-white/40 uppercase">A:{jab.attack}</span>
                        <span className="text-[8px] font-black text-white/40 uppercase">H:{jab.hp}</span>
                      </div>
                      <JabIcon className={`w-3 h-3 ${isSelected ? 'text-primary' : 'text-white/20'}`} />
                    </div>
                  </div>

                  {isSelected && (
                    <div className="absolute top-0 right-0 w-8 h-8 bg-primary rounded-bl-xl flex items-center justify-center text-black font-black text-xs">
                      {selectedTeam.indexOf(jab.id) + 1}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Global Action HUD */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12 animate-in slide-in-from-bottom-6 duration-700">
          <button
            onClick={onCancel}
            className="px-12 py-5 bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-red-500 transition-all rounded font-black uppercase text-xs tracking-[0.4em]"
          >
            Abort_Deployment
          </button>
          <button
            onClick={handleStartBattle}
            disabled={selectedTeam.length !== 3}
            className="px-16 py-5 bg-primary text-black font-black uppercase text-xs tracking-[0.4em] hover:bg-white transition-all rounded shadow-lg shadow-primary/20 disabled:opacity-20 flex items-center gap-4 justify-center"
          >
            {selectedTeam.length === 3 ? (
              <>
                <Sword className="w-4 h-4 fill-current" />
                INIT_COMBAT_SEQUENCE
              </>
            ) : (
              <>
                SELECT_{3 - selectedTeam.length}_MORE_UNITS
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}



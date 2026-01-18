'use client';

import { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useUserGyms } from '@/hooks/useUserGyms';
import {
  Loader2,
  Plus,
  Trophy,
  ArrowLeft,
  Shield,
  Target,
  Sword,
  Activity,
  ChevronRight,
  Info,
  Radio,
  Box,
  LayoutDashboard
} from 'lucide-react';
import GymMinter from './GymMinter';
import GymInterface from './GymInterface';
import type { GymNFT } from '@/hooks/useUserGyms';

interface JablixGymNewProps {
  onBackToMain: () => void;
}

type ViewMode = 'list' | 'mint' | 'gym';

export default function JablixGymNew({ onBackToMain }: JablixGymNewProps) {
  const account = useCurrentAccount();
  const { gyms, loading, refetch, hasGyms } = useUserGyms();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedGym, setSelectedGym] = useState<GymNFT | null>(null);

  const handleGymMinted = () => {
    refetch();
    setViewMode('list');
  };

  const handleOpenGym = (gym: GymNFT) => {
    setSelectedGym(gym);
    setViewMode('gym');
  };

  const handleBackToList = () => {
    setSelectedGym(null);
    setViewMode('list');
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-[#010101] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 tech-bg-grid opacity-10 pointer-events-none" />
        <div className="max-w-md w-full bg-black/40 border-2 border-primary/20 rounded-tr-[3rem] p-12 text-center backdrop-blur-xl relative z-10">
          <div className="w-20 h-20 bg-primary/10 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse text-primary">
            <Shield className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase font-heading text-white mb-4">
            AUTH_REQUIRED
          </h2>
          <p className="text-xs text-white/40 uppercase tracking-widest mb-8 leading-relaxed">
            "Neural link with private arena network not established. Connect Sui wallet to proceed."
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

  // Show gym interface if a gym is selected
  if (viewMode === 'gym' && selectedGym) {
    return <GymInterface gym={selectedGym} onBack={handleBackToList} />;
  }

  return (
    <div className="min-h-screen bg-[#010101] text-white p-4 md:p-8 relative overflow-hidden font-sans">
      {/* Tech Grid Background */}
      <div className="absolute inset-0 tech-bg-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />

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
                <span className="text-[10px] font-black tracking-[0.3em] text-primary/60 uppercase">Sector_Management</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase font-heading">
                JABLIX <span className="text-primary neon-text-orange">ARENAS</span>
              </h1>
            </div>
          </div>

          {/* Quick Stats HUD */}
          <div className="hidden lg:flex items-center gap-8 bg-black/40 border border-white/10 px-8 py-4 rounded-bl-3xl backdrop-blur-md">
            <div className="text-center">
              <p className="text-[8px] font-black text-white/30 uppercase tracking-widest leading-none mb-1">Total_Arenas</p>
              <p className="text-xl font-black text-white">{gyms.length}</p>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-[8px] font-black text-white/30 uppercase tracking-widest leading-none mb-1">Protocol_V_1.2</p>
              <div className="flex gap-1 mt-1 justify-center">
                <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_5px_rgba(255,107,0,0.5)]" />
                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full" />
                <div className="w-1.5 h-1.5 bg-primary/20 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Content View Controller */}
        {viewMode === 'mint' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Box className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-black italic uppercase tracking-widest">Construct_New_Arena</h2>
              </div>
              <button
                onClick={() => setViewMode('list')}
                className="px-6 py-2 bg-white/5 border border-white/10 text-white/40 hover:text-white hover:border-primary transition-all rounded uppercase text-[10px] font-black tracking-widest"
              >
                Cancel_Op
              </button>
            </div>
            <GymMinter onGymMinted={handleGymMinted} />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 bg-white/[0.02] border border-dashed border-white/10 rounded-3xl">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
                <p className="text-[10px] font-black uppercase text-white/30 tracking-[0.5em] animate-pulse">Syncing_Sector_Data...</p>
              </div>
            ) : !hasGyms ? (
              <div className="group relative max-w-2xl mx-auto">
                <div className="absolute inset-0 bg-primary/5 rounded-tr-[4rem] border border-white/10 group-hover:border-primary/40 transition-all duration-500" />
                <div className="relative p-16 text-center">
                  <div className="w-20 h-20 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Radio className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase font-heading mb-4">
                    NO_ARENAS_FOUND
                  </h2>
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] mb-10 leading-relaxed">
                    "Unauthorized sector access. Initialize private battle room construction to gain territory."
                  </p>
                  <button
                    onClick={() => setViewMode('mint')}
                    className="px-12 py-5 bg-primary text-black font-black uppercase text-xs tracking-widest hover:bg-white transition-all rounded shadow-lg shadow-primary/20 inline-flex items-center gap-3"
                  >
                    <Plus className="w-4 h-4" />
                    Construct_First_Arena
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-end mb-8">
                  <button
                    onClick={() => setViewMode('mint')}
                    className="px-6 py-3 bg-primary text-black font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all rounded flex items-center gap-2 shadow-lg shadow-primary/20"
                  >
                    <Plus className="w-4 h-4" />
                    Build_New_Arena
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {gyms.map((gym) => (
                    <div
                      key={gym.id}
                      onClick={() => handleOpenGym(gym)}
                      className="group relative bg-black border border-white/10 rounded-tr-3xl p-8 hover:border-primary transition-all duration-300 cursor-pointer shadow-2xl overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -translate-y-12 translate-x-12 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

                      <div className="flex items-start justify-between mb-8">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-4 h-[1px] bg-primary/40" />
                            <span className="text-[8px] font-black text-primary/60 uppercase tracking-widest">SEC_0X{gym.id.slice(0, 4)}</span>
                          </div>
                          <h3 className="text-xl font-black italic tracking-tighter text-white uppercase font-heading group-hover:text-primary transition-colors">
                            {gym.name}
                          </h3>
                        </div>
                        <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-tr-xl flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/5 transition-all">
                          <Trophy className="w-5 h-5 text-white/20 group-hover:text-primary" />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mb-8">
                        <div className="bg-white/5 border border-white/5 p-3 rounded text-center">
                          <p className="text-lg font-black text-white">{gym.battlesPlayed}</p>
                          <p className="text-[7px] font-black text-white/20 uppercase">Battles</p>
                        </div>
                        <div className="bg-green-500/5 border border-green-500/10 p-3 rounded text-center group-hover:bg-green-500/10 transition-colors">
                          <p className="text-lg font-black text-green-500">{gym.wins}</p>
                          <p className="text-[7px] font-black text-green-500/40 uppercase">Wins</p>
                        </div>
                        <div className="bg-red-500/5 border border-red-500/10 p-3 rounded text-center group-hover:bg-red-500/10 transition-colors">
                          <p className="text-lg font-black text-red-500">{gym.losses}</p>
                          <p className="text-[7px] font-black text-red-500/40 uppercase">Losses</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                        <span className="text-white/20">Access_Room</span>
                        <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                      </div>

                      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent group-hover:via-primary transition-all duration-500" />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

      </div>

      {/* HUD Background Decoration */}
      <div className="mt-20 flex items-center justify-center gap-4 opacity-5 pointer-events-none">
        <div className="w-16 h-[1px] bg-white" />
        <p className="text-[8px] font-black uppercase tracking-[1em]">Tactical_Territory_Integrity_Locked</p>
        <div className="w-16 h-[1px] bg-white" />
      </div>
    </div>
  );
}

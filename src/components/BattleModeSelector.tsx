'use client';

import { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Bot, Dumbbell, AlertCircle, ArrowLeft } from 'lucide-react';

export type BattleMode = 'random' | 'ai' | 'gym';

interface BattleModeSelectorProps {
  onModeSelect: (mode: BattleMode) => void;
  onBack: () => void;
}

export default function BattleModeSelector({ onModeSelect, onBack }: BattleModeSelectorProps) {
  const account = useCurrentAccount();
  const [selectedMode, setSelectedMode] = useState<BattleMode | null>(null);

  const handleModeSelect = (mode: BattleMode): void => {
    if (!account) {
      return;
    }
    setSelectedMode(mode);
    onModeSelect(mode);
  };

  return (
    <div className="min-h-screen bg-[#010101] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Tech Layer */}
      <div className="absolute inset-0 tech-bg-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />

      {/* Animated Pulses */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

      <div className="max-w-6xl w-full relative z-10 flex flex-col gap-8">

        {/* Navigation & Header HUD */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-primary/20 pb-8">
          <div className="flex items-center gap-6">
            <button
              onClick={onBack}
              className="group relative p-4 bg-white/5 border border-white/10 hover:border-primary transition-all rounded-tr-xl flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
              <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t border-l border-primary/40 opacity-0 group-hover:opacity-100" />
            </button>
            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-[1px] bg-primary/40" />
                <span className="text-[10px] font-black tracking-[0.3em] text-primary/60 uppercase">Mission_Briefing</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase font-heading">
                SELECT <span className="text-primary neon-text-orange">PROTOCOL</span>
              </h1>
            </div>
          </div>

          {/* Status Info */}
          <div className="hidden lg:flex items-center gap-6 px-6 py-3 bg-black/40 border border-white/5 rounded-bl-2xl">
            <div className="text-right">
              <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Operation_Status</p>
              <p className="text-[10px] font-black text-green-500 uppercase flex items-center gap-2 justify-end">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Ready_To_Deploy
              </p>
            </div>
          </div>
        </div>

        {/* Wallet Warning */}
        {!account && (
          <div className="bg-red-500/10 border border-red-500/30 p-4 flex items-center gap-4 animate-shake">
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
            <div className="text-left">
              <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Unauthorized_Access_Detected</p>
              <p className="text-xs text-white/60">Neural link required. Connect wallet in Arena terminal to initialize combat protocols.</p>
            </div>
          </div>
        )}

        {/* Tactical Mode Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* 1. RANDOM MATCH */}
          <div
            onClick={() => account && handleModeSelect('random')}
            className={`group relative h-[400px] bg-black border cursor-pointer overflow-hidden transition-all duration-500 ${!account
              ? 'opacity-40 grayscale cursor-not-allowed border-white/5'
              : 'border-primary/20 hover:border-primary hover:shadow-[0_0_40px_rgba(255,107,0,0.1)]'
              }`}
          >
            {/* Design Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
              <div className="absolute w-24 h-[1px] bg-primary/20 rotate-45 translate-x-12 -translate-y-8" />
            </div>

            <div className="relative h-full p-8 flex flex-col">
              <div className="w-16 h-16 rounded bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,107,0,0.2)] transition-all">
                <Users className="w-8 h-8 text-primary" />
              </div>

              <div className="mb-4">
                <h3 className="text-3xl font-black italic uppercase text-white group-hover:text-primary transition-colors">Neural_PVP</h3>
                <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest mt-1">Random_Matchmaking_V2</p>
              </div>

              <div className="flex-1 space-y-3 mt-4 border-t border-primary/10 pt-6">
                <p className="text-[10px] font-black text-white/40 uppercase flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full" /> Sync_With_Global_Matrix
                </p>
                <p className="text-[10px] font-black text-white/40 uppercase flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full" /> Earn_Rank_Tier_Experience
                </p>
                <p className="text-[10px] font-black text-white/40 uppercase flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full" /> Dynamic_Opponent_Scaling
                </p>
              </div>

              <button className="w-full py-4 mt-8 bg-black border border-primary/30 text-primary font-black uppercase text-[10px] tracking-[0.2em] group-hover:bg-primary group-hover:text-black transition-all">
                Execute_Search
              </button>
            </div>
            {/* Bottom Accent */}
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary opacity-20 group-hover:opacity-100" />
          </div>

          {/* 2. AI BATTLE */}
          <div
            onClick={() => account && handleModeSelect('ai')}
            className={`group relative h-[400px] bg-black border cursor-pointer overflow-hidden transition-all duration-500 ${!account
              ? 'opacity-40 grayscale cursor-not-allowed border-white/5'
              : 'border-blue-500/20 hover:border-blue-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.1)]'
              }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative h-full p-8 flex flex-col">
              <div className="w-16 h-16 rounded bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all">
                <Bot className="w-8 h-8 text-blue-500" />
              </div>

              <div className="mb-4">
                <h3 className="text-3xl font-black italic uppercase text-white group-hover:text-blue-500 transition-colors">Core_AI</h3>
                <p className="text-[10px] font-black text-blue-500/40 uppercase tracking-widest mt-1">Combat_Simulation_Module</p>
              </div>

              <div className="flex-1 space-y-3 mt-4 border-t border-blue-500/10 pt-6">
                <p className="text-[10px] font-black text-white/40 uppercase flex items-center gap-2">
                  <div className="w-1 h-1 bg-blue-500 rounded-full" /> No_Network_Latency
                </p>
                <p className="text-[10px] font-black text-white/40 uppercase flex items-center gap-2">
                  <div className="w-1 h-1 bg-blue-500 rounded-full" /> Advance_Combat_Tactic_Testing
                </p>
                <p className="text-[10px] font-black text-white/40 uppercase flex items-center gap-2">
                  <div className="w-1 h-1 bg-blue-500 rounded-full" /> Zero_Risk_Deployment
                </p>
              </div>

              <button className="w-full py-4 mt-8 bg-black border border-blue-500/30 text-blue-500 font-black uppercase text-[10px] tracking-[0.2em] group-hover:bg-blue-500 group-hover:text-black transition-all">
                Initialize_Sync
              </button>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-500 opacity-20 group-hover:opacity-100" />
          </div>

          {/* 3. JABLIX GYM */}
          <div
            onClick={() => account && handleModeSelect('gym')}
            className={`group relative h-[400px] bg-black border cursor-pointer overflow-hidden transition-all duration-500 ${!account
              ? 'opacity-40 grayscale cursor-not-allowed border-white/5'
              : 'border-purple-500/20 hover:border-purple-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.1)]'
              }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative h-full p-8 flex flex-col">
              <div className="w-16 h-16 rounded bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all">
                <Dumbbell className="w-8 h-8 text-purple-500" />
              </div>

              <div className="mb-4">
                <h3 className="text-3xl font-black italic uppercase text-white group-hover:text-purple-500 transition-colors">Nexus_Gym</h3>
                <p className="text-[10px] font-black text-purple-500/40 uppercase tracking-widest mt-1">Private_Lobby_Protocol</p>
              </div>

              <div className="flex-1 space-y-3 mt-4 border-t border-purple-500/10 pt-6">
                <p className="text-[10px] font-black text-white/40 uppercase flex items-center gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full" /> Challenge_Known_Operators
                </p>
                <p className="text-[10px] font-black text-white/40 uppercase flex items-center gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full" /> Managed_Arena_Environment
                </p>
                <p className="text-[10px] font-black text-white/40 uppercase flex items-center gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full" /> Unit_Specialization_Training
                </p>
              </div>

              <button className="w-full py-4 mt-8 bg-black border border-purple-500/30 text-purple-500 font-black uppercase text-[10px] tracking-[0.2em] group-hover:bg-purple-500 group-hover:text-black transition-all">
                Secure_Access
              </button>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-purple-500 opacity-20 group-hover:opacity-100" />
          </div>

        </div>

        {/* HUD Footer */}
        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
              <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Neural_Net_Link_Established</p>
            </div>
            <div className="w-[1px] h-3 bg-white/10 hidden md:block" />
            <p className="text-[9px] font-mono text-white/20">V_0.8.2_BETA // [DRARIUX_OS]</p>
          </div>
          <p className="text-[9px] font-black text-white/10 italic">"VICTORY THROUGH SUPERIOR PROTOCOL"</p>
        </div>
      </div>
    </div>
  );
}

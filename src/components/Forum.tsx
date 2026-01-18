'use client';

import {
  ArrowLeft,
  MessageSquare,
  Users,
  Trophy,
  Lightbulb,
  Gamepad2,
  Globe,
  Radio,
  Signal,
  Wifi,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface ForumProps {
  onBackToMain: () => void;
}

export default function Forum({ onBackToMain }: ForumProps) {
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
                <span className="text-[10px] font-black tracking-[0.3em] text-primary/60 uppercase">COMMUNITY_LINK</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase font-heading">
                NEURAL <span className="text-primary neon-text-orange">FORUM</span>
              </h1>
            </div>
          </div>

          {/* Network Status HUD */}
          <div className="hidden lg:flex items-center gap-6 bg-black/40 border border-white/10 px-6 py-3 rounded-bl-3xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Global_Relay: ACTIVE</span>
            </div>
            <div className="w-[1px] h-6 bg-white/10" />
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary/60" />
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Active_Nodes: 4,209</span>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="max-w-4xl mx-auto relative group">
          <div className="absolute inset-0 bg-primary/5 rounded-tr-[5rem] border border-white/10 group-hover:border-primary/40 transition-all duration-500" />
          <div className="relative p-12 lg:p-20 text-center">
            <div className="w-24 h-24 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-10 group-hover:scale-110 transition-transform duration-500">
              <Radio className="w-12 h-12 text-primary animate-pulse" />
            </div>

            <h2 className="text-5xl lg:text-7xl font-black italic tracking-tighter text-white uppercase font-heading mb-6">
              SIGNAL_<span className="text-primary neon-text-orange">PENDING</span>
            </h2>

            <p className="text-xs lg:text-sm text-white/40 uppercase tracking-[0.4em] mb-12 max-w-[500px] mx-auto leading-relaxed">
              "Data transmission of community neural threads is currently suppressed. Full frequency spectrum access granted in upcoming system maintenance."
            </p>

            {/* Planned Modules HUD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { icon: Lightbulb, label: 'Strategy_Guides', detail: 'DEEP_DIVE' },
                { icon: Gamepad2, label: 'Gameplay_Tips', detail: 'TACTICAL' },
                { icon: Trophy, label: 'Tournament_Feed', detail: 'ELITE' }
              ].map((item, idx) => (
                <div key={idx} className="bg-black/60 border border-white/5 p-6 rounded-xl hover:border-primary/30 transition-all group/item">
                  <item.icon className="w-8 h-8 text-primary/40 group-hover/item:text-primary transition-colors mx-auto mb-4" />
                  <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{item.label}</p>
                  <div className="w-8 h-[1px] bg-primary/20 mx-auto group-hover/item:w-16 transition-all" />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full" />
                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Encrypted_Channels</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full" />
                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Neural_Bridges</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer HUD Quote */}
        <div className="mt-20 flex items-center justify-center gap-4 opacity-10">
          <div className="w-12 h-[1px] bg-white" />
          <p className="text-[9px] font-black uppercase tracking-[1em]">Knowledge_Is_The_Ultimate_Refinement</p>
          <div className="w-12 h-[1px] bg-white" />
        </div>
      </div>
    </div>
  );
}

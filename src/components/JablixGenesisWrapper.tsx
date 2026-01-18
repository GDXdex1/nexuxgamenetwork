'use client';

import { useState } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useSuiData } from '@/hooks/useSuiData';
import { ELEMENTAL_JABLIX_DATABASE, type ElementalJablixData, getAllMintableElementals } from '@/data/elementalJablixDatabase';
import { SPECIAL_JABLIX_DATABASE, type SpecialJablixData, getAllMintableSpecials } from '@/data/specialJablixDatabase';
import { toast } from 'sonner';
import { createMintElementalTransaction, createMintSpecialTransaction, formatMintTxResult } from '@/utils/mintTransactions';
import {
  Zap,
  ArrowLeft,
  Sparkles,
  Sword,
  Shield,
  Waves,
  Flame,
  Cpu,
  Box,
  Target,
  Info,
  ChevronRight,
  Heart
} from 'lucide-react';

interface JablixGenesisWrapperProps {
  onBackToMain: () => void;
}

export default function JablixGenesisWrapper({ onBackToMain }: JablixGenesisWrapperProps) {
  const account = useCurrentAccount();
  const { jxcBalance, jxcCoinId, refetch } = useSuiData();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const [selectedTab, setSelectedTab] = useState<'elemental' | 'special'>('elemental');
  const [selectedJablix, setSelectedJablix] = useState<ElementalJablixData | SpecialJablixData | null>(null);
  const [isMinting, setIsMinting] = useState(false);

  const elementalJablixes = getAllMintableElementals();
  const specialJablixes = getAllMintableSpecials();

  const handleMint = async () => {
    if (!account?.address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!jxcCoinId) {
      toast.error('No JXC coins found. Please acquire some JXC first.');
      return;
    }

    if (!selectedJablix) {
      toast.error('Please select a Jablix to mint');
      return;
    }

    const mintCost = selectedTab === 'elemental' ? 1000 : 2000;

    if (jxcBalance < mintCost) {
      toast.error(`Insufficient JXC balance. Need ${mintCost} JXC, have ${jxcBalance.toFixed(2)} JXC`);
      return;
    }

    setIsMinting(true);

    try {
      const tx = selectedTab === 'elemental'
        ? createMintElementalTransaction(jxcCoinId, selectedJablix.id)
        : createMintSpecialTransaction(jxcCoinId, selectedJablix.id);

      const result = await signAndExecuteTransaction({
        transaction: tx,
      });

      if (result.digest) {
        const formattedResult = formatMintTxResult(
          result.digest,
          selectedTab,
          selectedJablix.id
        );

        toast.success(formattedResult.message, {
          description: `View on explorer`,
          action: {
            label: 'View',
            onClick: () => window.open(formattedResult.explorerUrl, '_blank'),
          },
        });

        // Refetch balances and NFTs
        await refetch();
        setSelectedJablix(null);
      }
    } catch (error: unknown) {
      console.error('Minting failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Transaction failed';
      toast.error('Minting failed', {
        description: errorMessage,
      });
    } finally {
      setIsMinting(false);
    }
  };

  const currentList = selectedTab === 'elemental' ? elementalJablixes : specialJablixes;
  const mintCost = selectedTab === 'elemental' ? 1000 : 2000;

  return (
    <div className="min-h-screen bg-[#010101] text-white p-4 md:p-8 relative overflow-hidden font-sans">
      {/* Background Tech Layer */}
      <div className="absolute inset-0 tech-bg-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Top Navigation HUD */}
        <div className="flex items-center justify-between mb-8 border-b border-primary/20 pb-6">
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
                <span className="text-[10px] font-black tracking-[0.3em] text-primary/60 uppercase">Fabrication_Module</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase font-heading">
                JABLIX <span className="text-primary neon-text-orange">GENESIS</span>
              </h1>
            </div>
          </div>

          {/* Wallet HUD Mini */}
          <div className="hidden md:flex flex-col items-end px-6 py-2 bg-black/40 border-l border-primary/50 skew-x-[-12deg]">
            <div className="skew-x-[12deg] text-right">
              <p className="text-[8px] font-black text-primary/40 uppercase tracking-widest">Active_Balance</p>
              <p className="text-xl font-black text-white">{jxcBalance.toLocaleString()} <span className="text-primary text-xs">JXC</span></p>
            </div>
          </div>
        </div>

        {/* Tab Selection HUD */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => {
              setSelectedTab('elemental');
              setSelectedJablix(null);
            }}
            className={`flex-1 relative overflow-hidden group py-6 px-8 rounded transition-all duration-300 ${selectedTab === 'elemental'
              ? 'bg-primary/20 border-t-2 border-primary'
              : 'bg-white/5 border border-white/5 hover:bg-white/10'
              }`}
          >
            <div className={`flex flex-col items-center justify-center gap-2 ${selectedTab === 'elemental' ? 'text-primary' : 'text-white/40'}`}>
              <Flame className={`w-6 h-6 ${selectedTab === 'elemental' ? 'animate-pulse' : ''}`} />
              <span className="text-sm font-black uppercase tracking-widest">Elemental_Units</span>
              <span className="text-[10px] font-mono opacity-60">COST: 1000 JXC</span>
            </div>
            {selectedTab === 'elemental' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary tech-scan opacity-40" />}
          </button>

          <button
            onClick={() => {
              setSelectedTab('special');
              setSelectedJablix(null);
            }}
            className={`flex-1 relative overflow-hidden group py-6 px-8 rounded transition-all duration-300 ${selectedTab === 'special'
              ? 'bg-purple-500/20 border-t-2 border-purple-500'
              : 'bg-white/5 border border-white/5 hover:bg-white/10'
              }`}
          >
            <div className={`flex flex-col items-center justify-center gap-2 ${selectedTab === 'special' ? 'text-purple-400' : 'text-white/40'}`}>
              <Sparkles className={`w-6 h-6 ${selectedTab === 'special' ? 'animate-pulse' : ''}`} />
              <span className="text-sm font-black uppercase tracking-widest">Class_S_Special</span>
              <span className="text-[10px] font-mono opacity-60">COST: 2000 JXC</span>
            </div>
            {selectedTab === 'special' && <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-500 tech-scan opacity-40" />}
          </button>
        </div>

        {/* Tactical View Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-12">
          {currentList.map((jablix: ElementalJablixData | SpecialJablixData) => (
            <div
              key={jablix.id}
              onClick={() => setSelectedJablix(jablix)}
              className={`relative bg-black border p-2 group cursor-pointer transition-all duration-300 rounded-tr-xl overflow-hidden ${selectedJablix?.id === jablix.id
                ? (selectedTab === 'elemental' ? 'border-primary ring-1 ring-primary/50' : 'border-purple-500 ring-1 ring-purple-500/50')
                : 'border-white/10 hover:border-white/30'
                }`}
            >
              <div className="aspect-square bg-white/5 rounded-bl-xl overflow-hidden mb-3 relative">
                {/* Visual ID Badge */}
                <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded text-[8px] font-mono font-bold text-white/60 z-10 border border-white/10">
                  ID_{jablix.id}
                </div>

                <img
                  src={jablix.imageUrl}
                  alt={jablix.name}
                  className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${selectedJablix?.id === jablix.id ? 'brightness-125' : 'brightness-75 group-hover:brightness-100'}`}
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    e.currentTarget.src = 'https://via.placeholder.com/150?text=Jablix';
                  }}
                />

                {/* Selection Highlight */}
                {selectedJablix?.id === jablix.id && (
                  <div className={`absolute bottom-0 left-0 w-full h-0.5 ${selectedTab === 'elemental' ? 'bg-primary' : 'bg-purple-500'} animate-pulse`} />
                )}
              </div>

              <div className="px-1">
                <h3 className="text-[11px] font-black uppercase text-white tracking-widest truncate mb-2">{jablix.name}</h3>

                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-between text-[8px] font-mono">
                    <span className="text-red-500">HP</span>
                    <span>{jablix.hp}</span>
                  </div>
                  <div className="flex items-center justify-between text-[8px] font-mono">
                    <span className="text-orange-500">ATK</span>
                    <span>{jablix.attack}</span>
                  </div>
                  <div className="flex items-center justify-between text-[8px] font-mono">
                    <span className="text-blue-500">DEF</span>
                    <span>{jablix.defense}</span>
                  </div>
                  <div className="flex items-center justify-between text-[8px] font-mono">
                    <span className="text-green-500">SPD</span>
                    <span>{jablix.speed}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mint Preview Panel (Bottom HUD) */}
        {selectedJablix && (
          <div className="fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-xl border-t-2 border-primary/50 z-50 animate-slide-in">
            <div className="container mx-auto max-w-7xl p-6 flex flex-col md:flex-row items-center gap-8">
              {/* Large Preview */}
              <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-tr-3xl border border-primary/30 overflow-hidden bg-white/5">
                <img
                  src={selectedJablix.imageUrl}
                  alt={selectedJablix.name}
                  className="w-full h-full object-cover p-2 jablix-idle"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Tactical Stats HUD */}
              <div className="flex-1 w-full">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                  <div>
                    <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-1">Target_Subject</p>
                    <h2 className="text-4xl md:text-5xl font-black italic text-white uppercase font-heading">{selectedJablix.name}</h2>
                  </div>
                  <div className="flex items-center gap-6 bg-white/5 px-6 py-4 rounded border border-white/10">
                    <div className="text-center">
                      <p className="text-[8px] font-black text-white/40 uppercase">Class_Type</p>
                      <p className={`text-sm font-black uppercase ${selectedTab === 'elemental' ? 'text-primary' : 'text-purple-400'}`}>
                        {selectedTab === 'elemental' ? 'Elemental' : 'Special_Gen'}
                      </p>
                    </div>
                    <div className="w-[1px] h-8 bg-white/10" />
                    <div className="text-center">
                      <p className="text-[8px] font-black text-white/40 uppercase">Neural_ID</p>
                      <p className="text-sm font-mono font-black text-white">#00{selectedJablix.id}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { label: 'HP_Vitality', value: selectedJablix.hp, icon: Heart, color: 'text-red-500' },
                    { label: 'ATK_Power', value: selectedJablix.attack, icon: Sword, color: 'text-orange-500' },
                    { label: 'DEF_Structure', value: selectedJablix.defense, icon: Shield, color: 'text-blue-500' },
                    { label: 'SPD_Response', value: selectedJablix.speed, icon: Target, color: 'text-green-500' },
                    { label: 'ENG_Reactor', value: selectedJablix.energy, icon: Zap, color: 'text-yellow-500' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-black/40 border border-white/5 p-3 flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <div className={`${stat.color} opacity-80`}>
                          {/* Use icons manually due to specific requirements */}
                          {stat.label === 'HP_Vitality' && <Info className="w-3 h-3" />}
                          {stat.label === 'ATK_Power' && <Sword className="w-3 h-3" />}
                          {stat.label === 'DEF_Structure' && <Shield className="w-3 h-3" />}
                          {stat.label === 'SPD_Response' && <Target className="w-3 h-3" />}
                          {stat.label === 'ENG_Reactor' && <Zap className="w-3 h-3" />}
                        </div>
                        <span className="text-[8px] font-black text-white/40 uppercase truncate">{stat.label}</span>
                      </div>
                      <span className="text-xl font-black text-white">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mint Execution HUD */}
              <div className="w-full md:w-72 flex flex-col gap-3">
                <div className="bg-primary/10 border border-primary/30 p-4 rounded-tr-2xl">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-primary uppercase">Fuel_Required</span>
                    <span className="text-xl font-black text-white">{mintCost} <span className="text-xs">JXC</span></span>
                  </div>
                  {jxcBalance < mintCost && (
                    <p className="text-[8px] font-black text-red-500 uppercase mt-2 animate-pulse">Insufficient_JXC_Assets</p>
                  )}
                </div>

                <button
                  onClick={handleMint}
                  disabled={isMinting || jxcBalance < mintCost || !account}
                  className={`w-full py-5 rounded-bl-2xl font-black uppercase text-sm tracking-[0.2em] transition-all relative overflow-hidden group/btn ${isMinting || jxcBalance < mintCost || !account
                    ? 'bg-white/5 text-white/20 cursor-not-allowed'
                    : 'bg-primary text-black hover:bg-white hover:text-primary shadow-[0_0_30px_rgba(255,107,0,0.3)]'
                    }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isMinting ? 'Fabricating...' : 'Initiate_Genesis'}
                    {!isMinting && <ChevronRight className="w-4 h-4" />}
                  </span>
                  <div className="absolute inset-0 tech-scan bg-white/20 opacity-0 group-hover/btn:opacity-100" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client'

import { useState } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useUserJabs } from '@/hooks/useSuiData';
import { useSuiClientQuery } from '@mysten/dapp-kit';
import { COIN_TYPES } from '@/config/suiConfig';
import {
  ELEMENTAL_EVOLUTION_CHAINS,
  SPECIAL_EVOLUTION_CHAINS,
  getEvolutionChainForJablix,
  getNextEvolution,
  canEvolve,
  getCurrentPhase
} from '@/data/evolutionChains';
import { createEvolveElementalTransaction, createEvolveSpecialTransaction } from '@/utils/evolutionTransactions';
import { toast } from 'sonner';
import {
  Loader2,
  ArrowRight,
  Sparkles,
  ArrowLeft,
  Zap,
  Shield,
  Sword,
  Cpu,
  Dna,
  Activity,
  Box,
  ChevronRight,
  TrendingUp,
  Info,
  Coins
} from 'lucide-react';
import { getElementalJablixData } from '@/data/elementalJablixDatabase';
import { getSpecialJablixData } from '@/data/specialJablixDatabase';

interface JablixEvolutionProps {
  onBackToMain: () => void;
}

export default function JablixEvolution({ onBackToMain }: JablixEvolutionProps) {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const jabsQuery = useUserJabs();
  const [isEvolving, setIsEvolving] = useState(false);

  // Get user's JXC coins for payment
  const { data: jxcCoins } = useSuiClientQuery(
    'getCoins',
    {
      owner: account?.address || '',
      coinType: COIN_TYPES.JXC,
    },
    {
      enabled: !!account?.address,
    }
  );

  const userJabs = jabsQuery.data || [];

  // Filter Jabs that can evolve (both elementals and specials)
  const evolvableJabs = userJabs.filter(jab => {
    return canEvolve(jab.type_id, jab.type);
  });

  const handleEvolve = async (jab: typeof userJabs[0]): Promise<void> => {
    if (!account) {
      toast.error('Please connect your wallet');
      return;
    }

    const nextEvolutionId = getNextEvolution(jab.type_id, jab.type);
    if (!nextEvolutionId) {
      toast.error('This Jab cannot evolve further');
      return;
    }

    // Check if user has JXC coins
    if (!jxcCoins || jxcCoins.data.length === 0) {
      toast.error('You need JXC to evolve your Jablix. Cost: 1,500 JXC');
      return;
    }

    // Get the first JXC coin for payment
    const jxcCoinId = jxcCoins.data[0].coinObjectId;

    try {
      setIsEvolving(true);
      const tx = jab.type === 'special'
        ? createEvolveSpecialTransaction(jxcCoinId, jab.id)
        : createEvolveElementalTransaction(jxcCoinId, jab.id);

      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: (result) => {
            const txUrl = `https://suiscan.xyz/testnet/tx/${result.digest}`;
            toast.success(
              <div className="bg-black border border-primary/50 p-4 rounded-xl">
                <p className="font-black text-primary uppercase text-xs mb-2 tracking-widest">Evolution_Successful</p>
                <div className="flex items-center gap-2">
                  <a href={txUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-white/60 hover:text-white uppercase transition-colors underline decoration-primary/30">
                    View_On_Scanner
                  </a>
                </div>
              </div>,
              { duration: 5000 }
            );
            setIsEvolving(false);
            jabsQuery.refetch();
          },
          onError: (error) => {
            console.error('Evolution error:', error);
            toast.error(`Evolution failed: ${error.message}`);
            setIsEvolving(false);
          },
        }
      );
    } catch (error) {
      console.error('Evolution error:', error);
      toast.error('Failed to evolve Jab');
      setIsEvolving(false);
    }
  };

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
                <span className="text-[10px] font-black tracking-[0.3em] text-primary/60 uppercase">Unit_Mutator</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase font-heading">
                NEURAL <span className="text-primary neon-text-orange">EVOLUTION</span>
              </h1>
            </div>
          </div>

          {/* Status Indicator HUD */}
          <div className="hidden lg:flex items-center gap-8 bg-black/40 border border-white/10 px-8 py-4 rounded-bl-3xl backdrop-blur-md">
            <div className="text-center">
              <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Mutation_Integrity</p>
              <p className="text-xl font-black text-primary animate-pulse">OPTIMIZED</p>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Protocol_V_0.9</p>
              <div className="flex gap-1 mt-1">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <div className="w-2 h-2 bg-primary/40 rounded-full" />
                <div className="w-2 h-2 bg-primary/20 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Global Evolution Chains Visualization */}
        <div className="mb-12 relative">
          <div className="flex items-center gap-4 mb-6">
            <Cpu className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-black italic uppercase tracking-widest">Core_Mutation_Chains</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Elemental Chains */}
            {ELEMENTAL_EVOLUTION_CHAINS.map((chain, index) => {
              const p1 = getElementalJablixData(chain.phase1);
              const p2 = chain.phase2 ? getElementalJablixData(chain.phase2) : null;
              const p3 = chain.phase3 ? getElementalJablixData(chain.phase3) : null;

              return (
                <div key={`elem-${index}`} className="group relative bg-black/40 border border-white/5 p-4 rounded-xl hover:border-primary/30 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 rounded border border-white/10 overflow-hidden p-1">
                      {p1 && <img src={p1.imageUrl} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" alt="" />}
                    </div>
                    <ArrowRight className="w-3 h-3 text-white/20" />
                    <div className="w-10 h-10 bg-primary/5 rounded border border-primary/20 overflow-hidden p-1">
                      {p2 && <img src={p2.imageUrl} className="w-full h-full object-contain group-hover:scale-110 transition-transform" alt="" />}
                    </div>
                    {p3 && (
                      <>
                        <ArrowRight className="w-3 h-3 text-white/20" />
                        <div className="w-12 h-12 bg-primary/10 rounded border border-primary/40 overflow-hidden p-1 shadow-[0_0_15px_rgba(255,107,0,0.1)]">
                          <img src={p3.imageUrl} className="w-full h-full object-contain group-hover:scale-110 transition-transform" alt="" />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-white/20 uppercase">Chain_ID</p>
                    <p className="text-[10px] font-black text-primary/60 uppercase">{p1?.elements[0] || 'CORE'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* User's Evolution Interface */}
        <div className="relative">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-black italic uppercase tracking-widest text-primary neon-text-orange">Evolvable_Assets</h2>
            </div>
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-white/40 uppercase tracking-widest">
              Units_Detected: {evolvableJabs.length}
            </div>
          </div>

          {evolvableJabs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl">
              <Dna className="w-12 h-12 text-white/10 mb-4" />
              <p className="text-white/30 font-black uppercase tracking-[0.3em] text-[10px]">No_Compatible_Subjects_Detected</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {evolvableJabs.map(jab => {
                const currentPhase = getCurrentPhase(jab.type_id);
                const nextId = getNextEvolution(jab.type_id, jab.type);
                const currentData = jab.type === 'special' ? getSpecialJablixData(jab.type_id) : getElementalJablixData(jab.type_id);
                const nextData = nextId ? (jab.type === 'special' ? getSpecialJablixData(nextId) : getElementalJablixData(nextId)) : null;

                return (
                  <div key={jab.id} className="group relative bg-black border border-white/10 rounded-tr-[3rem] p-8 overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -translate-y-16 translate-x-16 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
                      {/* Evolution Subject Comparison */}
                      <div className="flex items-center gap-6 flex-1 w-full lg:w-auto">
                        <div className="flex-1 text-center group/unit">
                          <div className="relative aspect-square w-32 mx-auto mb-4 bg-white/5 border border-white/10 rounded-xl p-4 overflow-hidden group-hover/unit:border-white/30 transition-all">
                            <img src={jab.image || currentData?.imageUrl} alt="" className="w-full h-full object-contain grayscale group-hover/unit:grayscale-0 transition-all" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          </div>
                          <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Subject_Origin</p>
                          <h4 className="font-black text-white uppercase text-sm mt-1">{jab.name}</h4>
                          <span className="text-[8px] font-black text-primary uppercase bg-primary/10 px-2 py-0.5 rounded mt-2 inline-block">Phase_0{currentPhase}</span>
                        </div>

                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center animate-pulse">
                            <ArrowRight className="w-4 h-4 text-primary" />
                          </div>
                          <div className="w-[2px] h-12 bg-gradient-to-b from-primary/40 via-primary/10 to-transparent" />
                        </div>

                        <div className="flex-1 text-center group/result">
                          <div className="relative aspect-square w-32 mx-auto mb-4 bg-primary/5 border border-primary/20 rounded-xl p-4 overflow-hidden group-hover/result:border-primary/50 transition-all">
                            {nextData && <img src={nextData.imageUrl} alt="" className="w-full h-full object-contain group-hover/result:scale-110 transition-all" />}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40" />
                          </div>
                          <p className="text-[9px] font-black text-primary uppercase tracking-widest">Mutation_Target</p>
                          <h4 className="font-black text-white uppercase text-sm mt-1">{nextData?.name || 'UNKNOWN'}</h4>
                          <span className="text-[8px] font-black text-white/40 uppercase bg-white/5 px-2 py-0.5 rounded mt-2 inline-block">Phase_0{currentPhase + 1}</span>
                        </div>
                      </div>

                      {/* Stats Reconstruction HUD */}
                      <div className="w-full lg:w-64 bg-white/5 border border-white/10 p-6 rounded-tr-2xl relative">
                        <div className="flex items-center gap-2 mb-4">
                          <TrendingUp className="w-3 h-3 text-green-500" />
                          <span className="text-[10px] font-black uppercase text-white/60 tracking-widest">Spec_Enhancements</span>
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between items-end">
                            <span className="text-[9px] font-black text-white/30 uppercase">Atk_Boost</span>
                            <span className="text-xs font-black text-green-500">+{nextData ? nextData.attack - jab.attack : '??'}</span>
                          </div>
                          <div className="flex justify-between items-end">
                            <span className="text-[9px] font-black text-white/30 uppercase">Hp_Expansion</span>
                            <span className="text-xs font-black text-green-500">+{nextData ? nextData.hp - jab.hp : '??'}</span>
                          </div>
                          <div className="flex justify-between items-end">
                            <span className="text-[9px] font-black text-white/30 uppercase">Spd_Tuning</span>
                            <span className="text-xs font-black text-green-500">+{nextData ? nextData.speed - jab.speed : '??'}</span>
                          </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5">
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                              <Coins className="w-3 h-3 text-primary" />
                              <span className="text-[9px] font-black text-white/40 uppercase">Fuel_Cost</span>
                            </div>
                            <span className="text-xs font-black text-primary">1,500 JXC</span>
                          </div>

                          <button
                            onClick={() => handleEvolve(jab)}
                            disabled={isEvolving}
                            className="w-full py-4 bg-primary text-black font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all rounded shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                          >
                            {isEvolving ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Zap className="w-3 h-3" />
                                Execute_Evolution
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Background HUD Quote */}
      <div className="mt-20 flex items-center justify-center gap-4 opacity-10">
        <div className="w-12 h-[1px] bg-white" />
        <p className="text-[10px] font-black uppercase tracking-[0.8em]">Survival_Through_Adaptation</p>
        <div className="w-12 h-[1px] bg-white" />
      </div>
    </div>
  );
}

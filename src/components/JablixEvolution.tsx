'use client'

import { useState } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useUserJabs } from '@/hooks/useSuiData';
import { useSuiClientQuery } from '@mysten/dapp-kit';
import { COIN_TYPES } from '@/config/suiConfig';
import { getJablixById } from '@/data/jablixDatabase';
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
import { Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { getElementalJablixData } from '@/data/elementalJablixDatabase';
import { getSpecialJablixData } from '@/data/specialJablixDatabase';

interface JablixEvolutionProps {
  onBackToMain: () => void;
}

export default function JablixEvolution({ onBackToMain }: JablixEvolutionProps) {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const jabsQuery = useUserJabs();
  const [selectedJabId, setSelectedJabId] = useState<string | null>(null);
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
              <div>
                <p className="font-bold">Evolution successful!</p>
                <a href={txUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">
                  View on Suiscan
                </a>
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-orange-800 relative overflow-hidden">
      {/* Banner */}
      <div className="relative z-10 w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/30 to-transparent blur-3xl" />
        <img 
          src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/29973595-1e22-47bd-ac6d-ee040ee06efa-7GPiFWVzCQ093tX2AJdbk337pDSHA7" 
          alt="Jablix Evolution"
          className="w-full h-56 md:h-72 lg:h-96 object-cover border-b-4 border-pink-500 shadow-2xl relative"
          style={{
            filter: 'brightness(1.1) contrast(1.2) saturate(1.3) hue-rotate(15deg)',
          }}
        />
        
        {/* Back Button */}
        <button
          onClick={onBackToMain}
          className="absolute top-4 right-4 bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-500 hover:to-orange-500
                   text-white font-bold py-3 px-6 rounded-xl shadow-lg
                   transition-all duration-300 transform hover:scale-105 border-2 border-pink-300"
        >
          ← Back
        </button>
      </div>

      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-3xl animate-pulse top-20 -left-40" />
        <div className="absolute w-[600px] h-[600px] bg-pink-500/20 rounded-full blur-3xl animate-pulse bottom-20 -right-40" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-orange-300 mb-4">
            <Sparkles className="inline-block mr-3 mb-2" size={48} />
            JABLIX EVOLUTION
            <Sparkles className="inline-block ml-3 mb-2" size={48} />
          </h1>
          <p className="text-xl text-pink-200 font-semibold">
            Evolve your Jabs to unlock their true potential!
          </p>
        </div>

        {/* Evolution Chains Reference */}
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-900/80 to-pink-900/80 backdrop-blur-lg rounded-2xl border-2 border-pink-400/30 shadow-2xl">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300 mb-4">
            📚 Elemental Evolution Chains
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ELEMENTAL_EVOLUTION_CHAINS.map((chain, index) => {
              const phase1Data = getElementalJablixData(chain.phase1);
              const phase2Data = chain.phase2 ? getElementalJablixData(chain.phase2) : null;
              const phase3Data = chain.phase3 ? getElementalJablixData(chain.phase3) : null;

              return (
                <div key={index} className="p-4 bg-gradient-to-br from-purple-800/50 to-pink-800/50 rounded-xl border border-pink-400/20">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-1 rounded-lg overflow-hidden border-2 border-pink-400/30">
                        {phase1Data && (
                          <img src={phase1Data.imageUrl} alt={phase1Data.name} className="w-full h-full object-contain" style={{ backgroundColor: 'transparent' }} />
                        )}
                      </div>
                      <p className="text-pink-200 font-semibold text-xs">{phase1Data?.name}</p>
                    </div>
                    
                    <ArrowRight className="text-orange-400" size={16} />
                    
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-1 rounded-lg overflow-hidden border-2 border-pink-400/30">
                        {phase2Data && (
                          <img src={phase2Data.imageUrl} alt={phase2Data.name} className="w-full h-full object-contain" style={{ backgroundColor: 'transparent' }} />
                        )}
                      </div>
                      <p className="text-pink-200 font-semibold text-xs">{phase2Data?.name}</p>
                    </div>
                    
                    {phase3Data && (
                      <>
                        <ArrowRight className="text-orange-400" size={16} />
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-1 rounded-lg overflow-hidden border-2 border-pink-400/30">
                            <img src={phase3Data.imageUrl} alt={phase3Data.name} className="w-full h-full object-contain" style={{ backgroundColor: 'transparent' }} />
                          </div>
                          <p className="text-pink-200 font-semibold text-xs">{phase3Data.name}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Special Evolution Chains Reference */}
        <div className="mb-8 p-6 bg-gradient-to-r from-indigo-900/80 to-purple-900/80 backdrop-blur-lg rounded-2xl border-2 border-indigo-400/30 shadow-2xl">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 mb-4">
            ✨ Special Evolution Chains
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SPECIAL_EVOLUTION_CHAINS.map((chain, index) => {
              const phase1Data = getSpecialJablixData(chain.phase1);
              const phase2Data = chain.phase2 ? getSpecialJablixData(chain.phase2) : null;

              return (
                <div key={index} className="p-4 bg-gradient-to-br from-indigo-800/50 to-purple-800/50 rounded-xl border border-indigo-400/20">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-1 rounded-lg overflow-hidden border-2 border-indigo-400/30">
                        {phase1Data && (
                          <img src={phase1Data.imageUrl} alt={phase1Data.name} className="w-full h-full object-contain" style={{ backgroundColor: 'transparent' }} />
                        )}
                      </div>
                      <p className="text-indigo-200 font-semibold text-xs">{phase1Data?.name}</p>
                    </div>
                    
                    <ArrowRight className="text-purple-400" size={16} />
                    
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-1 rounded-lg overflow-hidden border-2 border-indigo-400/30">
                        {phase2Data && (
                          <img src={phase2Data.imageUrl} alt={phase2Data.name} className="w-full h-full object-contain" style={{ backgroundColor: 'transparent' }} />
                        )}
                      </div>
                      <p className="text-indigo-200 font-semibold text-xs">{phase2Data?.name}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Your Evolvable Jabs */}
        <div className="p-6 bg-gradient-to-r from-purple-900/80 to-pink-900/80 backdrop-blur-lg rounded-2xl border-2 border-pink-400/30 shadow-2xl">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300 mb-4">
            🌟 Your Evolvable Jabs
          </h2>
          
          {!account ? (
            <p className="text-pink-200 text-center py-8">Please connect your wallet to view your Jabs</p>
          ) : evolvableJabs.length === 0 ? (
            <p className="text-pink-200 text-center py-8">You don't have any Jabs that can evolve right now</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {evolvableJabs.map(jab => {
                const currentPhase = getCurrentPhase(jab.type_id);
                const nextEvolutionId = getNextEvolution(jab.type_id, jab.type);
                const chain = getEvolutionChainForJablix(jab.type_id, jab.type);
                
                const currentData = jab.type === 'special' 
                  ? getSpecialJablixData(jab.type_id)
                  : getElementalJablixData(jab.type_id);
                const nextData = nextEvolutionId 
                  ? (jab.type === 'special' ? getSpecialJablixData(nextEvolutionId) : getElementalJablixData(nextEvolutionId))
                  : null;

                return (
                  <div key={jab.id} className="bg-gradient-to-br from-purple-800/50 to-pink-800/50 rounded-xl p-4 border-2 border-pink-400/30 hover:border-pink-400/60 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      {/* Current Jab */}
                      <div className="flex-1 text-center">
                        <div className="w-24 h-24 mx-auto mb-2 rounded-lg overflow-hidden border-2 border-pink-400/50">
                          <img src={jab.image || currentData?.imageUrl} alt={jab.name} className="w-full h-full object-contain" style={{ backgroundColor: 'transparent' }} />
                        </div>
                        <p className="text-pink-200 font-bold">{jab.name}</p>
                        <p className="text-orange-300 text-sm">Phase {currentPhase}</p>
                      </div>

                      {/* Arrow */}
                      <ArrowRight className="text-orange-400 animate-pulse" size={32} />

                      {/* Next Evolution */}
                      <div className="flex-1 text-center">
                        <div className="w-24 h-24 mx-auto mb-2 rounded-lg overflow-hidden border-2 border-orange-400/50">
                          {nextData && (
                            <img src={nextData.imageUrl} alt={nextData.name} className="w-full h-full object-contain" style={{ backgroundColor: 'transparent' }} />
                          )}
                        </div>
                        <p className="text-orange-200 font-bold">{nextData?.name}</p>
                        <p className="text-pink-300 text-sm">Phase {currentPhase + 1}</p>
                      </div>
                    </div>

                    {/* Stats Comparison */}
                    {nextData && (
                      <div className="mb-4 p-3 bg-purple-900/50 rounded-lg">
                        <p className="text-pink-200 text-sm mb-2 font-semibold">Stats Improvement:</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-pink-300">HP:</span> <span className="text-white">{jab.hp} → {nextData.hp}</span> <span className="text-green-400">(+{nextData.hp - jab.hp})</span>
                          </div>
                          <div>
                            <span className="text-pink-300">ATK:</span> <span className="text-white">{jab.attack} → {nextData.attack}</span> <span className="text-green-400">(+{nextData.attack - jab.attack})</span>
                          </div>
                          <div>
                            <span className="text-pink-300">DEF:</span> <span className="text-white">{jab.defense} → {nextData.defense}</span> <span className="text-green-400">(+{nextData.defense - jab.defense})</span>
                          </div>
                          <div>
                            <span className="text-pink-300">SPD:</span> <span className="text-white">{jab.speed} → {nextData.speed}</span> <span className="text-green-400">(+{nextData.speed - jab.speed})</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Evolve Button */}
                    <button
                      onClick={() => handleEvolve(jab)}
                      disabled={isEvolving}
                      className="w-full bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-500 hover:to-orange-500
                               text-white font-bold py-3 px-6 rounded-xl
                               transition-all duration-300 transform hover:scale-105 shadow-lg
                               border-2 border-pink-300 disabled:opacity-50 disabled:cursor-not-allowed
                               flex items-center justify-center gap-2"
                    >
                      {isEvolving ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          Evolving...
                        </>
                      ) : (
                        <>
                          <Sparkles size={20} />
                          Evolve Now!
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

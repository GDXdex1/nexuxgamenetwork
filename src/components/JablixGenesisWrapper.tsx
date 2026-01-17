'use client';

import { useState } from 'react';
import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { toast } from 'sonner';
import { useSuiData } from '@/hooks/useSuiData';
import { getAllMintableElementals } from '@/data/elementalJablixDatabase';
import { getAllMintableSpecials } from '@/data/specialJablixDatabase';
import { 
  createMintElementalTransaction, 
  createMintSpecialTransaction,
  formatMintTxResult 
} from '@/utils/mintTransactions';
import { jxcFromSmallestUnit } from '@/config/suiConfig';
import type { ElementalJablixData } from '@/data/elementalJablixDatabase';
import type { SpecialJablixData } from '@/data/specialJablixDatabase';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-pink-900 to-purple-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Banner */}
        <div className="mb-6 relative">
          <img
            src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/2f753da8-b6ed-409e-a565-46591f6149a2-VCTsn2VEutF5U0zCfCgz5ssiZpsXJv"
            alt="Jablix Genesis Banner"
            className="w-full h-56 md:h-72 lg:h-96 object-cover rounded-3xl border-4 border-pink-500/50 shadow-2xl"
          />
          <button
            onClick={onBackToMain}
            className="absolute top-4 right-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-xl transition-all transform hover:scale-105"
          >
            ← Back
          </button>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-br from-pink-900/80 to-purple-900/80 border-4 border-pink-500/50 rounded-3xl p-6 md:p-8 mb-6 shadow-2xl">
          <div className="mb-4">
            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
              ✨ JABLIX GENESIS ✨
            </h1>
          </div>

          <p className="text-lg md:text-xl text-pink-200 mb-4">
            Mint powerful new Jabs with unique stats and abilities!
          </p>

          {/* Wallet Info */}
          <div className="bg-black/30 rounded-2xl p-4 border-2 border-pink-500/30">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-sm text-gray-400">Wallet Connected</p>
                <p className="text-white font-mono text-sm">
                  {account?.address ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}` : 'Not connected'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">JXC Balance</p>
                <p className="text-2xl font-black text-yellow-400">
                  {jxcBalance.toLocaleString()} JXC
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => {
              setSelectedTab('elemental');
              setSelectedJablix(null);
            }}
            className={`flex-1 py-4 px-6 rounded-2xl font-black text-xl transition-all transform hover:scale-105 ${
              selectedTab === 'elemental'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-2xl'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            🔥 ELEMENTAL NFTs
            <div className="text-sm font-normal mt-1">1000 JXC</div>
          </button>
          <button
            onClick={() => {
              setSelectedTab('special');
              setSelectedJablix(null);
            }}
            className={`flex-1 py-4 px-6 rounded-2xl font-black text-xl transition-all transform hover:scale-105 ${
              selectedTab === 'special'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            ⭐ SPECIAL NFTs
            <div className="text-sm font-normal mt-1">2000 JXC</div>
          </button>
        </div>

        {/* Jablix Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
          {currentList.map((jablix: ElementalJablixData | SpecialJablixData) => (
            <button
              key={jablix.id}
              onClick={() => setSelectedJablix(jablix)}
              className={`bg-gradient-to-br ${
                selectedTab === 'elemental'
                  ? 'from-blue-900/60 to-cyan-900/60 border-blue-500/50'
                  : 'from-purple-900/60 to-pink-900/60 border-purple-500/50'
              } border-2 rounded-2xl p-4 transition-all transform hover:scale-105 ${
                selectedJablix?.id === jablix.id
                  ? 'ring-4 ring-yellow-400 scale-105'
                  : 'hover:border-white/50'
              }`}
            >
              <div className="aspect-square bg-black/30 rounded-xl mb-3 overflow-hidden">
                <img
                  src={jablix.imageUrl}
                  alt={jablix.name}
                  className="w-full h-full object-cover"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    e.currentTarget.src = 'https://via.placeholder.com/150?text=Jablix';
                  }}
                />
              </div>
              <h3 className="text-white font-bold text-sm mb-1">{jablix.name}</h3>
              <p className="text-xs text-gray-300">ID: {jablix.id}</p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">HP:</span>
                  <span className="text-red-400 font-bold">{jablix.hp}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">ATK:</span>
                  <span className="text-orange-400 font-bold">{jablix.attack}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">DEF:</span>
                  <span className="text-blue-400 font-bold">{jablix.defense}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">SPD:</span>
                  <span className="text-green-400 font-bold">{jablix.speed}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Mint Panel */}
        {selectedJablix && (
          <div className="bg-gradient-to-br from-pink-900/80 to-purple-900/80 border-4 border-pink-500/50 rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="aspect-square bg-black/30 rounded-2xl overflow-hidden">
                  <img
                    src={selectedJablix.imageUrl}
                    alt={selectedJablix.name}
                    className="w-full h-full object-cover"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      e.currentTarget.src = 'https://via.placeholder.com/300?text=Jablix';
                    }}
                  />
                </div>
              </div>
              
              <div className="md:w-2/3">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                  {selectedJablix.name}
                </h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-black/30 rounded-xl p-4 border-2 border-pink-500/30">
                    <p className="text-sm text-gray-400 mb-1">Type ID</p>
                    <p className="text-2xl font-black text-pink-400">#{selectedJablix.id}</p>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4 border-2 border-purple-500/30">
                    <p className="text-sm text-gray-400 mb-1">Category</p>
                    <p className="text-2xl font-black text-purple-400">
                      {selectedTab === 'elemental' ? 'Elemental' : 'Special'}
                    </p>
                  </div>
                </div>

                <div className="bg-black/30 rounded-xl p-4 mb-6 border-2 border-pink-500/30">
                  <h3 className="text-lg font-bold text-white mb-3">Base Stats</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">❤️ HP:</span>
                      <span className="text-red-400 font-bold">{selectedJablix.hp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">⚡ Energy:</span>
                      <span className="text-yellow-400 font-bold">{selectedJablix.energy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">⚔️ Attack:</span>
                      <span className="text-orange-400 font-bold">{selectedJablix.attack}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">🛡️ Defense:</span>
                      <span className="text-blue-400 font-bold">{selectedJablix.defense}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">💨 Speed:</span>
                      <span className="text-green-400 font-bold">{selectedJablix.speed}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/20 rounded-xl p-4 mb-6 border-2 border-yellow-500/50">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-white">Mint Cost:</span>
                    <span className="text-3xl font-black text-yellow-400">{mintCost} JXC</span>
                  </div>
                  {jxcBalance < mintCost && (
                    <p className="text-sm text-red-400 mt-2">
                      ⚠️ Insufficient JXC balance
                    </p>
                  )}
                </div>

                <button
                  onClick={handleMint}
                  disabled={isMinting || jxcBalance < mintCost || !account}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-black py-4 px-6 rounded-2xl text-xl transition-all transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isMinting ? '⏳ Minting...' : `🎨 Mint ${selectedJablix.name}`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
